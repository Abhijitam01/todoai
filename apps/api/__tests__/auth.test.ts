import request from 'supertest';
import app from '../src/app';
import { db, users } from '@todoai/database';
import { eq } from 'drizzle-orm';

describe('Auth API', () => {
  let user: any;
  let token: string;

  beforeAll(async () => {
    // Clean up any existing test user
    await db.delete(users).where(eq(users.email, 'authuser@example.com'));
  });

  afterAll(async () => {
    if (user) await db.delete(users).where(eq(users.id, user.id));
  });

  it('should sign up a new user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: 'authuser@example.com',
        password: 'TestPassword123!',
        name: 'Auth User',
      });
    expect(res.status).toBe(201);
    expect(res.body.data.user.email).toBe('authuser@example.com');
    user = res.body.data.user;
  });

  it('should not allow duplicate signup', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: 'authuser@example.com',
        password: 'TestPassword123!',
        name: 'Auth User',
      });
    expect(res.status).toBe(409);
  });

  it('should not sign up with missing fields', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send({ email: 'missing@example.com' });
    expect(res.status).toBe(400);
  });

  it('should login with correct credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'authuser@example.com', password: 'TestPassword123!' });
    expect(res.status).toBe(200);
    expect(res.body.data.tokens.accessToken).toBeDefined();
    token = res.body.data.tokens.accessToken;
  });

  it('should not login with wrong password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'authuser@example.com', password: 'WrongPassword' });
    expect(res.status).toBe(401);
  });

  it('should not login with non-existent user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'nouser@example.com', password: 'TestPassword123!' });
    expect(res.status).toBe(401);
  });

  it('should access protected route with valid token', async () => {
    const res = await request(app)
      .get('/api/v1/goals')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).not.toBe(401);
  });

  it('should not access protected route with invalid token', async () => {
    const res = await request(app)
      .get('/api/v1/goals')
      .set('Authorization', 'Bearer invalidtoken');
    expect(res.status).toBe(401);
  });
}); 