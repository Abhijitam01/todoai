import { db, goals, tasks, users, Goal } from '@todoai/database';
import { and, eq, or, inArray } from 'drizzle-orm';
import { openai } from '@todoai/ai';
import { sendEmail } from '@todoai/email';
import { differenceInDays, format } from 'date-fns';
import { realtimeService } from '../app'; // Import the realtime service instance

// A simple string similarity function to compare tasks.
// In a real-world app, a more sophisticated NLP-based approach might be used.
function getJaccardSimilarity(str1: string, str2: string): number {
  const set1 = new Set(str1.toLowerCase().split(' '));
  const set2 = new Set(str2.toLowerCase().split(' '));
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return intersection.size / union.size;
}

class PlanningService {
  /**
   * The core logic for adapting a goal's plan using AI.
   * This function is designed to be called from a background worker.
   */
  public async adaptPlan(goalId: string): Promise<{ success: boolean }> {
    console.log(`[PlanningService] Starting plan adaptation for goalId: ${goalId}`);

    const goal = await this.getGoal(goalId);
    const allTasks = await this.getTasksForGoal(goalId);

    const completedTasks = allTasks.filter(t => t.status === 'completed');
    const pendingTasks = allTasks.filter(t => t.status === 'pending' || t.status === 'overdue');
    
    const prompt = this.constructAdaptationPrompt(goal, completedTasks, pendingTasks);

    const aiPlan = await this.fetchAIPlan(prompt);
    if (!aiPlan || aiPlan.length === 0) {
      console.error(`[PlanningService] AI returned an empty or invalid plan for goalId: ${goalId}. Aborting adaptation.`);
      return { success: false };
    }

    const reconciliationResult = await this.reconcileAndApplyPlan(goal, aiPlan, pendingTasks);

    await this.notifyUser(goal, reconciliationResult);

    console.log(`[PlanningService] Plan adaptation complete for goal: ${goal.title}`);
    return { success: true };
  }

  private async getGoal(goalId: string): Promise<Goal> {
    const [goal] = await db.select().from(goals).where(eq(goals.id, goalId));
    if (!goal) {
      throw new Error(`[PlanningService] Goal not found: ${goalId}`);
    }
    return goal;
  }

  private async getTasksForGoal(goalId: string) {
    return db.select().from(tasks).where(and(eq(tasks.goalId, goalId), eq(tasks.isArchived, false)));
  }

  private constructAdaptationPrompt(goal: Goal, completedTasks: any[], pendingTasks: any[]): string {
    const remainingDays = differenceInDays(goal.targetDate || new Date(), new Date());
    const prompt = `You are a productivity coach AI. A user is working on the goal: "${goal.title}".
Their original timeframe was ${goal.durationDays} days, and their skill level is ${goal.skillLevel}.
There are approximately ${remainingDays > 0 ? remainingDays : 0} days left to complete the goal.

So far, they have completed the following tasks:
${completedTasks.length > 0 ? completedTasks.map(t => `- ${t.title}`).join('\n') : 'None'}

They still have the following tasks pending or overdue, which need to be integrated into the revised plan:
${pendingTasks.length > 0 ? pendingTasks.map(t => `- ${t.title}`).join('\n') : 'None'}

Please generate a revised, realistic plan for the remaining days. The plan should be intelligently structured to help the user catch up and finish on time.
Output as a JSON array of weeks. Each task must be a simple string. The plan should start from week 1, day 1, representing the new path forward.

Example JSON structure:
[
  {"week": 1, "milestone": "...", "days": [{"day": 1, "task": "New task description..."}, ...]},
  ...
]`;
    return prompt;
  }
  
  private async fetchAIPlan(prompt: string): Promise<any[]> {
    try {
      const chat = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a helpful assistant designed to output JSON.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.5,
        max_tokens: 2048,
        response_format: { type: 'json_object' },
      });

      const content = chat.choices[0]?.message?.content;
      if (!content) {
        throw new Error('AI returned empty content.');
      }

