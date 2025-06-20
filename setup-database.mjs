#!/usr/bin/env node

import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import { sql } from 'drizzle-orm';
import { writeFileSync } from 'fs';

// Get database URL from environment or use default
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/todoai';

console.log('🗄️  Setting up TodoAI Database...\n');
console.log('Database URL:', DATABASE_URL.replace(/:[^:@]*@/, ':****@')); // Hide password

try {
  // Create connection
  const pool = new Pool({ 
    connectionString: DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });
  
  const db = drizzle(pool);

  // Test connection
  console.log('🔗 Testing database connection...');
  await db.execute(sql`SELECT 1`);
  console.log('✅ Database connection successful');

  // Create tables (in order of dependencies)
  console.log('\n📋 Creating tables...');

  // 1. Users table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      first_name VARCHAR(100),
      last_name VARCHAR(100),
      avatar TEXT,
      is_email_verified BOOLEAN DEFAULT FALSE,
      email_verification_token TEXT,
      password_reset_token TEXT,
      password_reset_expires TIMESTAMP,
      last_login_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `);
  console.log('✅ Users table created');

  // 2. User settings table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS user_settings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      timezone VARCHAR(100) DEFAULT 'UTC',
      date_format VARCHAR(20) DEFAULT 'MM/DD/YYYY',
      time_format VARCHAR(10) DEFAULT '12h',
      week_starts_on INTEGER DEFAULT 0,
      theme VARCHAR(20) DEFAULT 'light',
      notifications JSONB,
      ai_preferences JSONB,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `);
  console.log('✅ User settings table created');

  // 3. Goals table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS goals (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      category VARCHAR(100),
      priority VARCHAR(20) DEFAULT 'medium',
      status VARCHAR(20) DEFAULT 'active',
      target_date TIMESTAMP,
      completed_at TIMESTAMP,
      progress INTEGER DEFAULT 0,
      ai_suggestions JSONB,
      tags JSONB,
      is_archived BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `);
  console.log('✅ Goals table created');

  // 4. Tasks table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS tasks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      goal_id UUID REFERENCES goals(id) ON DELETE SET NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      priority VARCHAR(20) DEFAULT 'medium',
      status VARCHAR(20) DEFAULT 'pending',
      due_date TIMESTAMP,
      completed_at TIMESTAMP,
      estimated_minutes INTEGER,
      actual_minutes INTEGER,
      tags JSONB,
      dependencies JSONB,
      is_recurring BOOLEAN DEFAULT FALSE,
      recurring_pattern JSONB,
      parent_task_id UUID,
      "order" INTEGER DEFAULT 0,
      is_archived BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `);
  console.log('✅ Tasks table created');

  // 5. Task comments table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS task_comments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `);
  console.log('✅ Task comments table created');

  // 6. Time entries table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS time_entries (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
      goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
      description TEXT,
      start_time TIMESTAMP NOT NULL,
      end_time TIMESTAMP,
      duration INTEGER,
      is_manual BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `);
  console.log('✅ Time entries table created');

  // 7. AI interactions table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS ai_interactions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type VARCHAR(50) NOT NULL,
      input JSONB NOT NULL,
      output JSONB NOT NULL,
      metadata JSONB,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `);
  console.log('✅ AI interactions table created');

  // 8. Refresh tokens table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token TEXT UNIQUE NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      is_revoked BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `);
  console.log('✅ Refresh tokens table created');

  // Create indexes for better performance
  console.log('\n📇 Creating indexes...');
  await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_goals_status ON goals(status);`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_tasks_goal_id ON tasks(goal_id);`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);`);
  console.log('✅ Indexes created');

  // Create updated_at trigger function
  await db.execute(sql`
    CREATE OR REPLACE FUNCTION update_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  // Create triggers for updated_at
  console.log('\n⚡ Creating triggers...');
  const tables = ['users', 'user_settings', 'goals', 'tasks', 'task_comments', 'time_entries'];
  for (const table of tables) {
    await db.execute(sql.raw(`
      DROP TRIGGER IF EXISTS update_${table}_updated_at ON ${table};
      CREATE TRIGGER update_${table}_updated_at
        BEFORE UPDATE ON ${table}
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at();
    `));
  }
  console.log('✅ Triggers created');

  console.log('\n🎉 Database setup completed successfully!');
  console.log('\n📊 Database Summary:');
  
  // Get table count
  const result = await db.execute(sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
    ORDER BY table_name;
  `);
  
  console.log(`   Tables created: ${result.length}`);
  result.forEach(row => console.log(`   - ${row.table_name}`));

  await pool.end();

} catch (error) {
  console.error('❌ Database setup failed:', error.message);
  console.error('\n💡 Troubleshooting:');
  console.error('1. Check if your database is running and accessible');
  console.error('2. Verify DATABASE_URL is correct');
  console.error('3. Ensure the database user has CREATE privileges');
  console.error('4. For Neon: Make sure your connection string includes the correct parameters');
  
  process.exit(1);
} 