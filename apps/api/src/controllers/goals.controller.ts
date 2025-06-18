import { db, goals } from '@todoai/database';
import { eq, and } from 'drizzle-orm';
import { goalQueue } from '../queues/goal.queue';
import { Request, Response } from 'express';

// Helper: Validate goal input
function validateGoalInput(body: any) {
  const { name, duration_days, time_per_day_hours, skill_level } = body;
  if (!name || typeof name !== 'string' || name.trim().length < 2) return 'Invalid goal name';
  if (!duration_days || typeof duration_days !== 'number' || duration_days < 1) return 'Invalid duration';
  if (!time_per_day_hours || typeof time_per_day_hours !== 'number' || time_per_day_hours <= 0) return 'Invalid time per day';
  if (!skill_level || !['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].includes(skill_level)) return 'Invalid skill level';
  return null;
}

// CREATE: Add a new goal and trigger async AI plan generation
export const createGoal = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check authentication
    if (!req.user?.id) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    // Validate input
    const validationError = validateGoalInput(req.body);
    if (validationError) {
      res.status(400).json({ error: validationError });
      return;
    }

    const { name, duration_days, time_per_day_hours, skill_level } = req.body;

    // Create goal record with correct schema fields
    const [goal] = await db.insert(goals).values({
      title: name,
      userId: req.user.id,
      status: 'active', // Use schema-defined status values
      description: `Learning goal: ${name}`,
      priority: 'medium',
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    if (!goal) {
      res.status(500).json({ error: 'Failed to create goal' });
      return;
    }

    // Enqueue async AI plan generation job
    const job = await goalQueue.add('generate-plan', {
      goalId: goal.id,
      userId: req.user.id,
      name,
      duration_days,
      time_per_day_hours,
      skill_level,
    });

    // Return immediate response with goal and job info
    res.status(202).json({
      id: goal.id,
      jobId: job.id,
      status: goal.status,
      message: 'Goal created successfully. AI plan generation in progress...',
    });
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET: Get goal status and job progress
export const getGoalStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check authentication
    if (!req.user?.id) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { id: goalId } = req.params;

    if (!goalId) {
      res.status(400).json({ error: 'Goal ID is required' });
      return;
    }

    // Find goal with proper Drizzle syntax
    const goal = await db.query.goals.findFirst({ 
      where: and(
        eq(goals.id, goalId),
        eq(goals.userId, req.user.id)
      )
    });

    if (!goal) {
      res.status(404).json({ error: 'Goal not found', code: 404 });
      return;
    }

    // Get job status from queue
    const jobs = await goalQueue.getJobs(['active', 'completed', 'failed']);
    const relatedJob = jobs.find(job => job.data.goalId === goalId);

    let jobStatus = null;
    if (relatedJob) {
      const state = await relatedJob.getState();
      jobStatus = {
        id: relatedJob.id,
        state,
        progress: relatedJob.progress || 0,
        failedReason: relatedJob.failedReason,
        timestamp: relatedJob.timestamp,
        processedOn: relatedJob.processedOn,
        finishedOn: relatedJob.finishedOn,
      };
    }

    res.status(200).json({
      id: goal.id,
      title: goal.title,
      status: goal.status,
      progress: goal.progress || 0,
      createdAt: goal.createdAt,
      updatedAt: goal.updatedAt,
      jobStatus,
    });
  } catch (error) {
    console.error('Get goal status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 