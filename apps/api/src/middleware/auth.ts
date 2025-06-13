import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from './errorHandler';

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

    // TODO: Implement proper JWT verification
    // For now, we'll accept any token that looks like a JWT
    if (token.length < 10) {
      throw new UnauthorizedError('Invalid token format');
    }

    // Mock user data - replace with actual JWT verification
    req.user = {
      id: 'user-123',
      email: 'user@example.com',
      role: 'user'
    };

    next();
  } catch (error) {
    next(error);
  }
} 