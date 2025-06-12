import { Router } from 'express';
import { createGoal } from '../controllers/goals.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     GoalCreateRequest:
 *       type: object
 *       required:
 *         - name
 *         - duration_days
 *         - time_per_day_hours
 *         - skill_level
 *       properties:
 *         name:
 *           type: string
 *           example: "Learn Python Programming"
 *           description: "The goal name or description"
 *         duration_days:
 *           type: integer
 *           minimum: 1
 *           maximum: 365
 *           example: 90
 *           description: "Duration of the goal in days"
 *         time_per_day_hours:
 *           type: number
 *           minimum: 0.5
 *           maximum: 8
 *           example: 1.5
 *           description: "Hours per day to dedicate to this goal"
 *         skill_level:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *           example: "beginner"
 *           description: "Current skill level for this topic"
 *     Goal:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         name:
 *           type: string
 *           example: "Learn Python Programming"
 *         duration_days:
 *           type: integer
 *           example: 90
 *         time_per_day_hours:
 *           type: number
 *           example: 1.5
 *         skill_level:
 *           type: string
 *           example: "beginner"
 *         status:
 *           type: string
 *           enum: [PLANNING, ACTIVE, PAUSED, COMPLETED, ARCHIVED, FAILED]
 *           example: "PLANNING"
 *         progress_percentage:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           example: 0
 *         start_date:
 *           type: string
 *           format: date
 *           example: "2023-01-01"
 *         end_date:
 *           type: string
 *           format: date
 *           example: "2023-03-31"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2023-01-01T00:00:00.000Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2023-01-01T00:00:00.000Z"
 *     GoalCreateResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         name:
 *           type: string
 *           example: "Learn Python Programming"
 *         status:
 *           type: string
 *           example: "PLANNING"
 *         message:
 *           type: string
 *           example: "Goal created successfully. AI plan generation in progress."
 */

/**
 * @openapi
 * /goals:
 *   post:
 *     summary: Create a new goal
 *     description: Creates a new goal and triggers asynchronous AI plan generation
 *     tags:
 *       - Goals
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GoalCreateRequest'
 *     responses:
 *       202:
 *         description: Goal created successfully, AI plan generation in progress
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GoalCreateResponse'
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
 */
router.post('/', authMiddleware, createGoal);

export default router; 