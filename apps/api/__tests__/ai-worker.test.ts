import dotenv from 'dotenv';
dotenv.config({ path: require('path').resolve(__dirname, '../.env') });

import { db, goals, users, tasks, eq } from '@todoai/database';
import { goalQueue } from '../src/queues/goal.queue';

// Mock the database operations to avoid real database connections in tests
jest.mock('@todoai/database', () => {
  const mockDb = {
    insert: jest.fn().mockReturnValue({
      values: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValue([{ id: 'test-id' }])
      })
    }),
    delete: jest.fn().mockReturnValue({
      where: jest.fn().mockResolvedValue({ count: 1 })
    }),
    query: {
      goals: {
        findFirst: jest.fn().mockResolvedValue({ id: 'test-goal-id' })
      },
      users: {
        findFirst: jest.fn().mockResolvedValue({ id: 'test-user-id' })
      },
      tasks: {
        findMany: jest.fn().mockResolvedValue([])
      }
    }
  };
  
  return {
    db: mockDb,
    goals: { id: 'goals-table' },
    users: { id: 'users-table' },
    tasks: { id: 'tasks-table' },
    eq: jest.fn()
  };
});

// Mock BullMQ to avoid Redis connection
jest.mock('../src/queues/goal.queue', () => ({
  goalQueue: {
    add: jest.fn().mockResolvedValue({ id: 'test-job-id' }),
    process: jest.fn(),
    close: jest.fn().mockResolvedValue(undefined)
  }
}));

describe('AI Worker Integration', () => {
  let user: any;
  let goal: any;

  beforeAll(async () => {
    // Mock user and goal data
    user = { id: 'test-user-id', email: 'test@example.com' };
    goal = { id: 'test-goal-id', userId: 'test-user-id', title: 'Test Goal' };
  });

  afterAll(async () => {
    // Cleanup mocks
    jest.clearAllMocks();
  });

// at the top of apps/api/__tests__/ai-worker.test.ts
import '../src/queues/goal.worker'; // spin up the worker in-process

  it('should enqueue a plan revision job and update tasks', async () => {
    // Mock the job processing with correct GoalJobData structure
    const mockJobData = {
      goalId: goal.id,
      userId: user.id,
      name: goal.title,
      duration_days: 7,
      time_per_day_hours: 1,
<<<<<<< HEAD
      skill_level: 'BEGINNER'
    };

    // Test that the job can be added to the queue
    const result = await goalQueue.add('revise-plan', mockJobData);
    
    expect(result).toHaveProperty('id');
    expect(goalQueue.add).toHaveBeenCalledWith('revise-plan', mockJobData);
=======
      skill_level: 'beginner',
    });
    // Wait until at least one job on the queue finishes
    await goalQueue.waitUntilReady();
    await goalQueue.whenCurrentJobsFinished();
    // Check that new tasks were created
    const updatedTasks = await db.select().from(tasks).where(eq(tasks.goalId, goal.id));
    expect(updatedTasks.length).toBeGreaterThan(0);
    // Optionally, check for email send attempt (mock/stub in real test)
>>>>>>> 5902c6537ea3dd13f98a819999edffc8998976a1
  });
}); 