import request from 'supertest';
import { app } from '../src/app';
import { db } from '@todoai/database';
import { users, goals, tasks } from '@todoai/database';
import { eq } from 'drizzle-orm';

describe('Enhanced Goals API', () => {
  let authToken: string;
  let userId: string;
  let testGoalId: string;

  beforeAll(async () => {
    // Create test user
    const [testUser] = await db.insert(users).values({
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      password: 'hashedpassword'
    }).returning();

    userId = testUser.id;
    
    // Mock JWT token (in real tests, you'd generate a proper token)
    authToken = 'mock-jwt-token';
  });

  afterAll(async () => {
    // Clean up test data
    await db.delete(tasks).where(eq(tasks.userId, userId));
    await db.delete(goals).where(eq(goals.userId, userId));
    await db.delete(users).where(eq(users.id, userId));
  });

  describe('GET /goals', () => {
    it('should return goals with task statistics', async () => {
      // Create test goal
      const [testGoal] = await db.insert(goals).values({
        userId,
        title: 'Test Goal',
        description: 'Test Description',
        priority: 'high',
        status: 'active',
        progress: 0
      }).returning();

      testGoalId = testGoal.id;

      // Create test tasks
      await db.insert(tasks).values([
        {
          userId,
          goalId: testGoalId,
          title: 'Task 1',
          status: 'completed',
          order: 0
        },
        {
          userId,
          goalId: testGoalId,
          title: 'Task 2',
          status: 'pending',
          order: 1
        }
      ]);

      const response = await request(app)
        .get('/api/v1/goals?includeStats=true')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].taskStats).toBeDefined();
      expect(response.body.data[0].taskStats.total).toBe(2);
      expect(response.body.data[0].taskStats.completed).toBe(1);
      expect(response.body.data[0].taskStats.pending).toBe(1);
    });

    it('should filter goals by status', async () => {
      const response = await request(app)
        .get('/api/v1/goals?status=active')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.every((goal: any) => goal.status === 'active')).toBe(true);
    });

    it('should paginate results', async () => {
      const response = await request(app)
        .get('/api/v1/goals?page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.pagination).toBeDefined();
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(10);
    });
  });

  describe('GET /goals/:id', () => {
    it('should return a specific goal with task statistics', async () => {
      const response = await request(app)
        .get(`/api/v1/goals/${testGoalId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(testGoalId);
      expect(response.body.data.taskStats).toBeDefined();
    });

    it('should return 404 for non-existent goal', async () => {
      const response = await request(app)
        .get('/api/v1/goals/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /goals/:id', () => {
    it('should update goal and trigger plan adaptation', async () => {
      const updateData = {
        title: 'Updated Goal Title',
        targetDate: '2024-12-31',
        timePerDay: 2
      };

      const response = await request(app)
        .put(`/api/v1/goals/${testGoalId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updateData.title);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .put(`/api/v1/goals/${testGoalId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: '' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PATCH /goals/:id', () => {
    it('should partially update goal', async () => {
      const response = await request(app)
        .patch(`/api/v1/goals/${testGoalId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'paused' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('paused');
    });
  });

  describe('DELETE /goals/:id', () => {
    it('should archive goal and cascade archive tasks', async () => {
      const response = await request(app)
        .delete(`/api/v1/goals/${testGoalId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify goal is archived
      const [archivedGoal] = await db.select().from(goals).where(eq(goals.id, testGoalId));
      expect(archivedGoal.isArchived).toBe(true);

      // Verify tasks are also archived
      const archivedTasks = await db.select().from(tasks).where(eq(tasks.goalId, testGoalId));
      expect(archivedTasks.every(task => task.isArchived)).toBe(true);
    });
  });

  describe('POST /goals/:id/revise', () => {
    it('should trigger AI plan revision', async () => {
      const response = await request(app)
        .post(`/api/v1/goals/${testGoalId}/revise`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });
});
