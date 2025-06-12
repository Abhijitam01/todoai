import { Router } from 'express';
// Import task controllers when they're created
// import { getTasksToday, updateTask } from '../controllers/tasks.controller';

const router = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         goal_id:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         description:
 *           type: string
 *           example: "Read Python basics tutorial"
 *         original_planned_date:
 *           type: string
 *           format: date
 *           example: "2023-01-01"
 *         current_due_date:
 *           type: string
 *           format: date
 *           example: "2023-01-01"
 *         completion_date:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: "2023-01-01T10:30:00.000Z"
 *         status:
 *           type: string
 *           enum: [PENDING, COMPLETED, SKIPPED, OVERDUE]
 *           example: "PENDING"
 *         order_in_goal:
 *           type: integer
 *           example: 1
 *         week_number:
 *           type: integer
 *           example: 1
 *         day_number_in_week:
 *           type: integer
 *           example: 1
 *         milestone:
 *           type: string
 *           example: "Python Fundamentals"
 *         goal_name:
 *           type: string
 *           example: "Learn Python Programming"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2023-01-01T00:00:00.000Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2023-01-01T00:00:00.000Z"
 *     TaskUpdateRequest:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [PENDING, COMPLETED, SKIPPED, OVERDUE]
 *           example: "COMPLETED"
 *         current_due_date:
 *           type: string
 *           format: date
 *           example: "2023-01-02"
 *       description: "Update task status or reschedule due date"
 */

/**
 * @openapi
 * /tasks/today:
 *   get:
 *     summary: Get today's tasks
 *     description: Returns all tasks scheduled for today for the authenticated user across all active goals
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Today's tasks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// router.get('/today', authMiddleware, getTasksToday);

/**
 * @openapi
 * /tasks:
 *   get:
 *     summary: Get tasks with filters
 *     description: Returns tasks for a specific goal or time range with optional filtering
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: goal_id
 *         schema:
 *           type: string
 *         description: Filter tasks by goal ID
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter tasks from this date (YYYY-MM-DD)
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter tasks until this date (YYYY-MM-DD)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, COMPLETED, SKIPPED, OVERDUE]
 *         description: Filter tasks by status
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Goal not found (if goal_id is invalid)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// router.get('/', authMiddleware, getTasks);

/**
 * @openapi
 * /tasks/{task_id}:
 *   patch:
 *     summary: Update a task
 *     description: Updates a task's status or details (e.g., mark as done, reschedule). May trigger plan adaptation.
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: task_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The task ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskUpdateRequest'
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - task doesn't belong to user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// router.patch('/:task_id', authMiddleware, updateTask);

export default router; 