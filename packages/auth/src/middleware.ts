import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './types';

// Simple middleware placeholder
export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  // TODO: Implement proper JWT verification
  // For now, just pass through
  next();
};

export default authMiddleware; 