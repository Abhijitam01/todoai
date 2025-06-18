import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import { db, users, refreshTokens } from '@todoai/database'
import { eq } from 'drizzle-orm'
import { signAccessToken, signRefreshToken, hashPassword, verifyPassword, authService, verifyAccessToken } from '@todoai/auth'

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
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body

    if (!authService.isValidEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' })
    }

    // Fetch user from DB
    const [user] = await db.select().from(users).where(eq(users.email, email))

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    const passwordMatches = await verifyPassword(password, user.password)

    if (!passwordMatches) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    const accessToken = signAccessToken({ userId: user.id, email: user.email })
    const refreshToken = signRefreshToken(user.id)

    // Persist refresh token (30 days expiry)
    const expiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    await db.insert(refreshTokens).values({
      userId: user.id,
      token: refreshToken,
      expiresAt: expiry,
    })

    // Update last login timestamp
    await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, user.id))

    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName },
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: 24 * 60 * 60, // 24h in seconds
        },
      },
    })
  } catch (error: unknown) {
    return next(error as Error)
  }
});

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
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name: fullName } = req.body

    if (!authService.isValidEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' })
    }

    const passValidation = authService.isValidPassword(password)
    if (!passValidation.valid) {
      return res.status(400).json({ success: false, message: passValidation.message })
    }

    // Check duplicate
    const existing = await db.select().from(users).where(eq(users.email, email))
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Email already registered' })
    }

    const hashed = await hashPassword(password)

    const [newUser] = await db.insert(users).values({
      email,
      password: hashed,
      firstName: fullName,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning()

    if (!newUser) {
      throw new Error('User creation failed')
    }

    const createdUser = newUser!

    const accessToken = signAccessToken({ userId: createdUser.id, email: createdUser.email })
    const refreshToken = signRefreshToken(createdUser.id)

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: { id: createdUser.id, email: createdUser.email, firstName: createdUser.firstName },
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: 24 * 60 * 60,
        },
      },
    })
  } catch (error: unknown) {
    return next(error as Error)
  }
});

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
router.post('/logout', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body as { refreshToken?: string }
    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'refreshToken is required' })
    }

    // Revoke token in DB
    await db.update(refreshTokens).set({ isRevoked: true }).where(eq(refreshTokens.token, refreshToken))

    return res.json({ success: true, message: 'Logout successful' })
  } catch (error: unknown) {
    return next(error as Error)
  }
});

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

export default router; 