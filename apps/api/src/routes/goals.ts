import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import { db, goals } from '@todoai/database';
import { and, eq } from 'drizzle-orm';
import { goalQueue } from '../queues/goal.queue';
import { goalsCreatedCounter, aiPlanRevisionsCounter } from '../app';

const router = Router();

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
    // TODO: Implement get goals logic
    res.json({ 
      success: true, 
      message: 'Goals retrieved successfully',
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
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
    // TODO: Implement create goal logic
    goalsCreatedCounter.inc();
    res.status(201).json({ 
      success: true, 
      message: 'Goal created successfully',
      data: { 
        id: 'placeholder-id',
        ...req.body,
        createdAt: new Date().toISOString()
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
    // TODO: Implement get goal by ID logic
    res.json({ 
      success: true, 
      message: 'Goal retrieved successfully',
      data: { 
        id: req.params.id,
        title: 'Sample Goal',
        description: 'This is a placeholder goal'
      }
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
    // TODO: Implement update goal logic
    res.json({ 
      success: true, 
      message: 'Goal updated successfully',
      data: { 
        id: req.params.id,
        ...req.body,
        updatedAt: new Date().toISOString()
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
    await db.update(goals).set({ isArchived: true, updatedAt: new Date() }).where(and(eq(goals.id, id), eq(goals.userId, userId)));
    // TODO: Cascade archive all tasks for this goal (stub)
    const [archivedGoal] = await db.select().from(goals).where(and(eq(goals.id, id), eq(goals.userId, userId)));
    res.json({
      success: true,
      message: 'Goal deleted (archived) successfully',
      data: archivedGoal,
    });
  } catch (error) {
    next(error);
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
    // TODO: Trigger plan adaptation/AI if timePerDay or targetDate changed (stub)
    res.json({
      success: true,
      message: 'Goal updated successfully',
      data: updatedGoal,
    });
  } catch (error) {
    next(error);
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
    // Enqueue a job for plan revision with all required fields
    await goalQueue.add('revise-plan', {
      goalId: id,
      userId,
      name: goal.title,
      duration_days: 90, // TODO: Replace with actual duration if available
      time_per_day_hours: 1, // TODO: Replace with actual value if available
      skill_level: 'beginner', // TODO: Replace with actual value if available
    });
    aiPlanRevisionsCounter.inc();
    res.status(202).json({
      success: true,
      message: 'Plan revision queued. AI will update your plan soon.',
    });
  } catch (error) {
    next(error);
  }
});

export default router; 