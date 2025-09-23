import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import { db, goals, tasks } from '@todoai/database';
import { and, eq, desc, count, sql } from 'drizzle-orm';
import { goalQueue } from '../queues/goal.queue';
import { goalsCreatedCounter, aiPlanRevisionsCounter } from '../app';
import { z } from 'zod';

const router = Router();

// Validation schemas
const CreateGoalSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  description: z.string().optional(),
  category: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  targetDate: z.string().datetime().optional(),
  tags: z.array(z.string()).optional()
});

const UpdateGoalSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  status: z.enum(['active', 'paused', 'completed', 'cancelled']).optional(),
  targetDate: z.string().datetime().optional(),
  tags: z.array(z.string()).optional()
});

/**
 * @swagger
 * /api/v1/goals:
 *   get:
 *     summary: Get all goals for the authenticated user
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Goals retrieved successfully
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        error: {
          code: 'UNAUTHORIZED',
          message: 'User not authenticated'
        }
      });
    }

    const { page = 1, limit = 10, status, category, includeStats = false } = req.query;
    
    // Build where conditions
    const whereConditions = [
      eq(goals.userId, userId),
      eq(goals.isArchived, false)
    ];
    
    if (status) whereConditions.push(eq(goals.status, status as string));
    if (category) whereConditions.push(eq(goals.category, category as string));

    // Get total count for pagination
    const totalCountResult = await db
      .select({ count: count() })
      .from(goals)
      .where(and(...whereConditions));
    
    const totalCount = totalCountResult[0];
    if (!totalCount) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Failed to get total count'
        }
      });
    }

    // Get paginated goals
    const goalsData = await db
      .select()
      .from(goals)
      .where(and(...whereConditions))
      .limit(Number(limit))
      .offset((Number(page) - 1) * Number(limit))
      .orderBy(desc(goals.createdAt));

    // Get task statistics for each goal if requested
    let goalsWithStats = goalsData;
    if (includeStats === 'true') {
      goalsWithStats = await Promise.all(
        goalsData.map(async (goal) => {
          const taskStatsResult = await db
            .select({
              total: count(),
              completed: count(sql`CASE WHEN status = 'completed' THEN 1 END`),
              pending: count(sql`CASE WHEN status = 'pending' THEN 1 END`),
              overdue: count(sql`CASE WHEN status = 'overdue' THEN 1 END`)
            })
            .from(tasks)
            .where(and(
              eq(tasks.goalId, goal.id),
              eq(tasks.isArchived, false)
            ));

          const taskStats = taskStatsResult[0];
          if (!taskStats) {
            return {
              ...goal,
              taskStats: {
                total: 0,
                completed: 0,
                pending: 0,
                overdue: 0,
                progress: 0
              }
            };
          }

          return {
            ...goal,
            taskStats: {
              total: taskStats.total,
              completed: taskStats.completed,
              pending: taskStats.pending,
              overdue: taskStats.overdue,
              progress: taskStats.total > 0 ? Math.round((taskStats.completed / taskStats.total) * 100) : 0
            }
          };
        })
      );
    }

    return res.json({ 
      success: true, 
      message: 'Goals retrieved successfully',
      data: goalsWithStats,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: totalCount.count,
        totalPages: Math.ceil(totalCount.count / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/goals:
 *   post:
 *     summary: Create a new goal
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               priority:
 *                 type: string
 *               targetDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Goal created successfully
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        error: {
          code: 'UNAUTHORIZED',
          message: 'User not authenticated'
        }
      });
    }

    // Validate input
    const validationResult = CreateGoalSchema.safeParse(req.body);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message
      }));
      
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: errors
        }
      });
    }

    const { title, description, category, priority, targetDate, tags } = validationResult.data;

    // Create goal
    const [newGoal] = await db.insert(goals).values({
      userId,
      title,
      description: description || null,
      category: category || null,
      priority,
      status: 'active',
      targetDate: targetDate ? new Date(targetDate) : null,
      tags: tags ? JSON.stringify(tags) : null,
      progress: 0,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();

    if (!newGoal) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'GOAL_CREATION_FAILED',
          message: 'Failed to create goal'
        }
      });
    }

    // Increment metrics
    goalsCreatedCounter.inc();

    // TODO: Trigger AI plan generation if needed
    // await goalQueue.add('generate-plan', { goalId: newGoal.id, userId });

    return res.status(201).json({ 
      success: true, 
      message: 'Goal created successfully',
      data: {
        ...newGoal,
        tags: tags || []
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/goals/{id}:
 *   get:
 *     summary: Get a specific goal by ID
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Goal retrieved successfully
 *       404:
 *         description: Goal not found
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        error: {
          code: 'UNAUTHORIZED',
          message: 'User not authenticated'
        }
      });
    }

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_GOAL_ID',
          message: 'Goal ID is required'
        }
      });
    }

    // Get goal with task statistics
    const [goal] = await db
      .select()
      .from(goals)
      .where(and(
        eq(goals.id, id),
        eq(goals.userId, userId),
        eq(goals.isArchived, false)
      ));

    if (!goal) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'GOAL_NOT_FOUND',
          message: 'Goal not found or not accessible'
        }
      });
    }

    // Get task statistics for this goal
    const taskStatsResult = await db
      .select({
        total: count(),
        completed: count(sql`CASE WHEN status = 'completed' THEN 1 END`),
        pending: count(sql`CASE WHEN status = 'pending' THEN 1 END`),
        overdue: count(sql`CASE WHEN status = 'overdue' THEN 1 END`)
      })
      .from(tasks)
      .where(and(
        eq(tasks.goalId, goal.id),
        eq(tasks.isArchived, false)
      ));

    const taskStats = taskStatsResult[0];
    if (!taskStats) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Failed to get task statistics'
        }
      });
    }

    const goalWithStats = {
      ...goal,
      taskStats: {
        total: taskStats.total,
        completed: taskStats.completed,
        pending: taskStats.pending,
        overdue: taskStats.overdue,
        progress: taskStats.total > 0 ? Math.round((taskStats.completed / taskStats.total) * 100) : 0
      },
      tags: goal.tags ? JSON.parse(goal.tags) : []
    };

    return res.json({ 
      success: true, 
      message: 'Goal retrieved successfully',
      data: goalWithStats
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/goals/{id}:
 *   put:
 *     summary: Update a goal
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Goal updated successfully
 */
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        error: {
          code: 'UNAUTHORIZED',
          message: 'User not authenticated'
        }
      });
    }

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_GOAL_ID',
          message: 'Goal ID is required'
        }
      });
    }

    // Validate input
    const validationResult = UpdateGoalSchema.safeParse(req.body);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message
      }));
      
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: errors
        }
      });
    }

    // Check if goal exists and user owns it
    const [existingGoal] = await db
      .select()
      .from(goals)
      .where(and(
        eq(goals.id, id),
        eq(goals.userId, userId),
        eq(goals.isArchived, false)
      ));

    if (!existingGoal) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'GOAL_NOT_FOUND',
          message: 'Goal not found or not accessible'
        }
      });
    }

    const { title, description, category, priority, status, targetDate, tags } = validationResult.data;

    // Prepare update data
    const updateData: any = { updatedAt: new Date() };
    
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (priority !== undefined) updateData.priority = priority;
    if (status !== undefined) updateData.status = status;
    if (targetDate !== undefined) updateData.targetDate = targetDate ? new Date(targetDate) : null;
    if (tags !== undefined) updateData.tags = tags ? JSON.stringify(tags) : null;

    // Update goal
    const [updatedGoal] = await db
      .update(goals)
      .set(updateData)
      .where(and(eq(goals.id, id), eq(goals.userId, userId)))
      .returning();

    if (!updatedGoal) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'UPDATE_FAILED',
          message: 'Failed to update goal'
        }
      });
    }

    return res.json({ 
      success: true, 
      message: 'Goal updated successfully',
      data: {
        ...updatedGoal,
        tags: updatedGoal.tags ? JSON.parse(updatedGoal.tags) : []
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/goals/{id}:
 *   delete:
 *     summary: Delete a goal
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Goal deleted successfully
 */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Goal ID is required' });
    }
    const [goal] = await db.select().from(goals).where(and(eq(goals.id, id), eq(goals.userId, userId), eq(goals.isArchived, false)));
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }
    // Archive the goal
    await db.update(goals).set({ isArchived: true, updatedAt: new Date() }).where(and(eq(goals.id, id), eq(goals.userId, userId)));
    
    // Cascade archive all tasks for this goal
    await db.update(tasks).set({ isArchived: true, updatedAt: new Date() }).where(and(eq(tasks.goalId, id), eq(tasks.userId, userId)));
    
    const [archivedGoal] = await db.select().from(goals).where(and(eq(goals.id, id), eq(goals.userId, userId)));
    return res.json({
      success: true,
      message: 'Goal deleted (archived) successfully',
      data: archivedGoal,
    });
  } catch (error) {
    return next(error);
  }
});

