import { Queue } from 'bullmq';

// Simple types for goal processing
export interface GoalJobData {
  userId: string;
  goalId: string;
  name: string;
  duration_days: number;
  time_per_day_hours: number;
  skill_level: string;
}

export interface GoalJobResult {
  success: boolean;
  goalId: string;
}

// Create a basic queue for goal processing
export const goalQueue = new Queue<GoalJobData, GoalJobResult>('goal-processing', {
  connection: {
    host: 'localhost',
    port: 6379,
  },
});

// Export a simple add method for compatibility
goalQueue.add = async (name: string, data: GoalJobData) => {
  // Stub implementation - in real app this would process the queue
  return { id: `job-${Date.now()}` } as any;
};
