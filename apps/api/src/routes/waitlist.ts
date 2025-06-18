import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { neon } from '@neondatabase/serverless';

const router = Router();

// Database connection
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set. Please ensure you have a .env file with DATABASE_URL defined, and that dotenv is loaded in your test setup.');
const sql = neon(process.env.DATABASE_URL!);

// Validation schema
const WaitlistSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .min(1, 'Email is required')
    .max(255, 'Email too long')
    .transform((email) => email.toLowerCase().trim()),
  source: z
    .string()
    .optional()
    .default('landing_page'),
  referrer: z.string().optional(),
});

// Rate limiting state
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const waitlistRateLimit = (req: Request, res: Response, next: Function) => {
  const clientIP = req.ip || 'unknown';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 5;

  const clientData = rateLimitMap.get(clientIP);

  if (!clientData || now > clientData.resetTime) {
    rateLimitMap.set(clientIP, { count: 1, resetTime: now + windowMs });
    return next();
  }

  if (clientData.count >= maxRequests) {
    return res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests. Please try again in 15 minutes.',
        timestamp: new Date().toISOString(),
      },
    });
  }

  clientData.count++;
  next();
};

/**
 * POST /api/v1/waitlist
 * Add email to waitlist
 */
router.post('/', waitlistRateLimit, async (req: Request, res: Response) => {
  try {
    const validatedData = WaitlistSchema.parse(req.body);
    const { email, source, referrer } = validatedData;

    // Check for suspicious patterns
    const suspiciousPatterns = [/test[0-9]+@/i, /fake@/i, /spam@/i, /bot@/i];
    if (suspiciousPatterns.some(pattern => pattern.test(email))) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_EMAIL',
          message: 'Please provide a valid email address',
          timestamp: new Date().toISOString(),
        },
      });
    }

         // Check disposable email domains
     const disposableDomains = ['10minutemail.com', 'guerrillamail.com'];
     const emailParts = email.split('@');
     if (emailParts.length === 2 && emailParts[1] && disposableDomains.includes(emailParts[1])) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'DISPOSABLE_EMAIL_NOT_ALLOWED',
          message: 'Disposable email addresses are not allowed',
          timestamp: new Date().toISOString(),
        },
      });
    }

    // Insert into database
    const result = await sql`
      INSERT INTO waitlist (email, source, referrer, created_at, updated_at)
      VALUES (${email}, ${source}, ${referrer || null}, NOW(), NOW())
      ON CONFLICT (email) 
      DO UPDATE SET 
        source = EXCLUDED.source,
        referrer = EXCLUDED.referrer,
        updated_at = NOW()
      RETURNING id, email, source, created_at
    `;

    const waitlistEntry = result[0] as any;

    console.log('✅ Waitlist Addition:', {
      id: waitlistEntry.id,
      email: email.replace(/(.{2}).*(@.*)/, '$1***$2'),
      source,
      timestamp: new Date().toISOString(),
    });

    return res.status(201).json({
      success: true,
      data: {
        id: waitlistEntry.id,
        email: waitlistEntry.email,
        source: waitlistEntry.source,
        joinedAt: waitlistEntry.created_at,
      },
      message: 'Successfully joined the waitlist! You\'ll be notified when we launch.',
    });

  } catch (error: any) {
    console.error('Waitlist API Error:', error);

    if (error.message?.includes('duplicate key value')) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'EMAIL_ALREADY_EXISTS',
          message: 'This email is already on our waitlist!',
          timestamp: new Date().toISOString(),
        },
      });
    }

    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: error.errors,
          timestamp: new Date().toISOString(),
        },
      });
    }

    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
        timestamp: new Date().toISOString(),
      },
    });
  }
});

/**
 * GET /api/v1/waitlist/stats
 * Get waitlist statistics
 */
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const stats = await sql`
      SELECT 
        COUNT(*) as total_signups,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '24 hours' THEN 1 END) as signups_24h,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as signups_7d
      FROM waitlist
    `;

    const waitlistStats = stats[0] as any;

    return res.json({
      success: true,
      data: {
        totalSignups: parseInt(waitlistStats.total_signups || '0'),
        recentActivity: {
          last24Hours: parseInt(waitlistStats.signups_24h || '0'),
          last7Days: parseInt(waitlistStats.signups_7d || '0'),
        },
      },
      meta: {
        lastUpdated: new Date().toISOString(),
      },
    });

  } catch (error: any) {
    console.error('Waitlist stats error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch statistics',
        timestamp: new Date().toISOString(),
      },
    });
  }
});

export default router; 