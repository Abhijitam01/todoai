import { Request, Response } from 'express';
import { PrismaClient } from '../../src/src/generated/prisma';
import { z } from 'zod';
import { generateGoalPlan } from '../services/openai.service';

const prisma = new PrismaClient();

const goalSchema = z.object({
  title: z.string().min(1),
  durationDays: z.number().min(1),
  timePerDayMinutes: z.number().min(1),
  skillLevel: z.enum(['Beginner', 'Intermediate', 'Advanced']),
});

export async function createGoal(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const body = goalSchema.parse(req.body);
    // Call OpenAI to generate plan
    const plan = await generateGoalPlan(body);
    // Transform plan to Prisma nested create format
    const milestones = plan.map((m: any) => ({
      title: m.milestone || m.title || `Week ${m.week}`,
      week: m.week,
      tasks: {
        create: m.tasks.map((t: any) => ({
          day: t.day,
          task: t.task,
          description: t.description || null,
        })),
      },
    }));
    // Create goal, milestones, and tasks
    const goal = await prisma.goal.create({
      data: {
        title: body.title,
        durationDays: body.durationDays,
        timePerDayMinutes: body.timePerDayMinutes,
        skillLevel: body.skillLevel,
        userId,
        milestones: { create: milestones },
      },
    });
    return res.json({ goalId: goal.id, message: 'Plan created successfully' });
  } catch (err: any) {
    return res.status(400).json({ message: err.message || 'Failed to create goal' });
  }
} 