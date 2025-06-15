import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db, users, type User } from '@todoai/database';

// Types
export interface TokenPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

// Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-legendary-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';
const SALT_ROUNDS = 12;

export class AuthService {
  // Hash password
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  // Verify password
  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // Generate JWT tokens
  static generateTokens(payload: TokenPayload): { accessToken: string; refreshToken: string } {
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
    
    return { accessToken, refreshToken };
  }

  // Verify JWT token
  static verifyToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  // Register new user
  static async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, data.email))
        .limit(1);

      if (existingUser.length > 0) {
        throw new Error('User already exists with this email');
      }

      // Hash password
      const hashedPassword = await this.hashPassword(data.password);

      // Create user
      const [newUser] = await db
        .insert(users)
        .values({
          email: data.email,
          password: hashedPassword,
          name: data.name,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      // Generate tokens
      const tokenPayload: TokenPayload = {
        userId: newUser.id,
        email: newUser.email,
      };

      const tokens = this.generateTokens(tokenPayload);

      // Remove password from user object
      const { password, ...userWithoutPassword } = newUser;

      return {
        user: userWithoutPassword,
        ...tokens,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Registration failed');
    }
  }

  // Login user
  static async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      // Find user by email
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, data.email))
        .limit(1);

      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Verify password
      const isValidPassword = await this.verifyPassword(data.password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid email or password');
      }

      // Generate tokens
      const tokenPayload: TokenPayload = {
        userId: user.id,
        email: user.email,
      };

      const tokens = this.generateTokens(tokenPayload);

      // Remove password from user object
      const { password, ...userWithoutPassword } = user;

      return {
        user: userWithoutPassword,
        ...tokens,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Login failed');
    }
  }

  // Get user by ID
  static async getUserById(userId: string): Promise<Omit<User, 'password'> | null> {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!user) {
        return null;
      }

      // Remove password from user object
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw new Error('Failed to fetch user');
    }
  }

  // Refresh token
  static async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = this.verifyToken(refreshToken);
      
      // Verify user still exists
      const user = await this.getUserById(payload.userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Generate new tokens
      const newTokens = this.generateTokens({
        userId: payload.userId,
        email: payload.email,
      });

      return newTokens;
    } catch (error) {
      throw new Error('Token refresh failed');
    }
  }

  // Logout (invalidate token - for future implementation with token blacklist)
  static async logout(token: string): Promise<void> {
    // For now, we'll just verify the token exists
    this.verifyToken(token);
    // In production, add token to blacklist or revoked tokens table
  }

  // Update user profile
  static async updateProfile(
    userId: string, 
    data: Partial<Pick<User, 'name' | 'email'>>
  ): Promise<Omit<User, 'password'>> {
    try {
      // If email is being updated, check it's not taken
      if (data.email) {
        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.email, data.email))
          .limit(1);

        if (existingUser.length > 0 && existingUser[0].id !== userId) {
          throw new Error('Email already taken');
        }
      }

      const [updatedUser] = await db
        .update(users)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId))
        .returning();

      if (!updatedUser) {
        throw new Error('User not found');
      }

      // Remove password from user object
      const { password, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Profile update failed');
    }
  }

  // Change password
  static async changePassword(
    userId: string, 
    currentPassword: string, 
    newPassword: string
  ): Promise<void> {
    try {
      // Get current user
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isValidPassword = await this.verifyPassword(currentPassword, user.password);
      if (!isValidPassword) {
        throw new Error('Current password is incorrect');
      }

      // Hash new password
      const hashedNewPassword = await this.hashPassword(newPassword);

      // Update password
      await db
        .update(users)
        .set({
          password: hashedNewPassword,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Password change failed');
    }
  }
} 