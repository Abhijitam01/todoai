import jwt from 'jsonwebtoken'
import type { AuthConfig, JWTPayload } from './types'

const defaultConfig: AuthConfig = {
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12'),
}

/**
 * Sign a new JWT access token.
 */
export function signAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp'>, config: Partial<AuthConfig> = {}): string {
  const cfg = { ...defaultConfig, ...config }
  return jwt.sign(payload, cfg.jwtSecret as string, { expiresIn: cfg.jwtExpiresIn as string } as any)
}

/**
 * Verify a JWT access token and return the payload.
 * Throws jsonwebtoken errors when invalid/expired.
 */
export function verifyAccessToken<T extends JWTPayload = JWTPayload>(token: string, config: Partial<AuthConfig> = {}): T {
  const cfg = { ...defaultConfig, ...config }
  return jwt.verify(token, cfg.jwtSecret) as T
}

/**
 * Sign a refresh token.  Keep payload slim: just the user id.
 */
export function signRefreshToken(userId: string, config: Partial<AuthConfig> = {}): string {
  const cfg = { ...defaultConfig, ...config }
  return jwt.sign({ userId } as Partial<JWTPayload>, cfg.jwtSecret as string, { expiresIn: cfg.refreshTokenExpiresIn as string } as any)
} 