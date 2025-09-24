import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { verify } from 'jsonwebtoken';
import { db, users, goals, tasks, taskComments } from '@todoai/database';
import { eq, and, sql } from 'drizzle-orm';

interface AuthenticatedSocket extends Socket {
  userId?: number;
  userData?: {
    id: number;
    email: string;
    name: string;
  };
}

export class RealtimeService {
  private io: SocketIOServer;
  private connectedUsers = new Map<number, Set<string>>();
  private userSockets = new Map<string, AuthenticatedSocket>();

  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
      },
      transports: ['websocket', 'polling'],
    });

    this.setupEventHandlers();
    console.log('🔗 Real-time service initialized');
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: AuthenticatedSocket) => {
      console.log(`🔌 Client connected: ${socket.id}`);

      // Authentication
      socket.on('authenticate', async (token: string) => {
        try {
          const decoded = verify(token, process.env.JWT_SECRET!) as any;
          
          // Get user data from database
          const userResult = await db.select({
            id: users.id,
            email: users.email,
            firstName: users.firstName,
            lastName: users.lastName
          }).from(users).where(eq(users.id, decoded.userId)).limit(1);

          if (userResult.length === 0) {
            socket.emit('auth_error', { message: 'User not found' });
            return;
          }

          const user = userResult[0];
          if (!user) {
            socket.emit('auth_error', { message: 'User not found' });
            return;
          }
          socket.userId = user.id;
          socket.userData = {
            id: user.id,
            email: user.email,
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email
          };

          // Track connected users
          if (!this.connectedUsers.has(user.id)) {
            this.connectedUsers.set(user.id, new Set());
          }
          this.connectedUsers.get(user.id)!.add(socket.id);
          this.userSockets.set(socket.id, socket);

          socket.emit('authenticated', { user });
          socket.join(`user_${user.id}`);

          console.log(`✅ User authenticated: ${user.email} (${socket.id})`);

          // Send real-time statistics
          this.sendUserStats(socket);
          
        } catch (error) {
          console.error('Authentication error:', error);
          socket.emit('auth_error', { message: 'Invalid token' });
        }
      });

      // Goal updates
      socket.on('goal_progress', async (data: { goalId: number; progress: number }) => {
        if (!socket.userId) return;

        try {
          await db.update(goals)
            .set({ 
              progress: data.progress,
              updatedAt: new Date()
            })
            .where(and(
              eq(goals.id, data.goalId),
              eq(goals.userId, socket.userId)
            ));

          // Broadcast to all user's connected devices
          this.io.to(`user_${socket.userId}`).emit('goal_updated', {
            goalId: data.goalId,
            progress: data.progress,
            timestamp: new Date().toISOString(),
          });

          console.log(`📊 Goal progress updated: User ${socket.userId}, Goal ${data.goalId}, Progress ${data.progress}%`);
        } catch (error) {
          console.error('Error updating goal progress:', error);
          socket.emit('error', { message: 'Failed to update goal progress' });
        }
      });

      // Task completion
      socket.on('task_completed', async (data: { taskId: number }) => {
        if (!socket.userId) return;

        try {
          const result = await db.update(tasks)
            .set({ 
              status: 'completed',
              completedAt: new Date(),
              updatedAt: new Date()
            })
            .where(and(
              eq(tasks.id, data.taskId),
              eq(tasks.userId, socket.userId)
            ))
            .returning({
              id: tasks.id,
              title: tasks.title,
              goalId: tasks.goalId
            });

          if (result.length > 0) {
            const task = result[0];
            if (!task) return;
            
            // Broadcast task completion
            this.io.to(`user_${socket.userId}`).emit('task_completed', {
              taskId: task.id,
              title: task.title,
              goalId: task.goal_id,
              timestamp: new Date().toISOString(),
            });

            // Update goal progress automatically
            await this.updateGoalProgress(task.goal_id, socket.userId);

            // Send achievement notification if applicable
            await this.checkAchievements(socket.userId, socket);
          }
        } catch (error) {
          console.error('Error completing task:', error);
          socket.emit('error', { message: 'Failed to complete task' });
        }
      });

      // Live collaboration (for team features)
      socket.on('join_goal', (goalId: number) => {
        socket.join(`goal_${goalId}`);
        socket.to(`goal_${goalId}`).emit('user_joined_goal', {
          userId: socket.userId,
          userData: socket.userData,
          goalId,
        });
      });

      socket.on('leave_goal', (goalId: number) => {
        socket.leave(`goal_${goalId}`);
        socket.to(`goal_${goalId}`).emit('user_left_goal', {
          userId: socket.userId,
          goalId,
        });
      });

      // Typing indicators for collaborative editing
      socket.on('typing_start', (goalId: number) => {
        socket.to(`goal_${goalId}`).emit('user_typing', {
          userId: socket.userId,
          userData: socket.userData,
          goalId,
        });
      });

      socket.on('typing_stop', (goalId: number) => {
        socket.to(`goal_${goalId}`).emit('user_stopped_typing', {
          userId: socket.userId,
          goalId,
        });
      });

      // Real-time task updates
      socket.on('task_updated', async (data: { taskId: number; updates: any }) => {
        if (!socket.userId) return;

        try {
          // Build update object with only valid fields
          const updateData: any = {
            updatedAt: new Date()
          };
          
          // Only update valid task fields
          const validFields = ['title', 'description', 'status', 'priority', 'dueDate'];
          for (const [key, value] of Object.entries(data.updates)) {
            if (validFields.includes(key)) {
              updateData[key] = value;
            }
          }
          
          const result = await db.update(tasks)
            .set(updateData)
            .where(and(
              eq(tasks.id, data.taskId),
              eq(tasks.userId, socket.userId)
            ))
            .returning({
              id: tasks.id,
              title: tasks.title,
              goalId: tasks.goalId,
              status: tasks.status,
              priority: tasks.priority
            });

          if (result.length > 0) {
            const task = result[0];
            if (!task) return;
            
            // Broadcast task update to goal collaborators
            this.io.to(`goal_${task.goal_id}`).emit('task_updated', {
              taskId: task.id,
              title: task.title,
              status: task.status,
              priority: task.priority,
              updatedBy: socket.userId,
              timestamp: new Date().toISOString(),
            });
          }
        } catch (error) {
          console.error('Error updating task:', error);
          socket.emit('error', { message: 'Failed to update task' });
        }
      });

      // Real-time goal updates
      socket.on('goal_updated', async (data: { goalId: number; updates: any }) => {
        if (!socket.userId) return;

        try {
          // Build update object with only valid fields
          const updateData: any = {
            updatedAt: new Date()
          };
          
          // Only update valid goal fields
          const validFields = ['title', 'description', 'status', 'progress', 'targetDate'];
          for (const [key, value] of Object.entries(data.updates)) {
            if (validFields.includes(key)) {
              updateData[key] = value;
            }
          }
          
          const result = await db.update(goals)
            .set(updateData)
            .where(and(
              eq(goals.id, data.goalId),
              eq(goals.userId, socket.userId)
            ))
            .returning({
              id: goals.id,
              title: goals.title,
              description: goals.description,
              status: goals.status,
              progress: goals.progress
            });

          if (result.length > 0) {
            const goal = result[0];
            if (!goal) return;
            
            // Broadcast goal update to collaborators
            this.io.to(`goal_${goal.id}`).emit('goal_updated', {
              goalId: goal.id,
              title: goal.title,
              description: goal.description,
              status: goal.status,
              progress: goal.progress,
              updatedBy: socket.userId,
              timestamp: new Date().toISOString(),
            });
          }
        } catch (error) {
          console.error('Error updating goal:', error);
          socket.emit('error', { message: 'Failed to update goal' });
        }
      });

      // Live cursor sharing for collaborative editing
      socket.on('cursor_move', (data: { goalId: number; x: number; y: number; element: string }) => {
        socket.to(`goal_${data.goalId}`).emit('user_cursor_move', {
          userId: socket.userId,
          userData: socket.userData,
          x: data.x,
          y: data.y,
          element: data.element,
          timestamp: new Date().toISOString(),
        });
      });

      // Live selection sharing
      socket.on('selection_change', (data: { goalId: number; selection: any }) => {
        socket.to(`goal_${data.goalId}`).emit('user_selection_change', {
          userId: socket.userId,
          userData: socket.userData,
          selection: data.selection,
          timestamp: new Date().toISOString(),
        });
      });

      // Real-time comments
      socket.on('add_comment', async (data: { goalId: number; taskId?: number; comment: string }) => {
        if (!socket.userId) return;

        try {
          const result = await db.insert(taskComments)
            .values({
              taskId: data.taskId || null,
              userId: socket.userId,
              content: data.comment,
              createdAt: new Date()
            })
            .returning({
              id: taskComments.id,
              content: taskComments.content,
              createdAt: taskComments.createdAt
            });

          if (result.length > 0) {
            const comment = result[0];
            if (!comment) return;
            
            // Broadcast new comment
            this.io.to(`goal_${data.goalId}`).emit('comment_added', {
              commentId: comment.id,
              content: comment.content,
              taskId: data.taskId,
              goalId: data.goalId,
              authorId: socket.userId,
              authorData: socket.userData,
              timestamp: comment.created_at,
            });
          }
        } catch (error) {
          console.error('Error adding comment:', error);
          socket.emit('error', { message: 'Failed to add comment' });
        }
      });

      // Disconnect handling
      socket.on('disconnect', () => {
        console.log(`🔌 Client disconnected: ${socket.id}`);
        
        if (socket.userId) {
          const userSockets = this.connectedUsers.get(socket.userId);
          if (userSockets) {
            userSockets.delete(socket.id);
            if (userSockets.size === 0) {
              this.connectedUsers.delete(socket.userId);
            }
          }
        }

        this.userSockets.delete(socket.id);
      });
    });
  }

  // Update goal progress based on completed tasks
  private async updateGoalProgress(goalId: number, userId: number) {
    try {
      const stats = await db
        .select({
          total: sql<number>`COUNT(*)`,
          completed: sql<number>`COUNT(CASE WHEN status = 'completed' THEN 1 END)`
        })
        .from(tasks)
        .where(and(
          eq(tasks.goalId, goalId.toString()),
          eq(tasks.userId, userId.toString())
        ));

      if (stats.length > 0) {
        const stat = stats[0];
        if (!stat) return;
        const total_tasks = stat.total ?? 0;
        const completed_tasks = stat.completed ?? 0;
        const progress = total_tasks > 0 ? Math.round((completed_tasks / total_tasks) * 100) : 0;

        await db.update(goals)
          .set({ 
            progress,
            updatedAt: new Date()
          })
          .where(and(
            eq(goals.id, goalId.toString()),
            eq(goals.userId, userId.toString())
          ));

        // Broadcast updated progress
        this.io.to(`user_${userId}`).emit('goal_progress_updated', {
          goalId,
          progress,
          totalTasks: total_tasks,
          completedTasks: completed_tasks,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Error updating goal progress:', error);
    }
  }

  // Send real-time user statistics
  private async sendUserStats(socket: AuthenticatedSocket) {
    if (!socket.userId) return;

    try {
      const stats = await db
        .select({
          totalGoals: sql<number>`COUNT(DISTINCT ${goals.id})`,
          completedGoals: sql<number>`COUNT(DISTINCT CASE WHEN ${goals.status} = 'completed' THEN ${goals.id} END)`,
          totalTasks: sql<number>`COUNT(DISTINCT ${tasks.id})`,
          completedTasks: sql<number>`COUNT(DISTINCT CASE WHEN ${tasks.status} = 'completed' THEN ${tasks.id} END)`,
          tasksToday: sql<number>`COUNT(DISTINCT CASE WHEN ${tasks.status} = 'completed' AND DATE(${tasks.completedAt}) = DATE('now') THEN ${tasks.id} END)`
        })
        .from(goals)
        .leftJoin(tasks, eq(goals.id, tasks.goalId))
        .where(eq(goals.userId, socket.userId.toString()));

      const userStats = stats[0];
      if (!userStats) return;

      socket.emit('user_stats', {
        totalGoals: userStats.totalGoals ?? 0,
        completedGoals: userStats.completedGoals ?? 0,
        totalTasks: userStats.totalTasks ?? 0,
        completedTasks: userStats.completedTasks ?? 0,
        tasksCompletedToday: userStats.tasksToday ?? 0,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error sending user stats:', error);
    }
  }

  // Check and award achievements
  private async checkAchievements(userId: number, socket: AuthenticatedSocket) {
    try {
      const achievements = [];

      // Get user's task completion stats
      const stats = await db
        .select({
          totalCompleted: sql<number>`COUNT(*)`,
          completedToday: sql<number>`COUNT(CASE WHEN DATE(${tasks.completedAt}) = DATE('now') THEN 1 END)`,
          completedWeek: sql<number>`COUNT(CASE WHEN ${tasks.completedAt} >= DATE('now', '-7 days') THEN 1 END)`
        })
        .from(tasks)
        .where(and(
          eq(tasks.userId, userId.toString()),
          eq(tasks.status, 'completed')
        ));

      const userStats = stats[0];
      if (!userStats) return;
      const totalCompleted = userStats.totalCompleted ?? 0;
      const completedToday = userStats.completedToday ?? 0;
      const completedWeek = userStats.completedWeek ?? 0;

      // Achievement: First task
      if (totalCompleted === 1) {
        achievements.push({
          id: 'first_task',
          title: 'Getting Started!',
          description: 'Completed your first task',
          icon: '🎯',
          rarity: 'common',
        });
      }

      // Achievement: 10 tasks
      if (totalCompleted === 10) {
        achievements.push({
          id: 'ten_tasks',
          title: 'Task Master',
          description: 'Completed 10 tasks',
          icon: '⭐',
          rarity: 'uncommon',
        });
      }

      // Achievement: 100 tasks
      if (totalCompleted === 100) {
        achievements.push({
          id: 'hundred_tasks',
          title: 'Productivity Champion',
          description: 'Completed 100 tasks!',
          icon: '🏆',
          rarity: 'rare',
        });
      }

      // Achievement: 5 tasks in one day
      if (completedToday === 5) {
        achievements.push({
          id: 'five_day',
          title: 'Daily Warrior',
          description: 'Completed 5 tasks in one day',
          icon: '🔥',
          rarity: 'uncommon',
        });
      }

      // Achievement: 7-day streak
      if (completedWeek >= 7) {
        achievements.push({
          id: 'week_streak',
          title: 'Weekly Warrior',
          description: 'Stayed consistent for a week',
          icon: '💪',
          rarity: 'rare',
        });
      }

      // Send achievements
      if (achievements.length > 0) {
        socket.emit('achievements_unlocked', {
          achievements,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  }

  // Broadcast system-wide announcements
  public broadcastAnnouncement(message: string, type: 'info' | 'warning' | 'success' = 'info') {
    this.io.emit('system_announcement', {
      message,
      type,
      timestamp: new Date().toISOString(),
    });
  }

  // Send notification to specific user
  public sendUserNotification(userId: number, notification: {
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    actionUrl?: string;
  }) {
    this.io.to(`user_${userId}`).emit('notification', {
      ...notification,
      timestamp: new Date().toISOString(),
    });
  }

  // Get connected users count
  public getConnectedUsersCount(): number {
    return this.connectedUsers.size;
  }

  // Get socket.io instance for external use
  public getIO(): SocketIOServer {
    return this.io;
  }

  // Send real-time plan adaptation notification
  public sendPlanAdaptationNotification(userId: number, goalId: number, changes: {
    createdIds: string[];
    updatedIds: string[];
    archivedIds: string[];
  }) {
    this.io.to(`user_${userId}`).emit('plan_adapted', {
      goalId,
      changes,
      timestamp: new Date().toISOString(),
    });
  }

  // Send real-time AI insights
  public sendAIInsights(userId: number, insights: {
    productivityScore: number;
    recommendations: string[];
    patterns: any;
  }) {
    this.io.to(`user_${userId}`).emit('ai_insights', {
      insights,
      timestamp: new Date().toISOString(),
    });
  }

  // Send real-time deadline warnings
  public sendDeadlineWarning(userId: number, goalId: number, daysRemaining: number) {
    this.io.to(`user_${userId}`).emit('deadline_warning', {
      goalId,
      daysRemaining,
      message: `Only ${daysRemaining} days left to complete your goal!`,
      timestamp: new Date().toISOString(),
    });
  }

  // Send real-time streak updates
  public sendStreakUpdate(userId: number, streak: number, type: 'daily' | 'weekly' | 'monthly') {
    this.io.to(`user_${userId}`).emit('streak_update', {
      streak,
      type,
      message: `Amazing! You've maintained a ${type} streak of ${streak} days!`,
      timestamp: new Date().toISOString(),
    });
  }

  // Get users currently viewing a goal
  public getGoalViewers(goalId: number): number[] {
    const room = this.io.sockets.adapter.rooms.get(`goal_${goalId}`);
    if (!room) return [];
    
    const viewers: number[] = [];
    for (const socketId of room) {
      const socket = this.userSockets.get(socketId);
      if (socket?.userId) {
        viewers.push(socket.userId);
      }
    }
    return viewers;
  }

  // Send presence updates
  public sendPresenceUpdate(goalId: number, userId: number, status: 'online' | 'away' | 'offline') {
    this.io.to(`goal_${goalId}`).emit('user_presence_change', {
      userId,
      status,
      timestamp: new Date().toISOString(),
    });
  }
}

// Initialize function for easy integration
export function initializeRealTimeService(io: SocketIOServer): RealtimeService {
  const service = new RealtimeService(io as any);
  return service;
}

export default RealtimeService; 