/**
 * @swagger
 * /api/v1/goals/{id}:
 *   patch:
 *     summary: Update a goal
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               timePerDay:
 *                 type: string
 *               targetDate:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Goal updated successfully
 *       404:
 *         description: Goal not found
 */
router.patch('/:id', async (req, res, next) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Goal ID is required' });
    }
    // Only allow updating certain fields
    const { title, timePerDay, targetDate, status } = req.body;
    const [goal] = await db.select().from(goals).where(and(eq(goals.id, id), eq(goals.userId, userId), eq(goals.isArchived, false)));
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }
    const updateData: any = {};
    if (title) updateData.title = title;
    if (timePerDay) updateData.timePerDay = timePerDay;
    if (targetDate) updateData.targetDate = new Date(targetDate);
    if (status) updateData.status = status;
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ success: false, message: 'No valid fields to update' });
    }
    updateData.updatedAt = new Date();
    await db.update(goals).set(updateData).where(and(eq(goals.id, id), eq(goals.userId, userId)));
    const [updatedGoal] = await db.select().from(goals).where(and(eq(goals.id, id), eq(goals.userId, userId)));
    
    // Trigger plan adaptation if timePerDay or targetDate changed
    if (timePerDay || targetDate) {
      try {
        await goalQueue.add('adapt-plan', {
          goalId: id,
          trigger: 'manual_trigger',
        });
        console.log(`[Goal Update] Plan adaptation queued for goal ${id} due to parameter changes`);
      } catch (error) {
        console.error(`[Goal Update] Failed to queue plan adaptation for goal ${id}:`, error);
        // Don't fail the request if adaptation queuing fails
      }
    }
    
    return res.json({
      success: true,
      message: 'Goal updated successfully',
      data: updatedGoal,
    });
  } catch (error) {
    return next(error);
  }
});

