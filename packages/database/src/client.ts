import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import { sql } from 'drizzle-orm';
import * as schema from './schema';

// Create connection pool
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Create Drizzle client with schema
export const db = drizzle(pool, { schema });

// Export the client for backward compatibility
export const client = db;

// Export types for use in applications
export type Database = typeof db;

// Helper function to test database connection
export async function testConnection(): Promise<boolean> {
  try {
    await db.execute(sql`SELECT 1`);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Helper function to close database connection
export async function closeConnection(): Promise<void> {
  try {
    await pool.end();
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
} 