import express from 'express';
import rateLimit from 'express-rate-limit';
import { db } from '@todoai/database';
import { sql } from 'drizzle-orm';

const router = express.Router();

// Rate limiting for analytics
const analyticsRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 30, // 30 requests per 5 minutes
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many analytics requests. Please wait.',
    },
  },
});

// 🚀 LEGENDARY FEATURE: Advanced Productivity Analytics
router.get('/productivity/:userId', analyticsRateLimit as any, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId || '0', 10);
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_USER_ID', message: 'User ID is required' },
      });
    }
    // Get comprehensive user data
    const [taskData, goalData, streakData] = await Promise.all([
      sql`
        SELECT 
          COUNT(*) as total_tasks,
          COUNT(CASE WHEN completed = true THEN 1 END) as completed_tasks,
          AVG(EXTRACT(EPOCH FROM (completed_at - created_at))/3600) as avg_hours,
          EXTRACT(DOW FROM completed_at) as best_day,
          EXTRACT(HOUR FROM completed_at) as best_hour
        FROM "Task" 
        WHERE user_id = ${userId} AND created_at >= NOW() - INTERVAL '30 days'
        GROUP BY EXTRACT(DOW FROM completed_at), EXTRACT(HOUR FROM completed_at)
        ORDER BY COUNT(*) DESC
        LIMIT 1
      `,
      sql`
        SELECT 
          COUNT(*) as total_goals,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_goals,
          AVG(progress) as avg_progress
        FROM "Goal" 
        WHERE user_id = ${userId}
      `,
      sql`
        SELECT 
          DATE(completed_at) as date,
          COUNT(*) as daily_tasks
        FROM "Task" 
        WHERE user_id = ${userId} AND completed = true 
        AND completed_at >= NOW() - INTERVAL '30 days'
        GROUP BY DATE(completed_at)
        ORDER BY date DESC
      `
    ]);

    // Calculate productivity metrics
    const taskMetrics = taskData[0] || {};
    const goalMetrics = goalData[0] || {};
    
    const taskCompletionRate = parseInt(taskMetrics.total_tasks) > 0 ? 
      (parseInt(taskMetrics.completed_tasks) / parseInt(taskMetrics.total_tasks)) * 100 : 0;
    
    const goalCompletionRate = parseInt(goalMetrics.total_goals) > 0 ? 
      (parseInt(goalMetrics.completed_goals) / parseInt(goalMetrics.total_goals)) * 100 : 0;

    // Calculate current streak
    let currentStreak = 0;
    for (const day of streakData) {
      if (parseInt(day.daily_tasks) > 0) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate productivity score
    const productivityScore = Math.round(
      (taskCompletionRate * 0.4) + 
      (goalCompletionRate * 0.3) + 
      (Math.min(currentStreak * 5, 30)) // Max 30 points for streak
    );

    const analytics = {
      productivityScore,
      metrics: {
        taskCompletionRate: Math.round(taskCompletionRate),
        goalCompletionRate: Math.round(goalCompletionRate),
        averageTaskTime: parseFloat(taskMetrics.avg_hours) || 2.5,
        currentStreak,
        totalTasks: parseInt(taskMetrics.total_tasks) || 0,
        completedTasks: parseInt(taskMetrics.completed_tasks) || 0,
      },
      patterns: {
        bestDay: getDayName(parseInt(taskMetrics.best_day) || 1),
        bestHour: parseInt(taskMetrics.best_hour) || 9,
        consistency: calculateConsistency(streakData),
      },
      insights: generateInsights(productivityScore, currentStreak, taskCompletionRate),
      recommendations: generateRecommendations(productivityScore, taskMetrics),
    };

    res.json({
      success: true,
      data: analytics,
      metadata: {
        analysisDepth: 'advanced',
        dataPoints: taskData.length + goalData.length + streakData.length,
        timestamp: new Date().toISOString(),
      },
    });
    return;

  } catch (error: any) {
    console.error('Analytics Error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'ANALYTICS_FAILED',
        message: 'Failed to generate analytics',
      },
    });
    return;
  }
});

