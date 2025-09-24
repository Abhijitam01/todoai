import { Server } from 'http';
import { io as Client, Socket as ClientSocket } from 'socket.io-client';
import { createServer } from 'http';
import { RealtimeService } from '../src/services/realtime';
import { db } from '@todoai/database';
import { users, goals, tasks } from '@todoai/database';
import { eq } from 'drizzle-orm';

describe('Enhanced Realtime Service', () => {
  let httpServer: Server;
  let realtimeService: RealtimeService;
  let clientSocket: ClientSocket;
  let testUserId: string;
  let testGoalId: string;

  beforeAll(async () => {
    // Create test user
    const [testUser] = await db.insert(users).values({
      email: 'realtime@example.com',
      firstName: 'Realtime',
      lastName: 'User',
      password: 'hashedpassword'
    }).returning();

    testUserId = testUser.id;

    // Create test goal
    const [testGoal] = await db.insert(goals).values({
      userId: testUserId,
      title: 'Test Goal',
      description: 'Test Description',
      priority: 'high',
      status: 'active',
      progress: 0
    }).returning();

    testGoalId = testGoal.id;

    // Create HTTP server
    httpServer = createServer();
    
    // Initialize realtime service
    realtimeService = new RealtimeService();
    realtimeService.initialize(httpServer);

    // Start server
    await new Promise<void>((resolve) => {
      httpServer.listen(0, () => resolve());
    });

    const port = (httpServer.address() as any)?.port;
    
    // Create client connection
    clientSocket = Client(`http://localhost:${port}`, {
      transports: ['websocket']
    });
  });

  afterAll(async () => {
    // Clean up
    clientSocket.close();
    httpServer.close();
    
    await db.delete(tasks).where(eq(tasks.userId, testUserId));
    await db.delete(goals).where(eq(goals.userId, testUserId));
    await db.delete(users).where(eq(users.id, testUserId));
  });

  describe('Authentication', () => {
    it('should authenticate user with valid token', (done) => {
      const mockToken = 'valid-jwt-token';
      
      clientSocket.on('authenticated', (userData) => {
        expect(userData).toBeDefined();
        done();
      });

      clientSocket.on('auth_error', (error) => {
        done(error);
      });

      clientSocket.emit('authenticate', mockToken);
    });

    it('should reject invalid token', (done) => {
      const invalidToken = 'invalid-token';
      
      clientSocket.on('auth_error', (error) => {
        expect(error).toBeDefined();
        done();
      });

      clientSocket.emit('authenticate', invalidToken);
    });
  });

  describe('Goal Collaboration', () => {
    it('should handle goal joining', (done) => {
      clientSocket.on('user_joined_goal', (data) => {
        expect(data.goalId).toBe(testGoalId);
        expect(data.userData).toBeDefined();
        done();
      });

      clientSocket.emit('join_goal', testGoalId);
    });

    it('should handle goal leaving', (done) => {
      clientSocket.on('user_left_goal', (data) => {
        expect(data.goalId).toBe(testGoalId);
        done();
      });

      clientSocket.emit('leave_goal', testGoalId);
    });

    it('should handle typing indicators', (done) => {
      clientSocket.on('user_typing', (data) => {
        expect(data.goalId).toBe(testGoalId);
        expect(data.userData).toBeDefined();
        done();
      });

      clientSocket.emit('typing_start', testGoalId);
    });

    it('should handle cursor movement', (done) => {
      clientSocket.on('user_cursor_move', (data) => {
        expect(data.goalId).toBe(testGoalId);
        expect(data.x).toBe(100);
        expect(data.y).toBe(200);
        done();
      });

      clientSocket.emit('cursor_move', {
        goalId: testGoalId,
        x: 100,
        y: 200,
        element: 'title'
      });
    });
  });

  describe('Task Updates', () => {
    it('should handle task completion', (done) => {
      clientSocket.on('task_completed', (data) => {
        expect(data.taskId).toBeDefined();
        done();
      });

      clientSocket.emit('task_completed', { taskId: 'test-task-id' });
    });

    it('should handle task updates', (done) => {
      clientSocket.on('task_updated', (data) => {
        expect(data.taskId).toBeDefined();
        expect(data.updates).toBeDefined();
        done();
      });

      clientSocket.emit('task_updated', {
        taskId: 'test-task-id',
        updates: { status: 'completed' }
      });
    });
  });

  describe('Goal Updates', () => {
    it('should handle goal progress updates', (done) => {
      clientSocket.on('goal_progress_updated', (data) => {
        expect(data.goalId).toBe(testGoalId);
        expect(data.progress).toBe(50);
        done();
      });

      clientSocket.emit('goal_progress_update', {
        goalId: testGoalId,
        progress: 50
      });
    });

    it('should handle goal updates', (done) => {
      clientSocket.on('goal_updated', (data) => {
        expect(data.goalId).toBe(testGoalId);
        expect(data.updates).toBeDefined();
        done();
      });

      clientSocket.emit('goal_updated', {
        goalId: testGoalId,
        updates: { title: 'Updated Title' }
      });
    });
  });

  describe('Comments', () => {
    it('should handle comment addition', (done) => {
      clientSocket.on('comment_added', (data) => {
        expect(data.goalId).toBe(testGoalId);
        expect(data.comment).toBeDefined();
        done();
      });

      clientSocket.emit('add_comment', {
        goalId: testGoalId,
        taskId: 'test-task-id',
        comment: 'Test comment'
      });
    });
  });

  describe('User Statistics', () => {
    it('should send user statistics', (done) => {
      clientSocket.on('user_stats', (stats) => {
        expect(stats.totalGoals).toBeDefined();
        expect(stats.completedGoals).toBeDefined();
        expect(stats.totalTasks).toBeDefined();
        expect(stats.completedTasks).toBeDefined();
        done();
      });

      // Trigger user stats (this would normally be called by the service)
      realtimeService.sendUserStats(clientSocket as any);
    });
  });

  describe('AI Insights', () => {
    it('should send AI insights', (done) => {
      clientSocket.on('ai_insights', (insights) => {
        expect(insights.productivityScore).toBeDefined();
        expect(insights.recommendations).toBeDefined();
        done();
      });

      realtimeService.sendAIInsights(parseInt(testUserId), {
        productivityScore: 85,
        recommendations: ['Take more breaks', 'Focus on high-priority tasks'],
        patterns: {}
      });
    });
  });

  describe('Plan Adaptation', () => {
    it('should send plan adaptation notifications', (done) => {
      clientSocket.on('plan_adapted', (data) => {
        expect(data.goalId).toBe(testGoalId);
        expect(data.changes).toBeDefined();
        done();
      });

      realtimeService.sendPlanAdaptationNotification(parseInt(testUserId), parseInt(testGoalId), {
        createdIds: ['task1', 'task2'],
        updatedIds: ['task3'],
        archivedIds: ['task4']
      });
    });
  });

  describe('Achievements', () => {
    it('should send achievement notifications', (done) => {
      clientSocket.on('achievements_unlocked', (data) => {
        expect(data.achievements).toBeDefined();
        expect(Array.isArray(data.achievements)).toBe(true);
        done();
      });

      realtimeService.sendAchievementNotification(parseInt(testUserId), [{
        id: 'first_task',
        title: 'First Task',
        description: 'Complete your first task',
        icon: '🎯',
        rarity: 'common'
      }]);
    });
  });
});
