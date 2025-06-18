import { openai } from './openai'
import type { GoalPlanRequest, GoalPlanResponse } from './types'

export async function generateGoalPlan({ title, description }: GoalPlanRequest): Promise<GoalPlanResponse> {
  // Basic prompt; tweak as needed
  const prompt = `You are a productivity assistant. Break the following goal into a short actionable task list. Return as JSON array of strings. \n\nGoal title: ${title}\nDescription: ${description ?? ''}`

  const chat = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are TodoAI, a productivity planning assistant.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 512,
  })

  const content = chat.choices[0]?.message?.content || '[]'

  let tasks: string[] = []
  try {
    tasks = JSON.parse(content)
  } catch {
    // fallback: split by newline
    tasks = content.split(/\n|\r/).map((t) => t.replace(/^[-*\d.\s]+/, '').trim()).filter(Boolean)
  }

  return { suggestedTasks: tasks }
}
