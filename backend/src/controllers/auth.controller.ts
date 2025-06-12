import { Request, Response } from 'express';
import { PrismaClient } from '../../src/src/generated/prisma';
import bcrypt from 'bcrypt';
import { signToken } from '../utils/jwt';
import { z } from 'zod';

const prisma = new PrismaClient();

const signupSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function signup(req: Request, res: Response) {
  try {
    const { name, email, password } = signupSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already in use' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { name, email, password: hashed } });
    const token = signToken(user.id);
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err: any) {
    return res.status(400).json({ message: err.message || 'Signup failed' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Invalid credentials' });
    const token = signToken(user.id);
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err: any) {
    return res.status(400).json({ message: err.message || 'Login failed' });
  }
}

export async function me(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ id: user.id, name: user.name, email: user.email });
  } catch (err: any) {
    return res.status(400).json({ message: err.message || 'Failed to fetch user' });
  }
} 