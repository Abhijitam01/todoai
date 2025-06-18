import { Worker, Job } from 'bullmq';
import { GoalJobData, GoalJobName, PlanAdaptationJobData, PlanGenerationJobData } from './goal.queue';
import { planningService } from '../services/planning.service';

const QUEUE_NAME = 'goal-processing';

// Centralized connection options from environment variables for consistency
const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
};

console.log(`[GoalWorker] Starting BullMQ worker for queue: ${QUEUE_NAME}`);

/**
 * Handles the 'adapt-plan' job.
 * Calls the planning service to perform the complex adaptation logic.
 */
async function handlePlanAdaptation(job: Job<PlanAdaptationJobData, any>) {
  const { goalId, trigger } = job.data;
  console.log(`[GoalWorker] Handling 'adapt-plan' job for goalId: ${goalId}. Triggered by: ${trigger}`);
  try {
    const result = await planningService.adaptPlan(goalId);
    console.log(`[GoalWorker] Finished 'adapt-plan' job for goalId: ${goalId} with success: ${result.success}`);
    return result;
  } catch (error) {
    console.error(`[GoalWorker] Error during 'adapt-plan' for goalId: ${goalId}`, error);
    // The error will be thrown, causing the job to fail and be retried by BullMQ
    throw error;
  }
}

/**
 * Handles the 'generate-plan' job.
 * This is where the logic from the original PRD for initial plan creation would go.
 */
async function handlePlanGeneration(job: Job<PlanGenerationJobData, any>) {
  const { goalId, goalName } = job.data;
  console.log(`[GoalWorker] Handling 'generate-plan' job for goal: "${goalName}" (goalId: ${goalId})`);
  // TODO: Implement the initial plan generation logic by calling a
  // dedicated method in the planningService, similar to adaptPlan.
  console.warn(`[GoalWorker] 'generate-plan' job handler is not yet implemented.`);
  return { success: true, message: 'Job received, implementation pending.' };
}

// --- Main Worker Process ---

const worker = new Worker<GoalJobData, any>(
  QUEUE_NAME,
  async (job: Job<GoalJobData, any>) => {
    console.log(`[GoalWorker] Received job '${job.name}' with id ${job.id}`);
    
    // Router to delegate job to the correct handler
    switch (job.name as GoalJobName) {
      case 'adapt-plan':
        // We need to cast the job to the correct type for the handler
        return handlePlanAdaptation(job as Job<PlanAdaptationJobData, any>);
      case 'generate-plan':
        return handlePlanGeneration(job as Job<PlanGenerationJobData, any>);
      default:
        // This should not happen if jobs are enqueued correctly
        console.error(`[GoalWorker] Unknown job name: ${job.name}`);
        throw new Error(`Unknown job name: ${job.name}`);
    }
  },
  {
    connection,
    // Concurrency can be adjusted based on application load and resources
    concurrency: 5, 
    // For production, you might configure limits for how long a job can run
    // limiter: { max: 100, duration: 1000 * 60 },
  }
);

worker.on('completed', (job, result) => {
  console.log(`[GoalWorker] Job ${job.id} (${job.name}) completed successfully. Result:`, result);
});

worker.on('failed', (job, err) => {
  console.error(`[GoalWorker] Job ${job?.id} (${job?.name}) failed with error:`, err.message);
  // TODO: For production, integrate with an alerting service (e.g., Sentry, DataDog)
  // to notify developers of persistent job failures.
});

console.log('[GoalWorker] Worker is listening for jobs...'); 