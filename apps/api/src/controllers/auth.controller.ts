import { Request, Response, NextFunction } from 'express';
import { db, users, refreshTokens, goals } from '@todoai/database';
import { eq, and, gt, count } from 'drizzle-orm';
import { signAccessToken, signRefreshToken, hashPassword, verifyPassword, authService } from '@todoai/auth';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';

// Enhanced validation schemas
const RegisterSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
});

const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

const UpdateProfileSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
});

// Rate limiting for auth endpoints
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many authentication attempts. Please try again later.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// REGISTER: Create new user account
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // Enhanced validation using Zod
    const validationResult = RegisterSchema.safeParse(req.body);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message
      }));
      
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: errors
        }
      });
      return;
    }

    const { email, password, firstName, lastName } = validationResult.data;

    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length > 0) {
      res.status(409).json({
        success: false,
        error: {
          code: 'EMAIL_ALREADY_EXISTS',
          message: 'Email already registered',
          field: 'email'
        }
      });
      return;
    }

    // Hash password with additional security
    const hashedPassword = await hashPassword(password);

    // Create user with enhanced data
    const [newUser] = await db.insert(users).values({
      email: email.toLowerCase().trim(), // Normalize email
      password: hashedPassword,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      isEmailVerified: false, // Will need email verification
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    if (!newUser) {
      res.status(500).json({
        success: false,
        error: {
          code: 'USER_CREATION_FAILED',
          message: 'Failed to create user account'
        }
      });
      return;
    }

    // Generate tokens with enhanced payload
    const accessToken = signAccessToken({
      userId: newUser.id,
      email: newUser.email,
      isVerified: newUser.isEmailVerified
    });
    
    const refreshToken = signRefreshToken(newUser.id);

    // Store refresh token with enhanced security
    const expiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    await db.insert(refreshTokens).values({
      userId: newUser.id,
      token: refreshToken,
      expiresAt: expiry,
      isRevoked: false,
      createdAt: new Date()
    });

    // TODO: Send email verification (implement in next iteration)
    // await sendEmailVerification(newUser.email, newUser.id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          isEmailVerified: newUser.isEmailVerified,
          createdAt: newUser.createdAt
        },
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: 24 * 60 * 60, // 24 hours in seconds
          refreshExpiresIn: 30 * 24 * 60 * 60 // 30 days in seconds
        },
        requiresEmailVerification: !newUser.isEmailVerified
      },
    });
  } catch (error: any) {
    console.error('Register error:', error);
    
    // Handle specific database errors
    if (error.code === '23505') { // Unique constraint violation
      res.status(409).json({
        success: false,
        error: {
          code: 'EMAIL_ALREADY_EXISTS',
          message: 'Email already registered'
        }
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred during registration'
      }
    });
  }
};

// LOGIN: Authenticate existing user
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // Enhanced validation using Zod
    const validationResult = LoginSchema.safeParse(req.body);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message
      }));
      
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: errors
        }
      });
      return;
    }

    const { email, password } = validationResult.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Find user by email
    const [user] = await db.select().from(users).where(eq(users.email, normalizedEmail));

    if (!user) {
      // Don't reveal if email exists or not for security
      res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      });
      return;
    }

    // Verify password
    const passwordMatches = await verifyPassword(password, user.password);

    if (!passwordMatches) {
      res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      });
      return;
    }

    // Check if user account is active (not banned/suspended)
    // TODO: Add account status checks in future iterations

    // Generate tokens with enhanced payload
    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      isVerified: user.isEmailVerified
    });
    
    const refreshToken = signRefreshToken(user.id);

    // Store refresh token with enhanced security
    const expiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    await db.insert(refreshTokens).values({
      userId: user.id,
      token: refreshToken,
      expiresAt: expiry,
      isRevoked: false,
      createdAt: new Date()
    });

    // Update last login and login count
    const now = new Date();
    await db.update(users)
      .set({ 
        lastLoginAt: now,
        updatedAt: now
        // TODO: Add loginCount increment
      })
      .where(eq(users.id, user.id));

    // TODO: Log successful login for security monitoring
    // await logSecurityEvent(user.id, 'LOGIN_SUCCESS', { ip: req.ip, userAgent: req.get('User-Agent') });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isEmailVerified: user.isEmailVerified,
          lastLoginAt: now,
          createdAt: user.createdAt
        },
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: 24 * 60 * 60, // 24 hours in seconds
          refreshExpiresIn: 30 * 24 * 60 * 60 // 30 days in seconds
        },
        requiresEmailVerification: !user.isEmailVerified
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    
    // TODO: Log failed login attempts for security monitoring
    // await logSecurityEvent(null, 'LOGIN_ERROR', { email, ip: req.ip, error: error.message });

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred during login'
      }
    });
  }
};

