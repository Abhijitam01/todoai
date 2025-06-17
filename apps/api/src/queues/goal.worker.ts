import { Worker, Job } from 'bullmq';
import { db, goals, tasks, users } from '@todoai/database';
import { and, eq, or } from 'drizzle-orm';
import { openai } from '@todoai/ai';
import { sendEmail } from '@todoai/email';

const QUEUE_NAME = 'goal-processing';
const REDIS_CONFIG = {
  host: 'localhost',
  port: 6379,
};

console.log(`[GoalWorker] Starting BullMQ worker for queue: ${QUEUE_NAME}`);

const worker = new Worker(
  QUEUE_NAME,
  async (job: Job) => {
    try {
      const { goalId, userId, name, duration_days, time_per_day_hours, skill_level } = job.data;
      console.log(`[GoalWorker] Processing job for goalId=${goalId}, userId=${userId}`);

      // Fetch goal and tasks
      const [goal] = await db.select().from(goals).where(and(eq(goals.id, goalId), eq(goals.userId, userId)));
      if (!goal) throw new Error(`Goal not found: ${goalId}`);
      const allTasks = await db.select().from(tasks).where(and(eq(tasks.goalId, goalId), eq(tasks.userId, userId), eq(tasks.isArchived, false)));

      // Split tasks by status
      const completedTasks = allTasks.filter(t => t.status === 'completed');
      const pendingTasks = allTasks.filter(t => t.status === 'pending');
      const overdueTasks = allTasks.filter(t => t.status === 'overdue');

      // Build AI prompt
      const prompt = `You are a productivity coach AI. A user has the following goal: "${goal.title}"
They want to complete it in ${duration_days} days, dedicating approximately ${time_per_day_hours} hour(s) per day.
Their current skill level is ${skill_level}.

Completed tasks so far:\n${completedTasks.map(t => `- ${t.title}`).join('\n')}
Pending/overdue tasks to be integrated into the new plan:\n${[...pendingTasks, ...overdueTasks].map(t => `- ${t.title}`).join('\n')}

Generate a new plan for the remaining period, incorporating unfinished work and leveraging completed work. Output as a JSON array of weeks, each with a milestone and daily tasks. Example format:\n[
  {"week": 1, "milestone": "...", "days": [{"day": 1, "task": "..."}, ...]}, ...
]
Ensure the plan covers the remaining days and distributes tasks logically.`;

      // Call OpenAI (GPT-4o or similar)
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
      const content = chat.choices[0]?.message?.content || '[]';
      let plan;
      try {
        plan = JSON.parse(content);
      } catch (err) {
        throw new Error('AI returned invalid JSON');
      }

      // Archive old pending/overdue tasks
      const oldTaskIds = [...pendingTasks, ...overdueTasks].map(t => t.id);
      if (oldTaskIds.length > 0) {
        await db.update(tasks).set({ isArchived: true, updatedAt: new Date() }).where(or(...oldTaskIds.map(id => eq(tasks.id, id))));
      }

      // Calculate dueDate for each new task
      const startDate = goal.targetDate || goal.createdAt || new Date();
      let order = 0;
      for (const week of plan) {
        const weekNum = week.week;
        const milestone = week.milestone;
        for (const day of week.days) {
          // dueDate = startDate + (weekNum-1)*7 + (day.day-1) days
          const dueDate = new Date(startDate);
          dueDate.setDate(dueDate.getDate() + (weekNum - 1) * 7 + (day.day - 1));
          await db.insert(tasks).values({
            userId,
            goalId,
            title: day.task,
            description: '',
            status: 'pending',
            dueDate,
            order: order++,
            isArchived: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }

      // Update goal status if needed
      await db.update(goals).set({ updatedAt: new Date() }).where(eq(goals.id, goalId));

      // Send email notification to user
      try {
        const [user] = await db.select().from(users).where(eq(users.id, userId));
        if (user && user.email) {
          await sendEmail({
            to: user.email,
            subject: 'Your TodoAI plan has been updated!',
            html: `<p>Your plan for <b>${goal.title}</b> has been adapted by AI. Check your dashboard for the new roadmap!</p>`,
            text: `Your plan for ${goal.title} has been adapted by AI. Check your dashboard for the new roadmap!`,
          });
          console.log(`[GoalWorker] Notification email sent to ${user.email}`);
        }
      } catch (emailErr) {
        console.error(`[GoalWorker] Failed to send notification email:`, emailErr);
      }

      console.log(`[GoalWorker] Plan adaptation complete for goal: ${goal.title}`);
      return { success: true, goalId };
    } catch (err) {
      console.error(`[GoalWorker] Error processing job:`, err);
      // Optionally, send alert/notification for failed job here
      throw err;
    }
  },
  {
    connection: REDIS_CONFIG,
    // For production, configure attempts/backoff/dead-letter queue here:
    // Example: attempts: 5, backoff: { type: 'exponential', delay: 10000 }
    // See BullMQ docs for more options.
  }
);

worker.on('completed', (job) => {
  console.log(`[GoalWorker] Job completed:`, job.id);
});

worker.on('failed', (job, err) => {
  console.error(`[GoalWorker] Job failed:`, job?.id, err);
  // TODO: Add dead-letter queue or alerting here
}); 