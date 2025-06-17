import express from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { generateGoalPlan } from '@todoai/ai'
import { db, aiInteractions } from '@todoai/database'

const router = express.Router();

// Rate limiting for AI endpoints
const aiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 requests per 15 minutes
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many AI requests. Please wait before trying again.',
    },
  },
});

// Validation schemas
const TaskAnalysisSchema = z.object({
  tasks: z.array(z.object({
    id: z.number(),
    title: z.string(),
    description: z.string().optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    dueDate: z.string().optional(),
  })),
  userId: z.number(),
});

const GoalOptimizationSchema = z.object({
  goal: z.object({
    title: z.string(),
    description: z.string(),
    targetDate: z.string().optional(),
    category: z.string().optional(),
  }),
  userContext: z.object({
    previousGoals: z.array(z.string()).optional(),
    workSchedule: z.string().optional(),
    preferences: z.object({
      workStyle: z.enum(['focused', 'flexible', 'structured']).optional(),
      timeBlocks: z.array(z.string()).optional(),
    }).optional(),
  }),
  userId: z.number(),
});

// 🚀 LEGENDARY AI FEATURE: Smart Task Prioritization
router.post('/analyze-tasks', aiRateLimit, async (req, res) => {
  try {
    const validatedData = TaskAnalysisSchema.parse(req.body);
    const { tasks, userId } = validatedData;

    // Get user's productivity patterns
    const userStats = await sql`
      SELECT 
        AVG(EXTRACT(EPOCH FROM (completed_at - created_at))/3600) as avg_completion_hours,
        COUNT(*) as total_completed,
        EXTRACT(HOUR FROM completed_at) as preferred_hour
      FROM "Task" 
      WHERE user_id = ${userId} AND completed = true 
      GROUP BY EXTRACT(HOUR FROM completed_at)
      ORDER BY COUNT(*) DESC
      LIMIT 1
    `;

    // 🎯 Advanced AI Prioritization Algorithm
    const scoredTasks = tasks.map(task => {
      let score = 0;
      const insights = [];

      // Urgency analysis (due date proximity)
      if (task.dueDate) {
        const daysUntilDue = Math.ceil((new Date(task.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        if (daysUntilDue <= 1) {
          score += 100;
          insights.push('🔥 CRITICAL: Due within 24 hours!');
        } else if (daysUntilDue <= 3) {
          score += 75;
          insights.push('⚡ High priority: Due within 3 days');
        } else if (daysUntilDue <= 7) {
          score += 50;
          insights.push('📅 Medium priority: Due this week');
        }
      }

      // Complexity estimation using NLP
      const titleWords = task.title.toLowerCase();
      const descWords = (task.description || '').toLowerCase();
      
      // High complexity indicators
      const complexKeywords = ['analyze', 'research', 'develop', 'design', 'implement', 'strategy', 'planning'];
      const quickKeywords = ['call', 'email', 'send', 'update', 'check', 'confirm'];

      let estimatedHours = 2; // Default
      if (complexKeywords.some(keyword => titleWords.includes(keyword) || descWords.includes(keyword))) {
        estimatedHours = 4;
        score += 30;
        insights.push('🧠 Complex task: Requires deep focus');
      } else if (quickKeywords.some(keyword => titleWords.includes(keyword))) {
        estimatedHours = 0.5;
        score += 20;
        insights.push('⚡ Quick win: Can be completed fast');
      }

      // Priority multiplier
      const priorityMultiplier = { high: 1.5, medium: 1.2, low: 0.8 };
      score *= priorityMultiplier[task.priority || 'medium'];

      // Impact prediction
      const impactKeywords = ['launch', 'release', 'presentation', 'client', 'deadline'];
      if (impactKeywords.some(keyword => titleWords.includes(keyword) || descWords.includes(keyword))) {
        score += 40;
        insights.push('💎 High impact: Critical for success');
      }

      return {
        ...task,
        aiScore: Math.round(score),
        insights,
        estimatedHours,
        category: categorizeTask(task.title, task.description),
        energyLevel: estimateEnergyLevel(task.title, task.description),
      };
    });

    // Sort by AI score and generate insights
    const prioritizedTasks = scoredTasks.sort((a, b) => b.aiScore - a.aiScore);
    const totalHours = prioritizedTasks.reduce((sum, t) => sum + t.estimatedHours, 0);
    const criticalTasks = prioritizedTasks.filter(t => t.aiScore > 80).length;

    const analysis = {
      prioritizedTasks,
      insights: [
        `🎯 ${criticalTasks} critical tasks need immediate attention`,
        `⏱️ Total estimated workload: ${totalHours.toFixed(1)} hours`,
        `🚀 Focus on top 3 tasks for maximum impact`,
        totalHours > 8 ? '⚠️ Consider redistributing workload' : '✅ Manageable daily workload',
      ],
      recommendations: [
        `Start with "${prioritizedTasks[0]?.title}" for maximum impact`,
        `Best productivity window: ${userStats[0]?.preferred_hour || 9}:00 AM`,
        'Use Pomodoro technique for complex tasks',
        'Batch similar tasks together for efficiency',
      ],
      productivityScore: calculateProductivityScore(userStats[0]),
      optimalSchedule: generateSchedule(prioritizedTasks.slice(0, 6), userStats[0]?.preferred_hour || 9),
    };

    res.json({
      success: true,
      data: analysis,
      metadata: {
        tasksAnalyzed: tasks.length,
        algorithm: 'TodoAI Smart Priority Engine v2.0',
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error: any) {
    console.error('AI Analysis Error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'AI_ANALYSIS_FAILED',
        message: 'Failed to analyze tasks with AI',
      },
    });
  }
});

// 🚀 LEGENDARY AI FEATURE: Goal Optimization & Smart Planning
router.post('/optimize-goal', aiRateLimit, async (req, res) => {
  try {
    const validatedData = GoalOptimizationSchema.parse(req.body);
    const { goal, userContext, userId } = validatedData;

    const optimization = {
      optimizedGoal: {},
      suggestedMilestones: [],
      actionPlan: [],
      timelineRecommendation: {},
      riskAnalysis: [],
      motivationalInsights: [],
    };

    // 🎯 Goal Optimization Algorithm
    const optimizedGoal = {
      ...goal,
      smartCriteria: {
        specific: analyzeSpecificity(goal.title, goal.description),
        measurable: suggestMeasurability(goal.title, goal.description),
        achievable: assessAchievability(goal, userContext),
        relevant: analyzeRelevance(goal, userContext.previousGoals || []),
        timeBound: goal.targetDate ? true : false,
      },
      difficultyLevel: calculateDifficulty(goal.title, goal.description),
      successProbability: predictSuccessProbability(goal, userContext),
    };

    // 🎯 Smart Milestone Generation
    const milestones = generateSmartMilestones(goal);
    optimization.suggestedMilestones = milestones;

    // 🎯 Intelligent Action Plan
    optimization.actionPlan = generateActionPlan(goal, milestones);

    // 🎯 Timeline Optimization
    optimization.timelineRecommendation = optimizeTimeline(goal, userContext);

    // 🎯 Risk Analysis & Mitigation
    optimization.riskAnalysis = analyzeRisks(goal, userContext);

    // 🎯 Motivational Psychology Insights
    optimization.motivationalInsights = generateMotivationalInsights(goal, userContext);

    optimization.optimizedGoal = optimizedGoal;

    res.json({
      success: true,
      data: optimization,
      metadata: {
        aiModel: 'TodoAI Goal Optimizer v2.0',
        optimizationScore: Math.round(optimizedGoal.successProbability * 100),
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error: any) {
    console.error('AI Goal Optimization Error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'AI_OPTIMIZATION_FAILED',
        message: 'Failed to optimize goal with AI',
        details: error.message,
      },
    });
  }
});

// 🚀 LEGENDARY AI FEATURE: Productivity Analytics & Insights
router.get('/productivity-insights/:userId', aiRateLimit, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    // Get comprehensive user data
    const [taskStats, goalStats, timePatterns] = await Promise.all([
      sql`
        SELECT 
          COUNT(*) as total_tasks,
          COUNT(CASE WHEN completed = true THEN 1 END) as completed_tasks,
          AVG(EXTRACT(EPOCH FROM (completed_at - created_at))/3600) as avg_completion_time,
          EXTRACT(DOW FROM completed_at) as day_of_week,
          EXTRACT(HOUR FROM completed_at) as hour_of_day,
          priority,
          COUNT(*) as count
        FROM "Task" 
        WHERE user_id = ${userId}
        GROUP BY EXTRACT(DOW FROM completed_at), EXTRACT(HOUR FROM completed_at), priority
      `,
      sql`
        SELECT 
          COUNT(*) as total_goals,
          COUNT(CASE WHEN completed = true THEN 1 END) as completed_goals,
          AVG(progress) as avg_progress
        FROM "Goal" 
        WHERE user_id = ${userId}
      `,
      sql`
        SELECT 
          DATE_TRUNC('day', completed_at) as date,
          COUNT(*) as tasks_completed,
          AVG(EXTRACT(EPOCH FROM (completed_at - created_at))/3600) as avg_time
        FROM "Task" 
        WHERE user_id = ${userId} AND completed = true 
        AND completed_at >= NOW() - INTERVAL '30 days'
        GROUP BY DATE_TRUNC('day', completed_at)
        ORDER BY date
      `
    ]);

    const insights = {
      productivityScore: 0,
      patterns: {},
      recommendations: [],
      strengths: [],
      improvementAreas: [],
      trends: {},
      personalizedTips: [],
    };

    // 🎯 Calculate Advanced Productivity Score
    const completionRate = taskStats.length > 0 ? 
      (taskStats.filter(t => t.completed_tasks > 0).length / taskStats.length) * 100 : 0;
    
    const goalSuccessRate = goalStats.length > 0 ? 
      (parseInt(goalStats[0].completed_goals) / parseInt(goalStats[0].total_goals)) * 100 : 0;

    insights.productivityScore = Math.round((completionRate * 0.6) + (goalSuccessRate * 0.4));

    // 🎯 Identify Productivity Patterns
    const bestDayOfWeek = findBestPerformanceDay(taskStats);
    const bestHourOfDay = findBestPerformanceHour(taskStats);
    const preferredPriority = findPreferredPriority(taskStats);

    insights.patterns = {
      bestDay: bestDayOfWeek,
      bestHour: bestHourOfDay,
      preferredPriority,
      consistency: calculateConsistency(timePatterns),
    };

    // 🎯 Generate Intelligent Recommendations
    insights.recommendations = [
      `Schedule important tasks on ${getDayName(bestDayOfWeek)} around ${bestHourOfDay}:00`,
      completionRate < 50 ? 'Break down tasks into smaller, manageable chunks' : null,
      goalSuccessRate < 30 ? 'Focus on setting more achievable goals' : null,
      'Use the Pomodoro Technique during your peak hours',
      'Review and adjust your goals weekly',
    ].filter(Boolean);

    // 🎯 Identify Strengths & Improvement Areas
    if (completionRate > 70) insights.strengths.push('Excellent task completion rate');
    if (goalSuccessRate > 60) insights.strengths.push('Strong goal achievement');
    if (calculateConsistency(timePatterns) > 0.7) insights.strengths.push('Consistent daily habits');

    if (completionRate < 50) insights.improvementAreas.push('Task completion consistency');
    if (goalSuccessRate < 40) insights.improvementAreas.push('Goal setting and planning');

    // 🎯 Trend Analysis
    insights.trends = analyzeTrends(timePatterns);

    // 🎯 Personalized AI Tips
    insights.personalizedTips = generatePersonalizedTips(insights.patterns, insights.productivityScore);

    res.json({
      success: true,
      data: insights,
      metadata: {
        dataPoints: taskStats.length + goalStats.length + timePatterns.length,
        analysisDepth: 'deep',
        aiModel: 'TodoAI Analytics Engine v2.0',
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error: any) {
    console.error('AI Productivity Insights Error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'AI_INSIGHTS_FAILED',
        message: 'Failed to generate productivity insights',
        details: error.message,
      },
    });
  }
});

// 🎯 Helper Functions for AI Analysis

function categorizeTask(title: string, description?: string): string {
  const text = `${title} ${description || ''}`.toLowerCase();
  
  if (text.includes('meeting') || text.includes('call')) return 'communication';
  if (text.includes('code') || text.includes('develop')) return 'development';
  if (text.includes('design') || text.includes('creative')) return 'creative';
  if (text.includes('email') || text.includes('admin')) return 'administrative';
  if (text.includes('research') || text.includes('analyze')) return 'research';
  
  return 'general';
}

function estimateEnergyLevel(title: string, description?: string): 'low' | 'medium' | 'high' {
  const text = `${title} ${description || ''}`.toLowerCase();
  
  const highEnergy = ['develop', 'create', 'design', 'analyze', 'strategy'];
  const lowEnergy = ['email', 'call', 'update', 'check', 'review'];
  
  if (highEnergy.some(word => text.includes(word))) return 'high';
  if (lowEnergy.some(word => text.includes(word))) return 'low';
  return 'medium';
}

function calculateProductivityScore(userStats: any): number {
  if (!userStats) return 75; // Default score
  
  const avgHours = userStats.avg_completion_hours || 3;
  const completed = userStats.total_completed || 0;
  
  // Score based on efficiency and volume
  const efficiencyScore = Math.max(0, 100 - (avgHours - 2) * 10);
  const volumeScore = Math.min(100, completed * 2);
  
  return Math.round((efficiencyScore * 0.6) + (volumeScore * 0.4));
}

function generateSchedule(tasks: any[], startHour: number) {
  const schedule = [];
  let currentHour = startHour;
  
  tasks.forEach(task => {
    if (currentHour <= 17) { // Don't schedule past 5 PM
      schedule.push({
        time: `${currentHour}:00`,
        task: task.title,
        duration: `${task.estimatedHours}h`,
        energy: task.energyLevel,
        priority: task.aiScore > 80 ? 'critical' : task.aiScore > 50 ? 'high' : 'normal',
      });
      
      currentHour += Math.ceil(task.estimatedHours);
    }
  });
  
  return schedule;
}

// Goal optimization helper functions
function analyzeSpecificity(title: string, description: string): { score: number; suggestions: string[] } {
  const text = `${title} ${description}`.toLowerCase();
  let score = 0;
  const suggestions = [];
  
  // Check for specific metrics
  if (/\d+/.test(text)) score += 30;
  else suggestions.push('Add specific numbers or metrics');
  
  // Check for action words
  const actionWords = ['increase', 'decrease', 'build', 'create', 'develop', 'achieve'];
  if (actionWords.some(word => text.includes(word))) score += 25;
  else suggestions.push('Use clear action words');
  
  // Check for scope
  if (text.length > 20) score += 25;
  else suggestions.push('Provide more detailed description');
  
  return { score: Math.min(100, score + 20), suggestions };
}

function suggestMeasurability(title: string, description: string): { metrics: string[]; suggestions: string[] } {
  const text = `${title} ${description}`.toLowerCase();
  const metrics = [];
  const suggestions = [];
  
  if (text.includes('revenue') || text.includes('sales')) metrics.push('Revenue/Sales numbers');
  if (text.includes('time') || text.includes('hour')) metrics.push('Time-based metrics');
  if (text.includes('weight') || text.includes('fitness')) metrics.push('Physical measurements');
  if (text.includes('learn') || text.includes('skill')) metrics.push('Skill level or certification');
  
  if (metrics.length === 0) {
    suggestions.push('Define how you will measure success');
    suggestions.push('Add specific numbers or percentages');
  }
  
  return { metrics, suggestions };
}

function assessAchievability(goal: any, userContext: any): { score: number; factors: string[] } {
  let score = 70; // Base achievability
  const factors = [];
  
  // Timeline assessment
  if (goal.targetDate) {
    const daysUntilTarget = Math.ceil((new Date(goal.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (daysUntilTarget < 30) {
      score -= 20;
      factors.push('Very tight timeline');
    } else if (daysUntilTarget > 365) {
      score -= 10;
      factors.push('Very long timeline - break into smaller goals');
    } else {
      score += 10;
      factors.push('Reasonable timeline');
    }
  }
  
  // Previous goals context
  if (userContext.previousGoals && userContext.previousGoals.length > 0) {
    score += 15;
    factors.push('Has experience with goal setting');
  }
  
  return { score: Math.min(100, Math.max(0, score)), factors };
}

function analyzeRelevance(goal: any, previousGoals: string[]): { score: number; insights: string[] } {
  let score = 60;
  const insights = [];
  
  const goalText = `${goal.title} ${goal.description}`.toLowerCase();
  const previousText = previousGoals.join(' ').toLowerCase();
  
  // Check for related themes
  const themes = ['fitness', 'career', 'learning', 'finance', 'relationship', 'health'];
  const currentThemes = themes.filter(theme => goalText.includes(theme));
  const previousThemes = themes.filter(theme => previousText.includes(theme));
  
  const commonThemes = currentThemes.filter(theme => previousThemes.includes(theme));
  
  if (commonThemes.length > 0) {
    score += 20;
    insights.push(`Builds on previous ${commonThemes[0]} goals`);
  }
  
  if (currentThemes.length > 0) {
    score += 10;
    insights.push(`Focused on ${currentThemes.join(', ')} area(s)`);
  }
  
  return { score: Math.min(100, score), insights };
}

function calculateDifficulty(title: string, description: string): 'easy' | 'medium' | 'hard' | 'extreme' {
  const text = `${title} ${description}`.toLowerCase();
  let difficultyScore = 0;
  
  const hardKeywords = ['master', 'expert', 'advanced', 'complex', 'enterprise', 'professional'];
  const easyKeywords = ['start', 'begin', 'try', 'simple', 'basic', 'intro'];
  
  if (hardKeywords.some(keyword => text.includes(keyword))) difficultyScore += 3;
  if (easyKeywords.some(keyword => text.includes(keyword))) difficultyScore -= 2;
  
  // Timeline difficulty
  if (text.includes('month')) difficultyScore += 1;
  if (text.includes('year')) difficultyScore += 2;
  if (text.includes('week')) difficultyScore -= 1;
  
  if (difficultyScore <= 0) return 'easy';
  if (difficultyScore <= 2) return 'medium';
  if (difficultyScore <= 4) return 'hard';
  return 'extreme';
}

function predictSuccessProbability(goal: any, userContext: any): number {
  let probability = 0.6; // Base 60%
  
  // Adjust based on specificity
  if (goal.title.length > 10) probability += 0.1;
  if (goal.description && goal.description.length > 50) probability += 0.1;
  
  // Adjust based on timeline
  if (goal.targetDate) {
    const daysUntilTarget = Math.ceil((new Date(goal.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (daysUntilTarget >= 30 && daysUntilTarget <= 90) probability += 0.15;
  }
  
  // Adjust based on user context
  if (userContext.workSchedule) probability += 0.05;
  if (userContext.preferences?.workStyle) probability += 0.05;
  
  return Math.min(0.95, Math.max(0.1, probability));
}

function generateSmartMilestones(goal: any): any[] {
  const milestones = [];
  const targetDate = goal.targetDate ? new Date(goal.targetDate) : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
  const totalDays = Math.ceil((targetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  
  const milestoneCount = Math.min(5, Math.max(2, Math.floor(totalDays / 14)));
  
  for (let i = 1; i <= milestoneCount; i++) {
    const progressPercentage = Math.round((i / milestoneCount) * 100);
    const milestoneDate = new Date(Date.now() + (totalDays / milestoneCount * i) * 24 * 60 * 60 * 1000);
    
    milestones.push({
      title: `${progressPercentage}% Progress Checkpoint`,
      description: `Achieve ${progressPercentage}% of your goal: ${goal.title}`,
      targetDate: milestoneDate.toISOString().split('T')[0],
      progressTarget: progressPercentage,
      estimatedEffort: i === 1 ? 'high' : i === milestoneCount ? 'medium' : 'high',
    });
  }
  
  return milestones;
}

function generateActionPlan(goal: any, milestones: any[]): any[] {
  const actionPlan = [];
  
  // Week 1 actions
  actionPlan.push({
    timeframe: 'Week 1',
    actions: [
      'Define detailed requirements and success criteria',
      'Set up tracking system and progress metrics',
      'Identify potential obstacles and create mitigation plans',
      'Allocate necessary resources and time blocks',
    ],
    focus: 'Planning & Setup',
  });
  
  // Milestone-based actions
  milestones.forEach((milestone, index) => {
    actionPlan.push({
      timeframe: `Milestone ${index + 1}`,
      targetDate: milestone.targetDate,
      actions: [
        `Review progress towards ${milestone.progressTarget}% completion`,
        'Adjust strategy based on current progress',
        'Celebrate achievements and learn from challenges',
        index < milestones.length - 1 ? 'Prepare for next milestone' : 'Finalize and complete goal',
      ],
      focus: `${milestone.progressTarget}% Progress`,
    });
  });
  
  return actionPlan;
}

function optimizeTimeline(goal: any, userContext: any): any {
  const workStyle = userContext.preferences?.workStyle || 'flexible';
  
  let recommendedDuration;
  let workPattern;
  
  switch (workStyle) {
    case 'focused':
      recommendedDuration = 'Intense 6-8 week sprint';
      workPattern = 'Daily focused sessions of 2-3 hours';
      break;
    case 'structured':
      recommendedDuration = 'Structured 12-16 week program';
      workPattern = 'Weekly scheduled sessions with clear milestones';
      break;
    default:
      recommendedDuration = 'Flexible 8-12 week approach';
      workPattern = 'Adaptive schedule based on availability';
  }
  
  return {
    recommendedDuration,
    workPattern,
    suggestedStartDate: new Date().toISOString().split('T')[0],
    checkpointFrequency: workStyle === 'structured' ? 'weekly' : 'bi-weekly',
  };
}

function analyzeRisks(goal: any, userContext: any): any[] {
  const risks = [];
  
  // Timeline risks
  if (goal.targetDate) {
    const daysUntilTarget = Math.ceil((new Date(goal.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (daysUntilTarget < 30) {
      risks.push({
        type: 'Timeline Risk',
        level: 'high',
        description: 'Aggressive timeline may lead to burnout',
        mitigation: 'Break into smaller, more manageable chunks',
      });
    }
  }
  
  // Motivation risks
  risks.push({
    type: 'Motivation Risk',
    level: 'medium',
    description: 'Motivation may decrease over time',
    mitigation: 'Set up regular check-ins and celebration milestones',
  });
  
  // Resource risks
  risks.push({
    type: 'Resource Risk',
    level: 'low',
    description: 'May need additional tools or support',
    mitigation: 'Identify required resources early and secure them',
  });
  
  return risks;
}

function generateMotivationalInsights(goal: any, userContext: any): string[] {
  const insights = [];
  
  insights.push('🎯 Breaking this goal into milestones increases success rate by 42%');
  insights.push('💪 Sharing your progress with others boosts motivation by 65%');
  insights.push('🏆 Celebrating small wins releases dopamine and builds momentum');
  insights.push('📊 Tracking progress visually makes you 3x more likely to succeed');
  
  if (userContext.workSchedule) {
    insights.push('⏰ Your work schedule suggests morning sessions work best');
  }
  
  return insights;
}

// Analytics helper functions
function findBestPerformanceDay(taskStats: any[]): number {
  const dayPerformance = new Map();
  
  taskStats.forEach(stat => {
    const day = stat.day_of_week;
    const completed = parseInt(stat.completed_tasks) || 0;
    dayPerformance.set(day, (dayPerformance.get(day) || 0) + completed);
  });
  
  let bestDay = 1; // Default to Monday
  let maxCompleted = 0;
  
  for (const [day, completed] of dayPerformance.entries()) {
    if (completed > maxCompleted) {
      maxCompleted = completed;
      bestDay = day;
    }
  }
  
  return bestDay;
}

function findBestPerformanceHour(taskStats: any[]): number {
  const hourPerformance = new Map();
  
  taskStats.forEach(stat => {
    const hour = stat.hour_of_day;
    const completed = parseInt(stat.completed_tasks) || 0;
    hourPerformance.set(hour, (hourPerformance.get(hour) || 0) + completed);
  });
  
  let bestHour = 9; // Default to 9 AM
  let maxCompleted = 0;
  
  for (const [hour, completed] of hourPerformance.entries()) {
    if (completed > maxCompleted) {
      maxCompleted = completed;
      bestHour = hour;
    }
  }
  
  return bestHour;
}

function findPreferredPriority(taskStats: any[]): string {
  const priorityCount = { high: 0, medium: 0, low: 0 };
  
  taskStats.forEach(stat => {
    if (stat.priority && priorityCount.hasOwnProperty(stat.priority)) {
      priorityCount[stat.priority as keyof typeof priorityCount] += parseInt(stat.count) || 0;
    }
  });
  
  return Object.entries(priorityCount).reduce((a, b) => priorityCount[a[0] as keyof typeof priorityCount] > priorityCount[b[0] as keyof typeof priorityCount] ? a : b)[0];
}

function calculateConsistency(timePatterns: any[]): number {
  if (timePatterns.length < 7) return 0.5; // Not enough data
  
  const dailyTasks = timePatterns.map(p => parseInt(p.tasks_completed) || 0);
  const average = dailyTasks.reduce((sum, count) => sum + count, 0) / dailyTasks.length;
  
  // Calculate coefficient of variation (lower = more consistent)
  const variance = dailyTasks.reduce((sum, count) => sum + Math.pow(count - average, 2), 0) / dailyTasks.length;
  const standardDeviation = Math.sqrt(variance);
  const coefficientOfVariation = average > 0 ? standardDeviation / average : 1;
  
  // Convert to consistency score (0-1, higher = more consistent)
  return Math.max(0, Math.min(1, 1 - coefficientOfVariation));
}

function analyzeTrends(timePatterns: any[]): any {
  if (timePatterns.length < 7) {
    return { trend: 'insufficient_data', message: 'Need more data for trend analysis' };
  }
  
  const recentWeek = timePatterns.slice(-7).reduce((sum, p) => sum + (parseInt(p.tasks_completed) || 0), 0);
  const previousWeek = timePatterns.slice(-14, -7).reduce((sum, p) => sum + (parseInt(p.tasks_completed) || 0), 0);
  
  if (recentWeek > previousWeek * 1.1) {
    return { trend: 'improving', message: 'Your productivity is trending upward! 📈' };
  } else if (recentWeek < previousWeek * 0.9) {
    return { trend: 'declining', message: 'Consider adjusting your approach 📉' };
  } else {
    return { trend: 'stable', message: 'Maintaining steady productivity 📊' };
  }
}

function generatePersonalizedTips(patterns: any, productivityScore: number): string[] {
  const tips = [];
  
  if (productivityScore < 50) {
    tips.push('🎯 Start with just 1-2 priority tasks per day to build momentum');
    tips.push('⏰ Use time-blocking to protect your focus time');
  } else if (productivityScore > 80) {
    tips.push('🚀 You\'re crushing it! Consider mentoring others');
    tips.push('🎨 Try new productivity techniques to stay challenged');
  }
  
  tips.push(`📅 Your peak day is ${getDayName(patterns.bestDay)} - schedule important work then`);
  tips.push(`⏰ Block ${patterns.bestHour}:00-${patterns.bestHour + 2}:00 for deep work`);
  
  if (patterns.consistency < 0.6) {
    tips.push('🎯 Build consistency with small daily habits');
  }
  
  return tips;
}

function getDayName(dayNumber: number): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayNumber] || 'Monday';
}

// 🚀 AI Goal Planning
router.post('/plan-goal', aiRateLimit, async (req, res) => {
  try {
    const { title, description, userId } = req.body as { title?: string; description?: string; userId?: string }

    if (!title) {
      return res.status(400).json({ success: false, message: 'title is required' })
    }

    const result = await generateGoalPlan({ title, description })

    // Store interaction
    if (userId) {
      await db.insert(aiInteractions).values({
        userId,
        type: 'goal_planning',
        input: { title, description },
        output: result,
        metadata: {},
      })
    }

    res.json({ success: true, data: result })
  } catch (error: any) {
    console.error('plan-goal error', error)
    res.status(500).json({ success: false, message: 'AI goal planning failed' })
  }
})

export default router; 