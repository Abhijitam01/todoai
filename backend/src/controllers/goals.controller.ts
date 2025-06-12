import { Request, Response } from 'express';
import { PrismaClient } from '../../src/src/generated/prisma';
import { z } from 'zod';
import { generateGoalPlan } from '../services/openai.service';

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

    // Generate AI plan
    const plan = await generateGoalPlan(validatedData);

    // Create goal with milestones and tasks
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
        milestones: {
          create: plan.map((milestone, index) => ({
            name: milestone.milestone,
            week_number: milestone.week,
            order_in_goal: index + 1,
            tasks: {
              create: milestone.tasks.map((task, taskIndex) => ({
                description: task.task,
                original_planned_date: new Date(Date.now() + (milestone.week - 1) * 7 * 24 * 60 * 60 * 1000 + (task.day - 1) * 24 * 60 * 60 * 1000),
                current_due_date: new Date(Date.now() + (milestone.week - 1) * 7 * 24 * 60 * 60 * 1000 + (task.day - 1) * 24 * 60 * 60 * 1000),
                status: 'PENDING',
                order_in_goal: taskIndex + 1,
                week_number: milestone.week,
                day_number_in_week: task.day,
              })),
            },
          })),
        },
      },
    });

    res.status(201).json({
      id: goal.id,
      name: goal.name,
      status: goal.status,
      message: 'Goal created successfully with AI-generated plan',
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