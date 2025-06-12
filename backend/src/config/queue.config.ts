import { QueueOptions } from 'bullmq';

export const REDIS_CONFIG = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  tls: process.env.REDIS_TLS === 'true',
};

export const QUEUE_CONFIG: QueueOptions = {
  connection: REDIS_CONFIG,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    timeout: 30000, // 30 seconds
    removeOnComplete: true,
    removeOnFail: false,
  },
};

export const QUEUES = {
  GOAL: 'goal-queue',
} as const; 