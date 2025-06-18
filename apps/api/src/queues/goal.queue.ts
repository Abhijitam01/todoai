import { Queue } from 'bullmq';
import { Job } from 'bullmq';

// --- Job Data Interfaces ---

// For the initial AI plan generation when a goal is created
export interface PlanGenerationJobData {
  userId: string;
  goalId: string;
  goalName: string;
  durationDays: number;
  timePerDayHours: number;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
}

// For the dynamic plan adaptation
export interface PlanAdaptationJobData {
  goalId: string;
  trigger: 'task_completed' | 'task_rescheduled' | 'task_skipped' | 'manual_trigger';
  // We can add more context later, like the specific task ID that triggered it
  // taskId?: string;
}

// Union type for all possible job data payloads
export type GoalJobData = PlanGenerationJobData | PlanAdaptationJobData;

// --- Job Names ---

// Use string literals for type safety
export type GoalJobName = 'generate-plan' | 'adapt-plan';

// --- Queue Configuration ---

// It's good practice to use an environment variable for the queue name
// to avoid collisions between environments (dev, staging, prod)
const QUEUE_NAME = 'goal-processing';

// Centralized connection options
const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
};

export const goalQueue = new Queue<GoalJobData, any>(QUEUE_NAME, {
  connection,
  defaultJobOptions: {
    attempts: 3, // Retry failed jobs 3 times
    backoff: {
      type: 'exponential',
      delay: 1000, // Start with 1s delay, then 2s, 4s, ...
    },
  },
});

// --- Enqueueing Service ---

// A more robust service to add jobs to the queue
class GoalQueueService {
  public async addJob(name: GoalJobName, data: GoalJobData): Promise<Job<GoalJobData, any>> {
    try {
      const job = await goalQueue.add(name, data, {
        // You can add job-specific options here if needed
        // For example, a unique job ID to prevent duplicates
        // jobId: name === 'adapt-plan' ? `adapt-${data.goalId}` : undefined,
      });
      console.log(`Successfully added job '${name}' for goalId: ${'goalId' in data ? data.goalId : 'N/A'}`);
      return job;
    } catch (error) {
      console.error(`Error adding job '${name}' to the queue`, error);
      // Depending on the app's needs, you might want to re-throw,
      // or handle this more gracefully (e.g., fallback to a sync process)
      throw error;
    }
  }
}

// Export a singleton instance of the service
export const goalQueueService = new GoalQueueService();
