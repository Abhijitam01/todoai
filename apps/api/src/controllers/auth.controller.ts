import { Request, Response, NextFunction } from 'express';
import { db, users, refreshTokens } from '@todoai/database';
import { eq } from 'drizzle-orm';
import { signAccessToken, signRefreshToken, hashPassword, verifyPassword, authService } from '@todoai/auth';

// REGISTER: Create new user account
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Validate email format
    if (!authService.isValidEmail(email)) {
      res.status(400).json({ 
        success: false, 
        error: 'Invalid email format' 
      });
      return;
    }

    // Validate password strength
    const passValidation = authService.isValidPassword(password);
    if (!passValidation.valid) {
      res.status(400).json({ 
        success: false, 
        error: passValidation.message 
      });
      return;
    }

    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length > 0) {
      res.status(409).json({ 
        success: false, 
        error: 'Email already registered' 
      });
      return;
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const [newUser] = await db.insert(users).values({
      email,
      password: hashedPassword,
      firstName: firstName || '',
      lastName: lastName || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    if (!newUser) {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to create user' 
      });
      return;
    }

    // Generate tokens
    const accessToken = signAccessToken({ 
      userId: newUser.id, 
      email: newUser.email 
    });
    const refreshToken = signRefreshToken(newUser.id);

    // Store refresh token
    const expiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    await db.insert(refreshTokens).values({
      userId: newUser.id,
      token: refreshToken,
      expiresAt: expiry,
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          createdAt: newUser.createdAt
        },
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: 24 * 60 * 60, // 24 hours in seconds
        },
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
};

// LOGIN: Authenticate existing user
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ 
        success: false, 
        error: 'Email and password are required' 
      });
      return;
    }

    if (!authService.isValidEmail(email)) {
      res.status(400).json({ 
        success: false, 
        error: 'Invalid email format' 
      });
      return;
    }

    // Find user by email
    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
      res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
      return;
    }

    // Verify password
    const passwordMatches = await verifyPassword(password, user.password);

    if (!passwordMatches) {
      res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
      return;
    }

    // Generate tokens
    const accessToken = signAccessToken({ 
      userId: user.id, 
      email: user.email 
    });
    const refreshToken = signRefreshToken(user.id);

    // Store refresh token
    const expiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    await db.insert(refreshTokens).values({
      userId: user.id,
      token: refreshToken,
      expiresAt: expiry,
    });

    // Update last login
    await db.update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id));

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          lastLoginAt: new Date()
        },
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: 24 * 60 * 60, // 24 hours in seconds
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
};

// GET PROFILE: Get current user information
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ 
        success: false, 
        error: 'User not authenticated' 
      });
      return;
    }

    const [user] = await db.select().from(users).where(eq(users.id, req.user.id));

    if (!user) {
      res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
      return;
    }

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
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
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

// LOGOUT: Revoke refresh token
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ 
        success: false, 
        error: 'Refresh token is required' 
      });
      return;
    }

    // Revoke the refresh token
    await db.update(refreshTokens)
      .set({ isRevoked: true })
      .where(eq(refreshTokens.token, refreshToken));

    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}; 