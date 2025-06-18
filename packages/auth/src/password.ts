import bcrypt from 'bcryptjs'
import type { AuthConfig } from './types'

const defaultConfig: AuthConfig = {
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12'),
}

export async function hashPassword(password: string, config: Partial<AuthConfig> = {}): Promise<string> {
  const cfg = { ...defaultConfig, ...config }
  return bcrypt.hash(password, cfg.bcryptRounds)
}

export async function verifyPassword(password: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(password, hashed)
} 