import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
// Note: HTTP server and Socket.IO are initialized in server.ts
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// @ts-ignore
import prometheusMiddleware from 'express-prometheus-middleware';
// @ts-ignore
import client from 'prom-client';

// Import routes
import goalsRouter from './routes/goals';
import authRouter from './routes/auth';
import tasksRouter from './routes/tasks';
import waitlistRouter from './routes/waitlist';
import feedbackRouter from './routes/feedback';
import aiRouter from './routes/ai';
import analyticsRouter from './routes/analytics';
import docsRouter from './routes/docs';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/auth';
import { RealtimeService, initializeRealTimeService } from './services/realtime';

// Load environment variables
dotenv.config();

const app = express();
// Socket.IO is initialized in server.ts and attached to the HTTP server

// Legendary middleware stack
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'", "'unsafe-eval'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "wss:", "ws:"],
    },
  },
}));

app.use(compression() as any);
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Custom Prometheus metrics
export const goalsCreatedCounter = new client.Counter({ name: 'goals_created', help: 'Number of goals created' });
export const tasksCompletedCounter = new client.Counter({ name: 'tasks_completed', help: 'Number of tasks completed' });
export const aiPlanRevisionsCounter = new client.Counter({ name: 'ai_plan_revisions', help: 'Number of AI plan revisions triggered' });
export const apiErrorCounter = new client.Counter({ name: 'api_errors', help: 'Number of API errors' });

app.use(prometheusMiddleware({
  metricsPath: '/metrics',
  collectDefaultMetrics: true,
  requestDurationBuckets: [0.1, 0.5, 1, 1.5],
  authenticate: (req: express.Request) => true,
  extraMasks: [],
  // Add custom metrics to /metrics endpoint
  promClient: client,
}));

// Health check endpoint - legendary status
app.get('/health', (req, res) => {
  const healthStatus = {
    status: 'legendary',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    features: {
      realtime: true,
      ai: true,
      analytics: true,
      achievements: true,
      collaboration: true
    }
  };
  res.json(healthStatus);
});

// API routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/goals', authMiddleware, goalsRouter);
app.use('/api/v1/tasks', authMiddleware, tasksRouter);
app.use('/api/v1/waitlist', waitlistRouter);
app.use('/api/v1/feedback', feedbackRouter);
app.use('/api/v1/ai', aiRouter);
app.use('/api/v1/analytics', analyticsRouter);

// Root endpoint with legendary API documentation
app.use('/api/docs', docsRouter);
app.get('/', (req, res) => {
  res.json({
    name: 'TodoAI API',
    version: '2.0.0',
    status: 'legendary',
    message: '🚀 Welcome to the most advanced productivity API on Earth!',
    documentation: '/api/docs',
    health: '/health',
    features: {
      ai: 'Advanced task prioritization and goal optimization',
      realtime: 'Live collaboration and progress updates',
      analytics: 'Deep productivity insights and recommendations',
      achievements: 'Gamified productivity with smart rewards',
    },
    author: 'Built with legendary AI assistance',
    timestamp: new Date().toISOString(),
  });
});

// Real-time service is initialized in server.ts after Socket.IO is created

// Legendary error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('🔥 Legendary Error Handler:', err);
  
  const errorResponse = {
    success: false,
    error: {
      message: err.message || 'An unexpected error occurred',
      code: err.code || 'INTERNAL_ERROR',
      timestamp: new Date().toISOString(),
      requestId: req.headers['x-request-id'] || Math.random().toString(36).substring(7)
    }
  };

  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json(errorResponse);

  // Increment apiErrorCounter
  apiErrorCounter.inc();
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Endpoint not found',
      code: 'NOT_FOUND',
      path: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString()
    }
  });
});

export default app; 