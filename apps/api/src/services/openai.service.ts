import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'test-key',
});

export interface GoalPlanMilestone {
  milestone: string;
  week: number;
  tasks: {
    day: number;
    task: string;
    description: string;
    estimatedMinutes?: number;
    priority?: 'low' | 'medium' | 'high';
  }[];
}

export interface GoalPlanRequest {
  name: string;
  duration_days: number;
  time_per_day_hours: number;
  skill_level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
}

/**
 * Generate a comprehensive goal plan using OpenAI
 */
export async function generateGoalPlan(goalData: GoalPlanRequest): Promise<GoalPlanMilestone[]> {
  try {
    const { name, duration_days, time_per_day_hours, skill_level } = goalData;
    
    const prompt = `
You are an AI productivity coach. Create a detailed, actionable plan for achieving the following goal:

Goal: ${name}
Duration: ${duration_days} days
Time per day: ${time_per_day_hours} hours
Skill level: ${skill_level}

Generate a structured plan with weekly milestones and daily tasks. Each task should be:
- Specific and actionable
- Appropriately sized for the time available
- Progressive in difficulty
- Relevant to the skill level

Return the plan as a JSON array of milestones, where each milestone has:
- milestone: string (descriptive milestone name)
- week: number (week number, starting from 1)
- tasks: array of daily tasks with:
  - day: number (day of the week, 1-7)
  - task: string (task title)
  - description: string (detailed description)
  - estimatedMinutes: number (estimated time in minutes)
  - priority: "low" | "medium" | "high"

Ensure the plan is realistic, progressive, and achievable within the given timeframe.
`;

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert productivity coach and learning specialist. Always return valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS || '2000'),
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    let plan: GoalPlanMilestone[];
    try {
      plan = JSON.parse(content);
    } catch (parseError) {
      // If JSON parsing fails, create a fallback plan
      console.warn('Failed to parse OpenAI response as JSON, using fallback plan');
      plan = createFallbackPlan(goalData);
    }

    // Validate and sanitize the plan
    return validateAndSanitizePlan(plan, duration_days);

  } catch (error) {
    console.error('Error generating goal plan:', error);
    
    // Return a fallback plan if OpenAI fails
    return createFallbackPlan(goalData);
  }
}

/**
 * Create a fallback plan when OpenAI is unavailable
 */
function createFallbackPlan(goalData: GoalPlanRequest): GoalPlanMilestone[] {
  const weeks = Math.ceil(goalData.duration_days / 7);
  const plan: GoalPlanMilestone[] = [];

  for (let week = 1; week <= weeks; week++) {
    const milestone: GoalPlanMilestone = {
      milestone: `Week ${week}: Foundation and Progress`,
      week,
      tasks: []
    };

    // Create tasks for each day of the week
    for (let day = 1; day <= 7; day++) {
      const totalDays = (week - 1) * 7 + day;
      if (totalDays <= goalData.duration_days) {
        milestone.tasks.push({
          day,
          task: `Day ${totalDays}: Work on ${goalData.name}`,
          description: `Spend ${goalData.time_per_day_hours} hours working towards your goal of ${goalData.name}. Focus on practical application and skill building.`,
          estimatedMinutes: goalData.time_per_day_hours * 60,
          priority: 'medium'
        });
      }
    }

    if (milestone.tasks.length > 0) {
      plan.push(milestone);
    }
  }

  return plan;
}

/**
 * Validate and sanitize the AI-generated plan
 */
function validateAndSanitizePlan(plan: any[], maxDays: number): GoalPlanMilestone[] {
  if (!Array.isArray(plan)) {
    throw new Error('Plan must be an array');
  }

  return plan
    .filter(milestone => milestone && typeof milestone === 'object')
    .map(milestone => ({
      milestone: String(milestone.milestone || 'Unnamed Milestone'),
      week: Math.max(1, parseInt(milestone.week) || 1),
      tasks: Array.isArray(milestone.tasks) 
        ? milestone.tasks
            .filter((task: any) => task && typeof task === 'object')
            .map((task: any) => ({
              day: Math.max(1, Math.min(7, parseInt(task.day) || 1)),
              task: String(task.task || 'Unnamed Task'),
              description: String(task.description || 'No description provided'),
              estimatedMinutes: Math.max(5, Math.min(480, parseInt(task.estimatedMinutes) || 60)),
              priority: ['low', 'medium', 'high'].includes(task.priority) ? task.priority : 'medium'
            }))
        : []
    }))
    .slice(0, Math.ceil(maxDays / 7)); // Limit to reasonable number of weeks
}

/**
 * Generate task suggestions for plan adaptation
 */
export async function generateTaskSuggestions(context: {
  goalTitle: string;
  completedTasks: string[];
  missedTasks: string[];
  remainingDays: number;
}): Promise<string[]> {
  try {
    const prompt = `
Based on the following context, suggest 3-5 new tasks to help get back on track:

Goal: ${context.goalTitle}
Completed tasks: ${context.completedTasks.join(', ')}
Missed tasks: ${context.missedTasks.join(', ')}
Days remaining: ${context.remainingDays}

Provide specific, actionable tasks that:
1. Build on completed work
2. Address missed opportunities
3. Are achievable in the remaining time
4. Move closer to the goal

Return as a JSON array of strings.
`;

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a productivity coach. Always return valid JSON.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 500,
      temperature: 0.8,
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      return JSON.parse(content);
    }
  } catch (error) {
    console.error('Error generating task suggestions:', error);
  }

  // Fallback suggestions
  return [
    'Review and consolidate your progress so far',
    'Focus on the most critical remaining objectives',
    'Dedicate extra time to areas that need improvement',
    'Create a final push plan for the remaining days'
  ];
}

export default {
  generateGoalPlan,
  generateTaskSuggestions
}; 