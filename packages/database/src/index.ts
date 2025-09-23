import { drizzle } from 'drizzle-orm/better-sqlite3';
import { sql } from 'drizzle-orm';
import Database from 'better-sqlite3';
import * as schema from './schema';

// Database configuration
const databaseUrl = process.env.DATABASE_URL || 'file:./dev.db';

// Create SQLite client
const client = new Database(databaseUrl.replace('file:', ''));

// Create drizzle instance
export const db = drizzle(client, { schema });

// Export all schema types and tables
export * from './schema';
export { schema };

// Database utilities
export const dbUtils = {
  // Health check
  async healthCheck() {
    try {
      client.prepare('SELECT 1').get();
      return { status: 'healthy', timestamp: new Date().toISOString() };
    } catch (error) {
      return { 
        status: 'unhealthy', 
        error: error instanceof Error ? error.message : String(error), 
        timestamp: new Date().toISOString() 
      };
    }
  },

  // Close connection
  async close() {
    client.close();
  },

  // Transaction wrapper
  async transaction<T>(callback: (tx: typeof db) => Promise<T>): Promise<T> {
    return db.transaction(callback);
  },
};

// Client is available internally but not exported due to type issues

// Re-export drizzle utilities
export { eq, and, or, desc, asc } from 'drizzle-orm' 