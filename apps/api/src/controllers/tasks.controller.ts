import { Request, Response, NextFunction } from 'express';
import { db, tasks, goals } from '@todoai/database';
import { eq, and, or, gte, lte } from 'drizzle-orm';
import { tasksCompletedCounter } from '../app';
import { goalQueue } from '../queues/goal.queue';

// Helper: Validate task input
function validateTaskInput(body: any) {
  const { title, goalId } = body;
  if (!title || typeof title !== 'string' || title.trim().length < 1) {
    return 'Task title is required';
  }
  if (goalId && typeof goalId !== 'string') {
    return 'Invalid goal ID format';
  }
  return null;
}

// CREATE: Add a new task
export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const validationError = validateTaskInput(req.body);
    if (validationError) {
      res.status(400).json({ error: validationError });
      return;
    }

    const { title, description, priority = 'medium', goalId, dueDate, estimatedMinutes } = req.body;

    // If goalId provided, verify user owns the goal
    if (goalId) {
      const goal = await db.query.goals.findFirst({
        where: and(eq(goals.id, goalId), eq(goals.userId, req.user.id))
      });
      if (!goal) {
        res.status(404).json({ error: 'Goal not found or not accessible' });
        return;
      }
    }

    const [task] = await db.insert(tasks).values({
      userId: req.user.id,
      goalId: goalId || null,
      title: title.trim(),
      description: description || '',
      priority,
      status: 'pending',
      dueDate: dueDate ? new Date(dueDate) : null,
      estimatedMinutes: estimatedMinutes || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// READ: Get all tasks for user
export const getAllTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { goalId, status, startDate, endDate } = req.query;
    const filters = [eq(tasks.userId, req.user.id), eq(tasks.isArchived, false)];

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
      data: allTasks
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// READ: Get today's tasks
export const getTodayTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    // Get today's date range
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    const todayTasks = await db.select().from(tasks)
      .where(
        and(
          eq(tasks.userId, req.user.id),
          or(eq(tasks.status, 'pending'), eq(tasks.status, 'overdue')),
          eq(tasks.isArchived, false),
          gte(tasks.dueDate, startOfDay),
          lte(tasks.dueDate, endOfDay)
        )
      );

    res.json({
      success: true,
      message: "Today's tasks retrieved successfully",
      data: todayTasks
    });
  } catch (error) {
    console.error('Get today tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// READ: Get single task
export const getTask = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { id } = req.params;
    const task = await db.query.tasks.findFirst({
      where: and(eq(tasks.id, id), eq(tasks.userId, req.user.id))
    });

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Task retrieved successfully',
      data: task
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// UPDATE: Update task status or details
export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { id } = req.params;
    const { status, title, description, priority, dueDate, estimatedMinutes, actualMinutes } = req.body;

    // Find and verify task ownership
    const existingTask = await db.query.tasks.findFirst({
      where: and(eq(tasks.id, id), eq(tasks.userId, req.user.id))
    });

    if (!existingTask) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    // Prepare update data
    const updateData: any = { updatedAt: new Date() };
    
    if (status !== undefined) {
      updateData.status = status;
      if (status === 'completed') {
        updateData.completedAt = new Date();
        tasksCompletedCounter.inc(); // Increment metrics
      } else if (existingTask.status === 'completed' && status !== 'completed') {
        updateData.completedAt = null;
      }
    }
    
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description;
    if (priority !== undefined) updateData.priority = priority;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
    if (estimatedMinutes !== undefined) updateData.estimatedMinutes = estimatedMinutes;
    if (actualMinutes !== undefined) updateData.actualMinutes = actualMinutes;

    // Update task
    const [updatedTask] = await db.update(tasks)
      .set(updateData)
      .where(eq(tasks.id, id))
      .returning();

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask
    });

    // Trigger plan adaptation if task status change affects schedule
    if (status && existingTask.goalId) {
      try {
        await goalQueue.add('adapt-plan', {
          goalId: existingTask.goalId,
          trigger: status === 'completed' ? 'task_completed' : 'task_status_changed',
        });
        console.log(`[Task Update] Plan adaptation queued for goal ${existingTask.goalId} due to task status change`);
      } catch (error) {
        console.error(`[Task Update] Failed to queue plan adaptation for goal ${existingTask.goalId}:`, error);
        // Don't fail the request if adaptation queuing fails
      }
    }

  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE: Archive task (soft delete)
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { id } = req.params;

    // Verify task ownership
    const existingTask = await db.query.tasks.findFirst({
      where: and(eq(tasks.id, id), eq(tasks.userId, req.user.id))
    });

    if (!existingTask) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    // Soft delete by archiving
    await db.update(tasks)
      .set({ isArchived: true, updatedAt: new Date() })
      .where(eq(tasks.id, id));

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// UTILITY: Mark overdue tasks
export const markOverdueTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const now = new Date();
    
    // Find pending tasks that are past due
    await db.update(tasks)
      .set({ status: 'overdue', updatedAt: new Date() })
      .where(
        and(
          eq(tasks.userId, req.user.id),
          eq(tasks.status, 'pending'),
          lte(tasks.dueDate, now)
        )
      );

    res.json({
      success: true,
      message: 'Overdue tasks updated successfully'
    });
  } catch (error) {
    console.error('Mark overdue tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 