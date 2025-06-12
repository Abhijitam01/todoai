import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

// Extend the Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Access token required', code: 401 });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!token) {
      res.status(401).json({ error: 'Access token required', code: 401 });
      return;
    }

    const decoded = verifyToken(token);
    
    if (!decoded) {
      res.status(401).json({ error: 'Invalid or expired token', code: 401 });
      return;
    }

    // Add user info to request object
    req.user = {
      id: decoded.userId,
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Invalid or expired token', code: 401 });
  }
}; 