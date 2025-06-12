import dotenv from 'dotenv';
dotenv.config({ path: require('path').resolve(__dirname, '../../.env') });

import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { createGoal } from './goals.controller';
import { PrismaClient } from '../../src/src/generated/prisma';

// Mock OpenAI service
jest.mock('../services/openai.service', () => ({
  generateGoalPlan: jest.fn().mockResolvedValue([
    {
      milestone: 'Milestone 1',
      week: 1,
      tasks: [
        { day: 1, task: 'Task 1', description: 'Desc 1' },
        { day: 2, task: 'Task 2', description: 'Desc 2' },
      ],
    },
  ]),
}));

// Async handler for Express
function asyncHandler(fn: any) {
  return (req: any, res: any, next: any) => Promise.resolve(fn(req, res, next)).catch(next);
}

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.user.create({
    data: {
      id: 'test-user-id',
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword',
    },
  });
});

afterAll(async () => {
  await prisma.goal.deleteMany({ where: { userId: 'test-user-id' } });
  await prisma.user.delete({ where: { id: 'test-user-id' } });
  await prisma.$disconnect();
});

const app = express();
app.use(bodyParser.json());
// Fake auth middleware
app.use((req, res, next) => {
  (req as any).user = { id: 'test-user-id' };
  next();
});
app.post('/api/goals', asyncHandler(createGoal));

describe('POST /api/goals', () => {
  it('creates a goal with valid input', async () => {
    const res = await request(app)
      .post('/api/goals')
      .send({
        title: 'Test Goal',
        durationDays: 7,
        timePerDayMinutes: 30,
        skillLevel: 'Beginner',
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('goalId');
    expect(res.body).toHaveProperty('message', 'Plan created successfully');
  });

  it('returns 400 for invalid input', async () => {
    const res = await request(app)
      .post('/api/goals')
      .send({ title: '', durationDays: 0, timePerDayMinutes: 0, skillLevel: 'Invalid' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  it('returns 401 if user is not authenticated', async () => {
    const unauthApp = express();
    unauthApp.use(bodyParser.json());
    unauthApp.post('/api/goals', asyncHandler(createGoal));
    const res = await request(unauthApp)
      .post('/api/goals')
      .send({
        title: 'Test Goal',
        durationDays: 7,
        timePerDayMinutes: 30,
        skillLevel: 'Beginner',
      });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Unauthorized');
  });
}); 