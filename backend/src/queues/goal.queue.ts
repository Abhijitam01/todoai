import { Queue, Worker, Job } from 'bullmq';
-import { PrismaClient } from '../src/generated/prisma';
+import { PrismaClient } from '../generated/prisma';
import { generateGoalPlan } from '../services/openai.service';
import { QUEUE_CONFIG, QUEUES } from '../config/queue.config';

const prisma = new PrismaClient();

interface GoalJobData {
  userId: string;
  goalId: string;
  name: string;
  duration_days: number;
  time_per_day_hours: number;
  skill_level: string;
}

interface GoalJobResult {
  success: boolean;
  error?: string;
  plan?: any;
}

// Create the goal queue
export const goalQueue = new Queue<GoalJobData, GoalJobResult>(QUEUES.GOAL, QUEUE_CONFIG);

// Process goal jobs
export const goalWorker = new Worker<GoalJobData, GoalJobResult>(
  QUEUES.GOAL,
  async (job: Job<GoalJobData>): Promise<GoalJobResult> => {
    try {
      // Generate AI plan
      const plan = await generateGoalPlan({
        title: job.data.name,
        durationDays: job.data.duration_days,
        timePerDayMinutes: job.data.time_per_day_hours * 60,
        skillLevel: job.data.skill_level,
      });

      // Save plan to database
      const goal = await prisma.goal.update({
        where: { id: job.data.goalId },
        data: {
          milestones: {
            create: plan.map((milestone: any, index: number) => ({
              name: milestone.milestone,
              week_number: milestone.week,
              order_in_goal: index + 1,
              tasks: {
                create: milestone.tasks.map((task: any, taskIndex: number) => ({
                  description: task.task,
                  original_planned_date: new Date(Date.now() + (milestone.week - 1) * 7 * 24 * 60 * 60 * 1000 + (task.day - 1) * 24 * 60 * 60 * 1000),
                  current_due_date: new Date(Date.now() + (milestone.week - 1) * 7 * 24 * 60 * 60 * 1000 + (task.day - 1) * 24 * 60 * 60 * 1000),
                  status: 'PENDING',
                  order_in_goal: taskIndex + 1,
                  week_number: milestone.week,
                  day_number_in_week: task.day,
                })),
              },
            })),
          },
          status: 'ACTIVE',
        },
      });

      return { success: true, plan };
    } catch (error) {
      console.error('Error processing goal job:', error);
      
      // Update goal status to failed
      await prisma.goal.update({
        where: { id: job.data.goalId },
        data: { status: 'FAILED' },
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },
  {
    ...QUEUE_CONFIG,
    concurrency: 3, // Process up to 3 jobs concurrently
  }
);

// Handle worker events
goalWorker.on('completed', async (job: Job<GoalJobData, GoalJobResult>) => {
  console.log(`Job ${job.id} completed successfully`);
});

goalWorker.on('failed', async (job: Job<GoalJobData, GoalJobResult>, err: Error) => {
  console.error(`Job ${job.id} failed:`, err);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  await goalWorker.close();
  await goalQueue.close();
  await prisma.$disconnect();
});