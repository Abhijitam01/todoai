import dotenv from 'dotenv';
dotenv.config({ path: require('path').resolve(__dirname, '../../.env') });

import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { createGoal, getGoalStatus } from './goals.controller';
import { PrismaClient } from '../../src/src/generated/prisma';
import { goalQueue } from '../queues/goal.queue';

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

// Mock BullMQ
jest.mock('../queues/goal.queue', () => ({
  goalQueue: {
    add: jest.fn().mockResolvedValue({ id: 'test-job-id' }),
    getJobs: jest.fn().mockResolvedValue([
      {
        data: { goalId: 'test-goal-id' },
        getState: jest.fn().mockResolvedValue('completed'),
        failedReason: null,
        progress: 100,
        timestamp: Date.now(),
        processedOn: Date.now(),
        finishedOn: Date.now(),
      },
    ]),
  },
}));

// Mock Prisma
jest.mock('../../src/src/generated/prisma', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    goal: {
      create: jest.fn().mockResolvedValue({
        id: 'test-goal-id',
        name: 'Test Goal',
        status: 'PLANNING',
      }),
      findFirst: jest.fn().mockResolvedValue({
        id: 'test-goal-id',
        name: 'Test Goal',
        status: 'PLANNING',
        progress_percentage: 0,
        milestones: [],
      }),
    },
  })),
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
app.use((req, res, next) => {
  req.user = { id: 'test-user-id' };
  next();
});
app.post('/goals', createGoal);
app.get('/goals/:id/status', getGoalStatus);

describe('Goals Controller', () => {
  describe('POST /goals', () => {
    it('creates a goal and returns job ID', async () => {
      const res = await request(app)
        .post('/goals')
        .send({
          name: 'Test Goal',
          duration_days: 7,
          time_per_day_hours: 1,
          skill_level: 'beginner',
        });

      expect(res.status).toBe(202);
      expect(res.body).toHaveProperty('id', 'test-goal-id');
      expect(res.body).toHaveProperty('jobId', 'test-job-id');
      expect(res.body).toHaveProperty('status', 'PLANNING');
      expect(res.body.message).toContain('AI plan generation in progress');
    });

    it('returns 400 for invalid input', async () => {
      const res = await request(app)
        .post('/goals')
        .send({
          name: '',
          duration_days: 0,
          time_per_day_hours: 0,
          skill_level: 'invalid',
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('returns 401 if user is not authenticated', async () => {
      const unauthApp = express();
      unauthApp.use(bodyParser.json());
      unauthApp.post('/goals', createGoal);

      const res = await request(unauthApp)
        .post('/goals')
        .send({
          name: 'Test Goal',
          duration_days: 7,
          time_per_day_hours: 1,
          skill_level: 'beginner',
        });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('User not authenticated');
    });
  });

  describe('GET /goals/:id/status', () => {
    it('returns goal status with job info', async () => {
      const res = await request(app).get('/goals/test-goal-id/status');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', 'test-goal-id');
      expect(res.body).toHaveProperty('status', 'PLANNING');
      expect(res.body).toHaveProperty('jobStatus');
      expect(res.body.jobStatus).toHaveProperty('state', 'completed');
    });

    it('returns 404 for non-existent goal', async () => {
      const prisma = new PrismaClient();
      (prisma.goal.findFirst as jest.Mock).mockResolvedValueOnce(null);

      const res = await request(app).get('/goals/non-existent-id/status');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Goal not found');
    });

    it('returns 401 if user is not authenticated', async () => {
      const unauthApp = express();
      unauthApp.use(bodyParser.json());
      unauthApp.get('/goals/:id/status', getGoalStatus);

      const res = await request(unauthApp).get('/goals/test-goal-id/status');

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('User not authenticated');
    });
  });
}); 