/**
 * @swagger
 * /api/v1/goals/{id}/revise:
 *   post:
 *     summary: Request AI to revise the plan for a goal
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       202:
 *         description: Plan revision queued
 */
router.post('/:id/revise', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Goal ID is required' });
    }
    // Fetch the goal to get required fields
    const [goal] = await db.select().from(goals).where(and(eq(goals.id, id), eq(goals.userId, userId), eq(goals.isArchived, false)));
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }
    // Calculate duration from target date or use default
    const duration_days = goal.targetDate 
      ? Math.ceil((new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      : 90;
    
    // Extract time per day from goal data or use default
    const time_per_day_hours = (goal as any).timePerDay || 1;
    
    // Extract skill level from goal data or use default
    const skill_level = (goal as any).skillLevel || 'beginner';

    // Enqueue a job for plan revision with actual goal data
    await goalQueue.add('generate-plan', {
      goalId: id,
      userId,
      goalName: goal.title,
      durationDays: duration_days,
      timePerDayHours: time_per_day_hours,
      skillLevel: skill_level as 'beginner' | 'intermediate' | 'advanced',
    });
    aiPlanRevisionsCounter.inc();
    return res.status(202).json({
      success: true,
      message: 'Plan revision queued. AI will update your plan soon.',
    });
  } catch (error) {
    return next(error);
  }
});

export default router; 