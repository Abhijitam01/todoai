import request from 'supertest';
import app from '../src/app';
import { db, goals, users } from '@todoai/database';
import { eq } from 'drizzle-orm';

describe('GET /api/v1/goals', () => {
  let user: any;
  let token: string;
  let goal: any;

  beforeAll(async () => {
    // Create test user
    user = (await db.insert(users).values({
      email: 'testuser@example.com',
      password: 'hashedpassword',
      firstName: 'Test',
      lastName: 'User',
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning())[0];
    // Create test goal
    goal = (await db.insert(goals).values({
      userId: user.id,
      title: 'Test Goal',
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning())[0];
    // Mock JWT (replace with real token logic if needed)
    token = 'test-token';
  });

  afterAll(async () => {
    await db.delete(goals).where(eq(goals.id, goal.id));
    await db.delete(users).where(eq(users.id, user.id));
  });

  it('should return the user goals', async () => {
    const res = await request(app)
      .get('/api/v1/goals')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    // Optionally, check for the test goal
    // expect(res.body.data.some((g: any) => g.id === goal.id)).toBe(true);
  });
}); 