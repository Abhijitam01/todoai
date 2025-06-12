import { Queue } from 'bullmq';
import { QUEUE_CONFIG, QUEUES } from '../config/queue.config';

export interface GoalJobData {
  userId: string;
  goalId: string;
  name: string;
  duration_days: number;
  time_per_day_hours: number;
  skill_level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
}

export interface GoalJobResult {
  success: boolean;
  error?: string;
  plan?: any;
}

// Create the goal queue
export const goalQueue = new Queue<GoalJobData, GoalJobResult>(QUEUES.GOAL, QUEUE_CONFIG); 