import { OpenAIApi, Configuration } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function generateGoalPlan({ title, durationDays, timePerDayMinutes, skillLevel }: {
  title: string;
  durationDays: number;
  timePerDayMinutes: number;
  skillLevel: string;
}) {
  const prompt = `Generate a detailed ${durationDays}-day learning plan for "${title}" at ${skillLevel} level with ${timePerDayMinutes} minutes/day. Break it into weekly milestones and daily tasks. Return JSON in the following format:\n\n[{ week: number, milestone: string, tasks: [{ day: number, task: string, description?: string }] }]`;

  let retries = 2;
  let lastError;
  while (retries-- > 0) {
    try {
      const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful AI learning coach.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }, { timeout: 20000 });
      const content = response.data.choices[0].message?.content;
      if (!content) throw new Error('No response from OpenAI');
      // Try to parse JSON from response
      const jsonStart = content.indexOf('[');
      const jsonEnd = content.lastIndexOf(']') + 1;
      const jsonString = content.slice(jsonStart, jsonEnd);
      const plan = JSON.parse(jsonString);
      return plan;
    } catch (err) {
      lastError = err;
    }
  }
  throw new Error('Failed to generate plan: ' + (lastError?.message || 'Unknown error'));
} 