import { Queue } from 'bullmq';
import { db, users, goals, tasks } from '@todoai/database';
import { eq } from 'drizzle-orm';
import { goalQueue } from '../src/queues/goal.queue';

describe('AI Worker Integration', () => {
  let user: any;
  let goal: any;

  beforeAll(async () => {
    user = (await db.insert(users).values({
      email: 'aiworker@example.com',
      password: 'hashedpassword',
      firstName: 'AI',
      lastName: 'Worker',
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning())[0];
    goal = (await db.insert(goals).values({
      userId: user.id,
      title: 'AI Goal',
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning())[0];
  });

  afterAll(async () => {
    await db.delete(tasks).where(eq(tasks.goalId, goal.id));
    await db.delete(goals).where(eq(goals.id, goal.id));
    await db.delete(users).where(eq(users.id, user.id));
  });

  it('should enqueue a plan revision job and update tasks', async () => {
    // Enqueue a job (simulate /revise endpoint)
    await goalQueue.add('revise-plan', {
      goalId: goal.id,
      userId: user.id,
      name: goal.title,
      duration_days: 7,
      time_per_day_hours: 1,
      skill_level: 'beginner',
    });
    // Wait for worker to process (in real test, poll or use events)
    await new Promise((resolve) => setTimeout(resolve, 5000));
    // Check that new tasks were created
    const updatedTasks = await db.select().from(tasks).where(eq(tasks.goalId, goal.id));
    expect(updatedTasks.length).toBeGreaterThan(0);
    // Optionally, check for email send attempt (mock/stub in real test)
  });
}); 