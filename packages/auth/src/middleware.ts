import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

// Simple middleware placeholder
export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  // TODO: Implement proper JWT verification
  // For now, just pass through
  next();
};

export default authMiddleware; 