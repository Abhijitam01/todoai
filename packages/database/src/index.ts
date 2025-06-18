import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Database configuration
const databaseUrl = process.env.DATABASE_URL || 'postgresql://localhost:5432/todoai';

// Create postgres client
const client = postgres(databaseUrl, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

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
      await client`SELECT 1`;
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
    await client.end();
  },

  // Transaction wrapper
  async transaction<T>(callback: (tx: typeof db) => Promise<T>): Promise<T> {
    return db.transaction(callback);
  },
};

// Export client for advanced use cases
export { client };

// Re-export drizzle utilities
export { eq, and, or, desc, asc } from 'drizzle-orm' 