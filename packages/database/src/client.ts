import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { sql } from 'drizzle-orm';
import * as schema from './schema';

// Create SQLite database connection
const sqlite = new Database(process.env.DATABASE_URL?.replace('file:', '') || './dev.db');

// Create Drizzle client with schema
export const db = drizzle(sqlite, { schema });

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
    sqlite.close();
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
} 