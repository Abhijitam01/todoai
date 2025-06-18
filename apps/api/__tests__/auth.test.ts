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
          id: 'test-user-id', 
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User'
        }])
      })
    }),
    query: {
      users: {
        findFirst: jest.fn().mockResolvedValue({
          id: 'test-user-id',
          email: 'test@example.com',
          password: '$2b$10$hashedpassword'
        })
      }
    },
    delete: jest.fn().mockReturnValue({
      where: jest.fn().mockResolvedValue({ count: 1 })
    })
  };
  
  return {
    db: mockDb,
    users: { id: 'users-table' },
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

describe('Auth API', () => {
  let user: any;
  let token: string;

  beforeAll(async () => {
    // Setup is handled by mocks
  });

  afterAll(async () => {
    // Cleanup is handled by mocks
    jest.clearAllMocks();
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