// GET PROFILE: Get current user information
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'User not authenticated'
        }
      });
      return;
    }

    const [user] = await db.select().from(users).where(eq(users.id, req.user.id));

    if (!user) {
      res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
      return;
    }

    // Get user statistics
    const [goalStats] = await db.select({
      totalGoals: count(),
      activeGoals: count(),
      completedGoals: count()
    }).from(goals).where(eq(goals.userId, user.id));

    res.json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        statistics: {
          totalGoals: goalStats.totalGoals,
          activeGoals: goalStats.activeGoals,
          completedGoals: goalStats.completedGoals
        }
      }
    });
  } catch (error: any) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred while retrieving profile'
      }
    });
  }
};

// UPDATE PROFILE: Update user information
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ 
        success: false, 
        error: 'User not authenticated' 
      });
      return;
    }

    const { firstName, lastName, avatar } = req.body;

    // Prepare update data
    const updateData: any = { updatedAt: new Date() };
    
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (avatar !== undefined) updateData.avatar = avatar;

    // Update user
    const [updatedUser] = await db.update(users)
      .set(updateData)
      .where(eq(users.id, req.user.id))
      .returning();

    if (!updatedUser) {
      res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
      return;
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        avatar: updatedUser.avatar,
        updatedAt: updatedUser.updatedAt
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
};

// REFRESH TOKEN: Get new access token using refresh token
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        success: false,
        error: {
          code: 'REFRESH_TOKEN_REQUIRED',
          message: 'Refresh token is required'
        }
      });
      return;
    }

    // Find and validate refresh token
    const [tokenRecord] = await db.select()
      .from(refreshTokens)
      .where(and(
        eq(refreshTokens.token, refreshToken),
        eq(refreshTokens.isRevoked, false),
        gt(refreshTokens.expiresAt, new Date())
      ));

    if (!tokenRecord) {
      res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_REFRESH_TOKEN',
          message: 'Invalid or expired refresh token'
        }
      });
      return;
    }

    // Get user information
    const [user] = await db.select().from(users).where(eq(users.id, tokenRecord.userId));

    if (!user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User associated with refresh token not found'
        }
      });
      return;
    }

    // Generate new access token
    const newAccessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      isVerified: user.isEmailVerified
    });

    // Optionally rotate refresh token for enhanced security
    const shouldRotate = Math.random() < 0.1; // 10% chance to rotate
    let newRefreshToken = refreshToken;

    if (shouldRotate) {
      newRefreshToken = signRefreshToken(user.id);
      
      // Revoke old token and create new one
      await db.transaction(async (tx: any) => {
        await tx.update(refreshTokens)
          .set({ isRevoked: true })
          .where(eq(refreshTokens.id, tokenRecord.id));

        await tx.insert(refreshTokens).values({
          userId: user.id,
          token: newRefreshToken,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          isRevoked: false,
          createdAt: new Date()
        });
      });
    }

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresIn: 24 * 60 * 60, // 24 hours in seconds
        tokenRotated: shouldRotate
      }
    });
  } catch (error: any) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred while refreshing token'
      }
    });
  }
};

// LOGOUT: Revoke refresh token
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        success: false,
        error: {
          code: 'REFRESH_TOKEN_REQUIRED',
          message: 'Refresh token is required'
        }
      });
      return;
    }

    // Revoke the refresh token
    const result = await db.update(refreshTokens)
      .set({ 
        isRevoked: true,
        updatedAt: new Date()
      })
      .where(eq(refreshTokens.token, refreshToken));

    // TODO: Log logout event for security monitoring
    // await logSecurityEvent(req.user?.id, 'LOGOUT', { ip: req.ip });

    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error: any) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred during logout'
      }
    });
  }
}; 