// 🚀 LEGENDARY FEATURE: Team/Workspace Analytics
router.get('/team/:workspaceId', analyticsRateLimit as any, async (req, res) => {
  try {
    const workspaceId = parseInt(req.params.workspaceId || '0', 10);
    if (!workspaceId) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_WORKSPACE_ID', message: 'Workspace ID is required' },
      });
    }
    // Team-wide metrics
    const teamMetrics = await sql`
      SELECT 
        u.id as user_id,
        u.name,
        COUNT(t.id) as total_tasks,
        COUNT(CASE WHEN t.completed = true THEN 1 END) as completed_tasks,
        COUNT(g.id) as total_goals,
        COUNT(CASE WHEN g.status = 'completed' THEN 1 END) as completed_goals,
        AVG(g.progress) as avg_goal_progress
      FROM "User" u
      LEFT JOIN "Task" t ON u.id = t.user_id AND t.created_at >= NOW() - INTERVAL '30 days'
      LEFT JOIN "Goal" g ON u.id = g.user_id AND g.created_at >= NOW() - INTERVAL '30 days'
      WHERE u.workspace_id = ${workspaceId}
      GROUP BY u.id, u.name
    `;

    const teamAnalytics = {
      teamSize: teamMetrics.length,
      teamProductivityScore: calculateTeamProductivityScore(teamMetrics),
      topPerformers: identifyTopPerformers(teamMetrics),
      teamInsights: generateTeamInsights(teamMetrics),
      // You may need to implement or remove these if not used elsewhere
      collaborationScore: 0,
      recommendations: [],
    };

    res.json({
      success: true,
      data: teamAnalytics,
      metadata: {
        teamSize: teamMetrics.length,
        analysisType: 'team',
        timestamp: new Date().toISOString(),
      },
    });
    return;

  } catch (error: any) {
    console.error('Team Analytics Error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'TEAM_ANALYTICS_FAILED',
        message: 'Failed to generate team analytics',
      },
    });
    return;
  }
});

// Helper Functions for Advanced Analytics

function getDayName(dayNumber: number): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayNumber] || 'Monday';
}

function calculateConsistency(streakData: any[]): number {
  if (streakData.length < 7) return 50;
  
  const activeDays = streakData.filter(d => parseInt(d.daily_tasks) > 0).length;
  return Math.round((activeDays / streakData.length) * 100);
}

function generateInsights(score: number, streak: number, taskRate: number): string[] {
  const insights = [];
  
  if (score > 80) insights.push('🏆 You\'re a productivity superstar!');
  else if (score < 50) insights.push('🎯 Focus on small wins to build momentum');
  
  if (streak > 7) insights.push('🔥 You\'re on a hot streak!');
  if (taskRate > 90) insights.push('✅ Outstanding task completion rate');
  
  return insights;
}

function generateRecommendations(score: number, taskMetrics: any): string[] {
  const recs = [];
  if (score < 60) recs.push('Break down big tasks into smaller steps');
  if (score > 80) recs.push('Consider mentoring others on your team');
  if ((parseInt(taskMetrics.total_tasks) || 0) > 20) recs.push('Review your workload weekly');
  return recs;
}

function calculateTeamProductivityScore(teamMetrics: any[]): number {
  if (!teamMetrics.length) return 0;
  const avg = teamMetrics.reduce((sum, m) => sum + (parseInt(m.completed_tasks) || 0), 0) / teamMetrics.length;
  return Math.round(avg);
}

function identifyTopPerformers(teamMetrics: any[]): any[] {
  return teamMetrics
    .sort((a, b) => (parseInt(b.completed_tasks) || 0) - (parseInt(a.completed_tasks) || 0))
    .slice(0, 3)
    .map(m => ({ userId: m.user_id, name: m.name, completedTasks: parseInt(m.completed_tasks) || 0 }));
}

function generateTeamInsights(teamMetrics: any[]): string[] {
  const insights = [];
  if (teamMetrics.length > 5) insights.push('Large team detected - consider regular standups');
  if (teamMetrics.some(m => (parseInt(m.completed_tasks) || 0) > 10)) insights.push('Some team members are highly productive');
  return insights;
}

export default router; 