import { Router } from 'express';
import { createGoal } from '../controllers/goals.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/', authMiddleware, createGoal);

export default router; 