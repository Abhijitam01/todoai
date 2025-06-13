// Auth types
export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  avatar?: string
  isEmailVerified: boolean
  lastLoginAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface JWTPayload {
  userId: string
  email: string
  iat: number
  exp: number
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  firstName?: string
  lastName?: string
}

export interface AuthResponse {
  success: boolean
  user?: User
  tokens?: AuthTokens
  message?: string
}

export interface AuthRequest extends Request {
  user?: User
}

export interface AuthConfig {
  jwtSecret: string
  jwtExpiresIn: string
  refreshTokenExpiresIn: string
  bcryptRounds: number
} 