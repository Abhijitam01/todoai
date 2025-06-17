import request from 'supertest';
import app from '../src/app';
import { db, users, goals, tasks } from '@todoai/database';
import { eq } from 'drizzle-orm';

describe('Tasks API', () => {
  let user: any;
  let token: string;
  let goal: any;
  let task: any;

  beforeAll(async () => {
    // Create test user and 
    user = (await db.insert(users).values({
      email: 'taskuser@example.com',
      password: 'hashedpassword',
      firstName: 'Task',
      lastName: 'User',
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning())[0];
    goal = (await db.insert(goals).values({
      userId: user.id,
      title: 'Task Goal',
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning())[0];
    token = 'test-token';
  });

  afterAll(async () => {
    await db.delete(tasks).where(eq(tasks.goalId, goal.id));
    await db.delete(goals).where(eq(goals.id, goal.id));
    await db.delete(users).where(eq(users.id, user.id));
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
    task = res.body.data;
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

  // Add more edge case tests as needed (invalid payloads, today endpoint, filtering, etc.)
}); 