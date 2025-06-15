#!/usr/bin/env node

/**
 * Script to automatically create waitlist and feedback tables in the database
 * 
 * Usage:
 * 1. Make sure you have DATABASE_URL in your environment
 * 2. Run: node scripts/create-tables.js
 */

const path = require('path')
require('dotenv').config({ path: '.env.local' })

// Try to import from the existing neon setup
let sql;
try {
  // Try different import paths for the neon client
  const { neon } = require('@neondatabase/serverless')
  
  const databaseUrl = process.env.DATABASE_URL
  
  if (!databaseUrl) {
    console.error('❌ Missing DATABASE_URL environment variable!')
    console.error('Please set DATABASE_URL in one of these files:')
    console.error('- .env.local (for local development)')
    console.error('- .env (for production)')
    console.error('Example: DATABASE_URL=postgresql://username:password@hostname/database')
    process.exit(1)
  }
  
  sql = neon(databaseUrl)
  console.log('✅ Database connection established')
} catch (error) {
  console.error('❌ Failed to import database client:', error.message)
  console.error('Make sure you have @neondatabase/serverless installed')
  process.exit(1)
}

async function createTables() {
  try {
    console.log('🚀 Creating waitlist and feedback tables...')

    // Create waitlist table
    console.log('📝 Creating waitlist table...')
    await sql`
      CREATE TABLE IF NOT EXISTS waitlist (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        source VARCHAR(100) DEFAULT 'landing_page',
        referrer TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    // Create feedback table
    console.log('📝 Creating feedback table...')
    await sql`
      CREATE TABLE IF NOT EXISTS feedback (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        love TEXT NOT NULL,
        want TEXT,
        changes TEXT,
        pricing VARCHAR(50),
        rating INTEGER CHECK (rating >= 1 AND rating <= 10),
        recommendation INTEGER CHECK (recommendation >= 1 AND recommendation <= 10),
        source VARCHAR(100) DEFAULT 'feedback_page',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    // Create indexes
    console.log('📊 Creating indexes...')
    await sql`CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email)`
    await sql`CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at)`
    await sql`CREATE INDEX IF NOT EXISTS idx_waitlist_source ON waitlist(source)`
    await sql`CREATE INDEX IF NOT EXISTS idx_feedback_email ON feedback(email)`
    await sql`CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at)`
    await sql`CREATE INDEX IF NOT EXISTS idx_feedback_rating ON feedback(rating)`
    await sql`CREATE INDEX IF NOT EXISTS idx_feedback_source ON feedback(source)`

    // Add email validation constraints
    console.log('🔒 Adding email validation constraints...')
    try {
      await sql`
        ALTER TABLE waitlist 
        ADD CONSTRAINT IF NOT EXISTS valid_email 
        CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$')
      `
      await sql`
        ALTER TABLE feedback 
        ADD CONSTRAINT IF NOT EXISTS valid_feedback_email 
        CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$')
      `
    } catch (constraintError) {
      // Constraints might already exist, this is OK
      console.log('⚠️  Email constraints already exist (this is fine)')
    }

    // Create update function
    console.log('⚙️  Creating update triggers...')
    await sql`
      CREATE OR REPLACE FUNCTION update_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql
    `

    // Create triggers
    await sql`DROP TRIGGER IF EXISTS update_waitlist_updated_at ON waitlist`
    await sql`
      CREATE TRIGGER update_waitlist_updated_at
        BEFORE UPDATE ON waitlist
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at()
    `

    await sql`DROP TRIGGER IF EXISTS update_feedback_updated_at ON feedback`
    await sql`
      CREATE TRIGGER update_feedback_updated_at
        BEFORE UPDATE ON feedback
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at()
    `

    // Verify tables were created
    console.log('🔍 Verifying tables...')
    
    const waitlistCheck = await sql`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'waitlist' 
      ORDER BY ordinal_position
    `
    
    const feedbackCheck = await sql`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'feedback' 
      ORDER BY ordinal_position
    `

    if (waitlistCheck.length === 0) {
      throw new Error('Waitlist table was not created successfully')
    }

    if (feedbackCheck.length === 0) {
      throw new Error('Feedback table was not created successfully')
    }

    console.log('\n🎉 Success! Tables created successfully:')
    console.log(`✅ waitlist table: ${waitlistCheck.length} columns`)
    console.log(`✅ feedback table: ${feedbackCheck.length} columns`)
    
    // Show table structure
    console.log('\n📋 Waitlist table structure:')
    waitlistCheck.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type}`)
    })
    
    console.log('\n📋 Feedback table structure:')
    feedbackCheck.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type}`)
    })

    console.log('\n🚀 Your database is now ready!')
    console.log('📝 You can now test your waitlist and feedback forms')
    
  } catch (error) {
    console.error('❌ Error creating tables:', error)
    console.error('Full error details:', error.message)
    process.exit(1)
  }
}

// Run the function
createTables()
  .then(() => {
    console.log('\n✨ Script completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  }) 