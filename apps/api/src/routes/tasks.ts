import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import { db, tasks, eq, and, or } from '@todoai/database';
import { gte, lte } from 'drizzle-orm';
import { tasksCompletedCounter } from '../app';

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
router.get('/today', getTodayTasks);

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
router.get('/', getAllTasks);

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
// Import the task controller functions
import { 
  createTask, 
  getAllTasks, 
  getTodayTasks, 
  getTask, 
  updateTask, 
  deleteTask, 
  markOverdueTasks 
} from '../controllers/tasks.controller';

router.post('/', createTask);

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
router.get('/:id', getTask);

// Add the missing PATCH and DELETE routes
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);

// Add utility route for marking overdue tasks
router.post('/mark-overdue', markOverdueTasks);

// Keep the existing incomplete route for reference
router.get('/:id/incomplete', async (req: Request, res: Response, next: NextFunction) => {
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
    return res.json({
      success: true,
      message: 'Task retrieved successfully',
      data: task,
    });
  } catch (error) {
    return next(error);
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
    return res.json({ 
      success: true, 
      message: 'Task updated successfully',
      data: { 
        id: req.params.id,
        ...req.body,
        updatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    return next(error);
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
    return res.json({
      success: true,
      message: 'Task deleted (archived) successfully',
      data: archivedTask,
    });
  } catch (error) {
    return next(error);
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
    
    if (!updatedTask) {
      // This is unlikely, but good to handle. It means the task disappeared between update and select.
      return res.status(500).json({ success: false, message: 'Failed to retrieve task after update.' });
    }

    // Trigger plan adaptation
    if (updatedTask.goalId) {
      await goalQueueService.addJob('adapt-plan', {
        goalId: updatedTask.goalId,
        trigger: 'task_completed',
      });
    }

    return res.json({
      success: true,
      message: 'Task marked as completed',
      data: updatedTask,
    });
  } catch (error) {
    return next(error);
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

    if (!updatedTask) {
      // This is unlikely, but good to handle. It means the task disappeared between update and select.
      return res.status(500).json({ success: false, message: 'Failed to retrieve task after update.' });
    }

    // Trigger plan adaptation if status or due date changed
    if (updatedTask.goalId && (status || dueDate)) {
      let trigger: 'task_completed' | 'task_rescheduled' | 'task_skipped' = 'task_rescheduled';
      if (status === 'completed') {
        trigger = 'task_completed';
        tasksCompletedCounter.inc(); // Also increment counter here
      } else if (status === 'skipped') {
        trigger = 'task_skipped';
      }
      
      await goalQueueService.addJob('adapt-plan', {
        goalId: updatedTask.goalId,
        trigger: trigger,
      });
    }

    return res.json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask,
    });
  } catch (error) {
    return next(error);
  }
});

export default router; 