import { Request, Response } from 'express';
// backend/src/controllers/goals.controller.ts

// Remove the bad import and keep only the correct one:
import { PrismaClient } from '../../generated/prisma';
import { z } from 'zod';
import { goalQueue } from '../queues/goal.queue';

const prisma = new PrismaClient();

const createGoalSchema = z.object({
  name: z.string().min(1, 'Goal name is required'),
  duration_days: z.number().int().min(1).max(365),
  time_per_day_hours: z.number().min(0.5).max(8),
  skill_level: z.enum(['beginner', 'intermediate', 'advanced']),
});

export const createGoal = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = createGoalSchema.parse(req.body);
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated', code: 401 });
      return;
    }

    // Create initial goal entry
    const goal = await prisma.goal.create({
      data: {
        userId,
        name: validatedData.name,
        duration_days: validatedData.duration_days,
        time_per_day_hours: validatedData.time_per_day_hours,
        skill_level: validatedData.skill_level,
        status: 'PLANNING',
        progress_percentage: 0,
        start_date: new Date(),
        end_date: new Date(Date.now() + validatedData.duration_days * 24 * 60 * 60 * 1000),
      },
    });

    // Add job to queue
    const job = await goalQueue.add('generate-plan', {
      userId,
      goalId: goal.id,
      name: validatedData.name,
      duration_days: validatedData.duration_days,
      time_per_day_hours: validatedData.time_per_day_hours,
      skill_level: validatedData.skill_level,
    });

    res.status(202).json({
      id: goal.id,
      name: goal.name,
      status: goal.status,
      jobId: job.id,
      message: 'Goal created successfully. AI plan generation in progress.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message, code: 400 });
      return;
    }
    console.error('Error creating goal:', error);
    res.status(500).json({ error: 'Internal server error', code: 500 });
  }
};

export const getGoalStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated', code: 401 });
      return;
    }

    const goal = await prisma.goal.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        milestones: {
          include: {
            tasks: true,
          },
        },
      },
    });

    if (!goal) {
      res.status(404).json({ error: 'Goal not found', code: 404 });
      return;
    }

    // Get job status if goal is in PLANNING state
    let jobStatus = null;
    if (goal.status === 'PLANNING') {
      const jobs = await goalQueue.getJobs(['active', 'waiting', 'failed', 'completed']);
      const job = jobs.find(j => {
        const data = j.data as any;
        return data.goalId === id;
      });
      
      if (job) {
        const state = await job.getState();
        jobStatus = {
          state,
          failedReason: job.failedReason,
          progress: job.progress,
          timestamp: job.timestamp,
          processedOn: job.processedOn,
          finishedOn: job.finishedOn,
        };
      }
    }

    res.status(200).json({
      id: goal.id,
      name: goal.name,
      status: goal.status,
      progress_percentage: goal.progress_percentage,
      jobStatus,
      milestones: goal.milestones,
    });
  } catch (error) {
    console.error('Error getting goal status:', error);
    res.status(500).json({ error: 'Internal server error', code: 500 });
  }
}; 