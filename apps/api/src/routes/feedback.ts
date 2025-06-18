import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { neon } from '@neondatabase/serverless';

const router = Router();

// Database connection
const sql = neon(process.env.DATABASE_URL!);

// Validation schema
const FeedbackSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .min(1, 'Email is required')
    .max(255, 'Email too long')
    .transform((email) => email.toLowerCase().trim()),
  love: z
    .string()
    .min(1, 'Please tell us what you love')
    .max(1000, 'Too long - please keep it under 1000 characters'),
  want: z
    .string()
    .max(1000, 'Too long - please keep it under 1000 characters')
    .optional(),
  changes: z
    .string()
    .max(1000, 'Too long - please keep it under 1000 characters')
    .optional(),
  pricing: z
    .enum(['free', 'freemium', 'paid', 'subscription', 'one-time'])
    .optional(),
  rating: z
    .number()
    .int()
    .min(1, 'Rating must be between 1 and 10')
    .max(10, 'Rating must be between 1 and 10')
    .optional(),
  recommendation: z
    .number()
    .int()
    .min(1, 'Recommendation must be between 1 and 10')
    .max(10, 'Recommendation must be between 1 and 10')
    .optional(),
  source: z
    .string()
    .optional()
    .default('feedback_page'),
});

// Rate limiting state
const feedbackRateLimitMap = new Map<string, { count: number; resetTime: number }>();

const feedbackRateLimit = (req: Request, res: Response, next: Function) => {
  const clientIP = req.ip || 'unknown';
  const now = Date.now();
  const windowMs = 30 * 60 * 1000; // 30 minutes
  const maxRequests = 3; // More restrictive for feedback

  const clientData = feedbackRateLimitMap.get(clientIP);

  if (!clientData || now > clientData.resetTime) {
    feedbackRateLimitMap.set(clientIP, { count: 1, resetTime: now + windowMs });
    return next();
  }

  if (clientData.count >= maxRequests) {
    return res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many feedback submissions. Please try again in 30 minutes.',
        timestamp: new Date().toISOString(),
      },
    });
  }

  clientData.count++;
  next();
};

/**
 * POST /api/v1/feedback
 * Submit user feedback
 */
router.post('/', feedbackRateLimit, async (req: Request, res: Response) => {
  try {
    const validatedData = FeedbackSchema.parse(req.body);
    const { email, love, want, changes, pricing, rating, recommendation, source } = validatedData;

    // Content validation - check for spam patterns
    const spamPatterns = [
      /viagra/i,
      /casino/i,
      /lottery/i,
      /winner/i,
      /congratulations/i,
      /click here/i,
      /free money/i,
    ];

    const contentToCheck = `${love} ${want || ''} ${changes || ''}`;
    if (spamPatterns.some(pattern => pattern.test(contentToCheck))) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_CONTENT',
          message: 'Your feedback contains inappropriate content',
          timestamp: new Date().toISOString(),
        },
      });
    }

    // Insert feedback into database
    const result = await sql`
      INSERT INTO feedback (
        email, love, want, changes, pricing, rating, recommendation, source, created_at, updated_at
      )
      VALUES (
        ${email}, ${love}, ${want || null}, ${changes || null}, 
        ${pricing || null}, ${rating || null}, ${recommendation || null}, 
        ${source}, NOW(), NOW()
      )
      RETURNING id, email, created_at
    `;

    const feedbackEntry = result[0] as any;

    // Log feedback submission (without sensitive content)
    console.log('📝 Feedback Submitted:', {
      id: feedbackEntry.id,
      email: email.replace(/(.{2}).*(@.*)/, '$1***$2'),
      hasRating: rating !== undefined,
      hasRecommendation: recommendation !== undefined,
      source,
      timestamp: new Date().toISOString(),
    });

    // Generate insights from the feedback - handle undefined values properly
    const insights = generateFeedbackInsights({
      love,
      want: want || '',
      changes: changes || '',
      ...(rating !== undefined && { rating }),
      ...(recommendation !== undefined && { recommendation }),
    });

    return res.status(201).json({
      success: true,
      data: {
        id: feedbackEntry.id,
        submittedAt: feedbackEntry.created_at,
        insights,
      },
      message: 'Thank you for your valuable feedback! Your input helps us build a better TodoAI.',
      meta: {
        feedbackId: feedbackEntry.id,
        willInfluenceRoadmap: true,
      },
    });

  } catch (error: any) {
    console.error('Feedback API Error:', error);

    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid feedback data',
          details: error.errors,
          timestamp: new Date().toISOString(),
        },
      });
    }

    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to submit feedback',
        timestamp: new Date().toISOString(),
      },
    });
  }
});

