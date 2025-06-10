import { neon } from '@neondatabase/serverless'

// Handle build-time vs runtime environment variable access
const getDatabaseUrl = () => {
  const databaseUrl = process.env.DATABASE_URL
  
  // During build time, we might not have DATABASE_URL available
  // This is okay because the code won't be executed during build
  if (!databaseUrl && process.env.NODE_ENV !== 'production') {
    console.warn('DATABASE_URL is not set in development environment')
    return null
  }
  
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set')
  }
  
  return databaseUrl
}

// Only create the SQL client if we have a database URL
const databaseUrl = getDatabaseUrl()
export const sql = databaseUrl ? neon(databaseUrl) : null

export type WaitlistEntry = {
  id: number
  email: string
  source: string
  referrer: string | null
  created_at: string
  updated_at: string
} 