import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { verify } from 'jsonwebtoken';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

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
          const userResult = await sql`
            SELECT id, email, name FROM "User" WHERE id = ${decoded.userId}
          `;

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
          socket.userData = user as { id: number; email: string; name: string };

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
          await sql`
            UPDATE "Goal" 
            SET progress = ${data.progress}, updated_at = NOW()
            WHERE id = ${data.goalId} AND user_id = ${socket.userId}
          `;

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
          const result = await sql`
            UPDATE "Task" 
            SET completed = true, completed_at = NOW(), updated_at = NOW()
            WHERE id = ${data.taskId} AND user_id = ${socket.userId}
            RETURNING id, title, goal_id
          `;

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
      const stats = await sql`
        SELECT 
          COUNT(*) as total_tasks,
          COUNT(CASE WHEN completed = true THEN 1 END) as completed_tasks
        FROM "Task"
        WHERE goal_id = ${goalId} AND user_id = ${userId}
      `;

      if (stats.length > 0) {
        if (!stats[0]) return;
        const total_tasks = stats[0]?.total_tasks ?? 0;
        const completed_tasks = stats[0]?.completed_tasks ?? 0;
        const progress = total_tasks > 0 ? Math.round((completed_tasks / total_tasks) * 100) : 0;

        await sql`
          UPDATE "Goal"
          SET progress = ${progress}, updated_at = NOW()
          WHERE id = ${goalId} AND user_id = ${userId}
        `;

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
      const stats = await sql`
        SELECT 
          COUNT(DISTINCT g.id) as total_goals,
          COUNT(DISTINCT CASE WHEN g.completed = true THEN g.id END) as completed_goals,
          COUNT(DISTINCT t.id) as total_tasks,
          COUNT(DISTINCT CASE WHEN t.completed = true THEN t.id END) as completed_tasks,
          COUNT(DISTINCT CASE WHEN t.completed = true AND t.completed_at >= CURRENT_DATE THEN t.id END) as tasks_today
        FROM "Goal" g
        LEFT JOIN "Task" t ON g.id = t.goal_id
        WHERE g.user_id = ${socket.userId}
      `;

      const userStats = stats[0];
      if (!userStats) return;

      socket.emit('user_stats', {
        totalGoals: parseInt(userStats.total_goals ?? '0'),
        completedGoals: parseInt(userStats.completed_goals ?? '0'),
        totalTasks: parseInt(userStats.total_tasks ?? '0'),
        completedTasks: parseInt(userStats.completed_tasks ?? '0'),
        tasksCompletedToday: parseInt(userStats.tasks_today ?? '0'),
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
      const stats = await sql`
        SELECT 
          COUNT(*) as total_completed,
          COUNT(CASE WHEN completed_at >= CURRENT_DATE THEN 1 END) as completed_today,
          COUNT(CASE WHEN completed_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as completed_week
        FROM "Task"
        WHERE user_id = ${userId} AND completed = true
      `;

      const userStats = stats[0];
      if (!userStats) return;
      const totalCompleted = parseInt(userStats.total_completed ?? '0');
      const completedToday = parseInt(userStats.completed_today ?? '0');
      const completedWeek = parseInt(userStats.completed_week ?? '0');

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
}

// Initialize function for easy integration
export function initializeRealTimeService(io: SocketIOServer): RealtimeService {
  const service = new RealtimeService(io as any);
  return service;
}

export default RealtimeService; 