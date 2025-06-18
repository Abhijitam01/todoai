import dotenv from 'dotenv';
dotenv.config({ path: require('path').resolve(__dirname, '../.env') });

import request from 'supertest';
import app from '../src/app';

// Mock the database to avoid connection issues
jest.mock('@todoai/database', () => {
  const mockDb = {
    insert: jest.fn().mockReturnValue({
      values: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValue([{ 
          id: 'test-task-id', 
          title: 'Test Task',
          userId: 'test-user-id',
          status: 'pending'
        }])
      })
    }),
    query: {
      tasks: {
        findMany: jest.fn().mockResolvedValue([{
          id: 'test-task-id',
          title: 'Test Task',
          userId: 'test-user-id',
          status: 'pending'
        }])
      }
    },
    delete: jest.fn().mockReturnValue({
      where: jest.fn().mockResolvedValue({ count: 1 })
    }),
    update: jest.fn().mockReturnValue({
      set: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValue([{
          id: 'test-task-id',
          title: 'Updated Task',
          status: 'completed'
        }])
      })
    })
  };
  
  return {
    db: mockDb,
    tasks: { id: 'tasks-table' },
    users: { id: 'users-table' },
    goals: { id: 'goals-table' },
    eq: jest.fn()
  };
});

// Mock BullMQ to avoid Redis connection
jest.mock('../src/queues/goal.queue', () => ({
  goalQueue: {
    add: jest.fn().mockResolvedValue({ id: 'test-job-id' }),
    close: jest.fn().mockResolvedValue(undefined)
  }
}));

describe('Tasks API', () => {
  let user: any;
  let token: string;
  let goal: any;
  let task: any;

  beforeAll(async () => {
    // Mock user, goal, and task data
    user = { id: 'test-user-id', email: 'taskuser@example.com' };
    goal = { id: 'test-goal-id', title: 'Task Goal', userId: 'test-user-id' };
    task = { id: 'test-task-id', title: 'Test Task', userId: 'test-user-id' };
    token = 'test-token'; // In real tests, generate a valid JWT
  });

  afterAll(async () => {
    // Cleanup is handled by mocks
    jest.clearAllMocks();
  });

  it('should create a new task', async () => {
    const res = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Task',
        goalId: goal.id,
        dueDate: new Date().toISOString(),
      });
    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe('Test Task');
  });

  it('should get all tasks for the user', async () => {
    const res = await request(app)
      .get('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should get a task by id', async () => {
    const res = await request(app)
      .get(`/api/v1/tasks/${task.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(task.id);
  });

  it('should update a task', async () => {
    const res = await request(app)
      .patch(`/api/v1/tasks/${task.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'completed' });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('completed');
  });

  it('should delete a task', async () => {
    const res = await request(app)
      .delete(`/api/v1/tasks/${task.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.isArchived).toBe(true);
  });

  it('should return 404 for non-existent task', async () => {
    const res = await request(app)
      .get('/api/v1/tasks/nonexistentid')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  it('should not allow unauthorized access', async () => {
    const res = await request(app)
      .get('/api/v1/tasks')
      .set('Authorization', 'Bearer invalidtoken');
    expect(res.status).toBe(401);
  });
}); 