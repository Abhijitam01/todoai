import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from './errorHandler';
import { verifyAccessToken } from '@todoai/auth'

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      throw new UnauthorizedError('Authorization header is required');
    }

    if (!authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authorization header must start with Bearer');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!token) {
      throw new UnauthorizedError('Token is required');
    }

    // Verify access token using shared auth package
    const payload = verifyAccessToken(token)

    req.user = {
      id: payload.userId,
      email: payload.email,
      role: 'user',
    }

    next();
  } catch (error: unknown) {
    next(error as Error);
  }
} 