      // The AI often returns the array inside a "plan" key. Let's handle that.
      const parsedContent = JSON.parse(content);
      return parsedContent.plan || parsedContent;

    } catch (err) {
      console.error(`[PlanningService] Error fetching or parsing AI plan:`, err);
      return [];
    }
  }

  private async reconcileAndApplyPlan(goal: Goal, aiPlan: any[], existingPendingTasks: any[]) {
    const newTasksToInsert: any[] = [];
    const tasksToUpdate: { id: string; dueDate: Date; title: string }[] = [];
    const unmappedExistingTasks = new Set(existingPendingTasks.map(t => t.id));
    
    let order = 0;
    const startDate = new Date(); // The new plan starts from today

    for (const week of aiPlan) {
      for (const day of week.days) {
        const aiTaskTitle = day.task;
        const dueDate = new Date(startDate);
        dueDate.setDate(startDate.getDate() + (week.week - 1) * 7 + (day.day - 1));

        // Find the most similar existing task that hasn't been mapped yet
        let bestMatch = null;
        let bestSimilarity = 0.7; // Similarity threshold

        for (const existingTask of existingPendingTasks) {
          if (unmappedExistingTasks.has(existingTask.id)) {
            const similarity = getJaccardSimilarity(aiTaskTitle, existingTask.title);
            if (similarity > bestSimilarity) {
              bestSimilarity = similarity;
              bestMatch = existingTask;
            }
          }
        }

        if (bestMatch) {
          // If we found a similar task, update it
          tasksToUpdate.push({ id: bestMatch.id, dueDate, title: aiTaskTitle });
          unmappedExistingTasks.delete(bestMatch.id);
        } else {
          // Otherwise, create a new task
          newTasksToInsert.push({
            userId: goal.userId,
            goalId: goal.id,
            title: aiTaskTitle,
            status: 'pending',
            dueDate,
            order: order++,
          });
        }
      }
    }
    
    // Any remaining unmapped tasks from the old plan should be archived
    const tasksToArchiveIds = Array.from(unmappedExistingTasks);

    // Perform all database operations in a single transaction
    await db.transaction(async (tx) => {
      console.log(`[DB Transaction] Inserting ${newTasksToInsert.length} new tasks.`);
      if (newTasksToInsert.length > 0) {
        await tx.insert(tasks).values(newTasksToInsert);
      }
      
      console.log(`[DB Transaction] Updating ${tasksToUpdate.length} existing tasks.`);
      for (const task of tasksToUpdate) {
        await tx.update(tasks).set({ dueDate: task.dueDate, title: task.title, updatedAt: new Date() }).where(eq(tasks.id, task.id));
      }

      console.log(`[DB Transaction] Archiving ${tasksToArchiveIds.length} old tasks.`);
      if (tasksToArchiveIds.length > 0) {
        await tx.update(tasks).set({ isArchived: true, updatedAt: new Date() }).where(inArray(tasks.id, tasksToArchiveIds));
      }

      // Finally, update the goal itself
      await tx.update(goals).set({ updatedAt: new Date() }).where(eq(goals.id, goal.id));
    });

    return {
      createdIds: newTasksToInsert.map(t => t.id), // We need the IDs after insertion
      updatedIds: tasksToUpdate.map(t => t.id),
      archivedIds: tasksToArchiveIds,
    };
  }

  private async notifyUser(goal: Goal, changes: { createdIds: string[], updatedIds: string[], archivedIds: string[] }) {
    // 1. Send real-time notification via Socket.IO
    realtimeService.sendUserNotification(goal.userId, {
      title: 'Your Plan is Updated!',
      message: `Your plan for "${goal.title}" was just adapted based on your progress.`,
      type: 'success',
      actionUrl: `/goals/${goal.id}`, // Deep link to the goal page
      payload: {
        goalId: goal.id,
        ...changes,
      }
    });
    
    // 2. Send email notification (as before)
    try {
      const [user] = await db.select().from(users).where(eq(users.id, goal.userId));
      if (user && user.email) {
        await sendEmail({
          to: user.email,
          subject: `Your plan for "${goal.title}" has been updated!`,
          html: `<p>Hi ${user.name || 'there'},</p><p>Your plan for your goal, <b>${goal.title}</b>, has been automatically adapted based on your recent progress. Check your dashboard to see your new roadmap!</p><p>Keep up the great work!</p>`,
          text: `Hi ${user.name || 'there'},\n\nYour plan for your goal, "${goal.title}", has been automatically adapted based on your recent progress. Check your dashboard to see your new roadmap!\n\nKeep up the great work!`,
        });
        console.log(`[PlanningService] Notification email sent to ${user.email}`);
      }
    } catch (emailErr) {
      console.error(`[PlanningService] Failed to send notification email for goalId ${goal.id}:`, emailErr);
    }
  }
}

export const planningService = new PlanningService(); 