import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import { db, users, refreshTokens } from '@todoai/database'
import { eq } from 'drizzle-orm'
import { signAccessToken, signRefreshToken, hashPassword, verifyPassword, authService, verifyAccessToken } from '@todoai/auth'
import { authMiddleware } from '../middleware/auth';

// Import auth controller functions
import { register, login, getProfile, updateProfile, logout } from '../controllers/auth.controller';

const router = Router();

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', login);

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: User registration
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Registration successful
 *       400:
 *         description: Invalid input
 */
router.post('/register', register);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: User logout
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post('/logout', logout);

/**
 * @swagger
 * /api/v1/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Access token refreshed
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Invalid refresh token
 */
router.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body as { refreshToken?: string }

    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'refreshToken is required' })
    }

    let decoded: { userId: string, iat: number, exp: number }
    try {
      decoded = verifyAccessToken(refreshToken) as any // reuse verify with same secret
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' })
    }

    // Validate token exists and not revoked / expired
    const [stored] = await db.select().from(refreshTokens).where(eq(refreshTokens.token, refreshToken))
    if (!stored || stored.isRevoked || new Date(stored.expiresAt) < new Date()) {
      return res.status(401).json({ success: false, message: 'Refresh token invalid or expired' })
    }

    const [user] = await db.select().from(users).where(eq(users.id, decoded.userId))
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    // Revoke old token
    await db.update(refreshTokens).set({ isRevoked: true }).where(eq(refreshTokens.token, refreshToken))

    const newAccessToken = signAccessToken({ userId: user.id, email: user.email })
    const newRefreshToken = signRefreshToken(user.id)

    // Store new refresh token
    await db.insert(refreshTokens).values({
      userId: user.id,
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    })

    return res.json({
      success: true,
      data: {
        tokens: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          expiresIn: 24 * 60 * 60,
        },
      },
    })
  } catch (error: unknown) {
    return next(error as Error)
  }
})

// Profile routes (protected)
/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/me', authMiddleware, getProfile);

/**
 * @swagger
 * /api/v1/auth/profile:
 *   patch:
 *     summary: Update user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               avatar:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 */
router.patch('/profile', authMiddleware, updateProfile);

export default router; 