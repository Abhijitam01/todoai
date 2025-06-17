import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import { db, tasks, eq, and, or } from '@todoai/database';
import { gte, lte } from 'drizzle-orm';
-import { tasksCompletedCounter } from '../app';
+import { tasksCompletedCounter } from '../metrics';
const router = Router();

/**
 * @swagger
 * /api/v1/tasks/today:
 *   get:
 *     summary: Get all tasks scheduled for today for the authenticated user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Today's tasks retrieved successfully
 */
router.get('/today', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Get today's date in UTC (YYYY-MM-DD)
    const today = new Date();
    const yyyy = today.getUTCFullYear();
    const mm = String(today.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(today.getUTCDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;
    const todayStart = new Date(`${todayStr}T00:00:00.000Z`);
    const todayEnd = new Date(`${todayStr}T23:59:59.999Z`);

    // Query tasks for this user, due today, status pending or overdue, not archived
    const todayTasks = await db.select().from(tasks)
      .where(
        and(
          eq(tasks.userId, userId),
          or(eq(tasks.status, 'pending'), eq(tasks.status, 'overdue')),
          eq(tasks.isArchived, false),
          gte(tasks.dueDate, todayStart),
          lte(tasks.dueDate, todayEnd)
        )
      );

    res.json({
      success: true,
      message: "Today's tasks retrieved successfully",
      data: todayTasks,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/tasks:
 *   get:
 *     summary: Get all tasks for the authenticated user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: goalId
 *         schema:
 *           type: string
 *         description: Filter tasks by goal ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter tasks by status
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { goalId, status, startDate, endDate } = req.query;
    const filters = [eq(tasks.userId, userId), eq(tasks.isArchived, false)];

    if (goalId) {
      filters.push(eq(tasks.goalId, goalId as string));
    }
    if (status) {
      filters.push(eq(tasks.status, status as string));
    }
    if (startDate) {
      filters.push(gte(tasks.dueDate, new Date(startDate as string)));
    }
    if (endDate) {
      filters.push(lte(tasks.dueDate, new Date(endDate as string)));
    }

    const allTasks = await db.select().from(tasks).where(and(...filters));

    res.json({
      success: true,
      message: 'Tasks retrieved successfully',
      data: allTasks,
      pagination: {
        page: 1,
        limit: allTasks.length,
        total: allTasks.length,
        totalPages: 1
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
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
 *               priority:
 *                 type: string
 *               goalId:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Task created successfully
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: Implement create task logic
    res.status(201).json({ 
      success: true, 
      message: 'Task created successfully',
      data: { 
        id: 'placeholder-id',
        ...req.body,
        status: 'todo',
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   get:
 *     summary: Get a specific task by ID
 *     tags: [Tasks]
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
 *         description: Task retrieved successfully
 *       404:
 *         description: Task not found
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Task ID is required' });
    }
    const [task] = await db.select().from(tasks).where(and(eq(tasks.id, id), eq(tasks.userId, userId), eq(tasks.isArchived, false)));
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.json({
      success: true,
      message: 'Task retrieved successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
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
 *               priority:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task updated successfully
 */
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: Implement update task logic
    res.json({ 
      success: true, 
      message: 'Task updated successfully',
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
 * /api/v1/tasks/{id}:
 *   delete:
 *     summary: Delete (archive) a task
 *     tags: [Tasks]
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
 *         description: Task deleted (archived) successfully
 */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Task ID is required' });
    }
    const [task] = await db.select().from(tasks).where(and(eq(tasks.id, id), eq(tasks.userId, userId), eq(tasks.isArchived, false)));
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    await db.update(tasks).set({ isArchived: true, updatedAt: new Date() }).where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
    const [archivedTask] = await db.select().from(tasks).where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
    res.json({
      success: true,
      message: 'Task deleted (archived) successfully',
      data: archivedTask,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/tasks/{id}/complete:
 *   patch:
 *     summary: Mark a task as completed
 *     tags: [Tasks]
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
 *         description: Task marked as completed
 */
router.patch('/:id/complete', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Task ID is required' });
    }
    const [task] = await db.select().from(tasks).where(and(eq(tasks.id, id), eq(tasks.userId, userId), eq(tasks.isArchived, false)));
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    await db.update(tasks).set({ status: 'completed', completedAt: new Date(), updatedAt: new Date() }).where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
    tasksCompletedCounter.inc();
    const [updatedTask] = await db.select().from(tasks).where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
    // TODO: Trigger plan adaptation if needed (stub)
    res.json({
      success: true,
      message: 'Task marked as completed',
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   patch:
 *     summary: Update a task
 *     tags: [Tasks]
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
 *               status:
 *                 type: string
 *               dueDate:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task updated successfully
 */
router.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Task ID is required' });
    }
    // Only allow updating certain fields
    const { status, dueDate, title, description, priority } = req.body;
    const [task] = await db.select().from(tasks).where(and(eq(tasks.id, id), eq(tasks.userId, userId), eq(tasks.isArchived, false)));
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    const updateData: any = {};
    if (status) updateData.status = status;
    if (dueDate) updateData.dueDate = new Date(dueDate);
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (priority) updateData.priority = priority;
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ success: false, message: 'No valid fields to update' });
    }
    updateData.updatedAt = new Date();
    await db.update(tasks).set(updateData).where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
    const [updatedTask] = await db.select().from(tasks).where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
    res.json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
});

export default router; 