/**
 * GET /api/v1/feedback/insights
 * Get anonymized feedback insights for product development
 */
router.get('/insights', async (req: Request, res: Response) => {
  try {
    const insights = await sql`
      SELECT 
        COUNT(*) as total_feedback,
        AVG(rating) as avg_rating,
        AVG(recommendation) as avg_recommendation,
        COUNT(CASE WHEN rating >= 8 THEN 1 END) as high_ratings,
        COUNT(CASE WHEN recommendation >= 9 THEN 1 END) as promoters,
        COUNT(CASE WHEN recommendation <= 6 THEN 1 END) as detractors,
        COUNT(CASE WHEN pricing = 'freemium' THEN 1 END) as freemium_preference,
        COUNT(CASE WHEN pricing = 'subscription' THEN 1 END) as subscription_preference,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as recent_feedback
      FROM feedback
      WHERE created_at >= NOW() - INTERVAL '30 days'
    `;

    const feedbackInsights = insights[0] as any;

    // Calculate Net Promoter Score (NPS)
    const promoters = parseInt(feedbackInsights.promoters || '0');
    const detractors = parseInt(feedbackInsights.detractors || '0');
    const total = parseInt(feedbackInsights.total_feedback || '0');
    const nps = total > 0 ? Math.round(((promoters - detractors) / total) * 100) : 0;

    return res.json({
      success: true,
      data: {
        overview: {
          totalFeedback: total,
          recentFeedback: parseInt(feedbackInsights.recent_feedback || '0'),
          avgRating: parseFloat(feedbackInsights.avg_rating || '0').toFixed(1),
          avgRecommendation: parseFloat(feedbackInsights.avg_recommendation || '0').toFixed(1),
        },
        satisfaction: {
          highRatings: parseInt(feedbackInsights.high_ratings || '0'),
          nps,
          promoters,
          detractors,
        },
        pricing: {
          freemiumPreference: parseInt(feedbackInsights.freemium_preference || '0'),
          subscriptionPreference: parseInt(feedbackInsights.subscription_preference || '0'),
        },
      },
      meta: {
        lastUpdated: new Date().toISOString(),
        dataRange: '30 days',
      },
    });

  } catch (error: any) {
    console.error('Feedback insights error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch insights',
        timestamp: new Date().toISOString(),
      },
    });
  }
});

/**
 * Helper function to generate insights from feedback
 */
function generateFeedbackInsights(feedback: {
  love: string;
  want: string;
  changes: string;
  rating?: number;
  recommendation?: number;
}) {
  const insights = {
    sentiment: 'positive' as 'positive' | 'neutral' | 'negative',
    themes: [] as string[],
    priority: 'medium' as 'low' | 'medium' | 'high',
  };

  // Simple sentiment analysis
  const positiveWords = ['love', 'great', 'awesome', 'amazing', 'excellent', 'fantastic', 'perfect'];
  const negativeWords = ['hate', 'terrible', 'awful', 'bad', 'horrible', 'disappointing'];

  const content = `${feedback.love} ${feedback.want} ${feedback.changes}`.toLowerCase();
  const positiveCount = positiveWords.filter(word => content.includes(word)).length;
  const negativeCount = negativeWords.filter(word => content.includes(word)).length;

  if (positiveCount > negativeCount) {
    insights.sentiment = 'positive';
  } else if (negativeCount > positiveCount) {
    insights.sentiment = 'negative';
  } else {
    insights.sentiment = 'neutral';
  }

  // Extract themes
  const themeKeywords = [
    { theme: 'UI/UX', keywords: ['interface', 'design', 'ui', 'ux', 'layout', 'look'] },
    { theme: 'Performance', keywords: ['fast', 'slow', 'speed', 'performance', 'loading'] },
    { theme: 'Features', keywords: ['feature', 'function', 'capability', 'tool'] },
    { theme: 'AI', keywords: ['ai', 'artificial', 'intelligence', 'smart', 'automation'] },
    { theme: 'Mobile', keywords: ['mobile', 'phone', 'app', 'android', 'ios'] },
  ];

  themeKeywords.forEach(({ theme, keywords }) => {
    if (keywords.some(keyword => content.includes(keyword))) {
      insights.themes.push(theme);
    }
  });

  // Determine priority based on rating and recommendation
  if (feedback.rating && feedback.recommendation) {
    const avgScore = (feedback.rating + feedback.recommendation) / 2;
    if (avgScore <= 4) insights.priority = 'high';
    else if (avgScore >= 8) insights.priority = 'low';
    else insights.priority = 'medium';
  }

  return insights;
}

export default router; 