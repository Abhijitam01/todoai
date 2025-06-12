import { Worker, Job } from 'bullmq';
import { PrismaClient } from './generated/prisma';
import { generateGoalPlan } from './services/openai.service';
import { QUEUE_CONFIG, QUEUES } from './config/queue.config';
import { GoalJobData, GoalJobResult } from './queues/goal.queue';

const prisma = new PrismaClient();

// Create the goal worker
const goalWorker = new Worker<GoalJobData, GoalJobResult>(
  QUEUES.GOAL,
  async (job: Job<GoalJobData>): Promise<GoalJobResult> => {
    try {
      console.log(`Processing goal job ${job.id} for goal ${job.data.goalId}`);
      
      // First, fetch the goal to get its start_date
      const existingGoal = await prisma.goal.findUnique({
        where: { id: job.data.goalId },
        select: { start_date: true }
      });

      if (!existingGoal) {
        throw new Error('Goal not found');
      }

      const goalStartDate = existingGoal.start_date;

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
                create: milestone.tasks.map((task: any, taskIndex: number) => {
                  // Calculate task date based on goal start date
                  const taskDate = new Date(goalStartDate.getTime() + (milestone.week - 1) * 7 * 24 * 60 * 60 * 1000 + (task.day - 1) * 24 * 60 * 60 * 1000);
                  
                  return {
                    description: task.task,
                    original_planned_date: taskDate,
                    current_due_date: taskDate,
                    status: 'PENDING' as const,
                    order_in_goal: taskIndex + 1,
                    week_number: milestone.week,
                    day_number_in_week: task.day,
                  };
                }),
              },
            })),
          },
          status: 'ACTIVE' as const,
        },
      });

      console.log(`Successfully processed goal job ${job.id}`);
      return { success: true, plan };
    } catch (error) {
      console.error(`Error processing goal job ${job.id}:`, error);
      
      // Update goal status to failed
      await prisma.goal.update({
        where: { id: job.data.goalId },
        data: { status: 'FAILED' as const },
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

goalWorker.on('failed', async (job: Job<GoalJobData, GoalJobResult> | undefined, err: Error) => {
  console.error(`Job ${job?.id} failed:`, err);
});

goalWorker.on('error', (err: Error) => {
  console.error('Worker error:', err);
});

// Graceful shutdown
const shutdown = async () => {
  console.log('Shutting down worker...');
  await goalWorker.close();
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

console.log('Goal worker started and waiting for jobs...'); 