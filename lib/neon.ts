import { neon } from '@neondatabase/serverless'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set')
}

export const sql = neon(process.env.DATABASE_URL)

export type WaitlistEntry = {
  id: number
  email: string
  source: string
  referrer: string | null
  created_at: string
  updated_at: string
} 