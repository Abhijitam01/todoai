#!/usr/bin/env node

const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

async function setupTables() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    
    // Check existing tables
    const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    const tableNames = tables.map(t => t.table_name);
    
    console.log('📋 Current tables:', tableNames);
    
    const hasWaitlist = tableNames.includes('waitlist');
    const hasFeedback = tableNames.includes('feedback');
    
    if (!hasWaitlist) {
      console.log('📝 Creating waitlist table...');
      await sql`
        CREATE TABLE waitlist (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          source VARCHAR(100) DEFAULT 'landing_page',
          referrer TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `;
      console.log('✅ Waitlist table created');
    } else {
      console.log('✅ Waitlist table already exists');
    }
    
    if (!hasFeedback) {
      console.log('📝 Creating feedback table...');
      await sql`
        CREATE TABLE feedback (
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
      `;
      console.log('✅ Feedback table created');
    } else {
      console.log('✅ Feedback table already exists');
    }
    
    console.log('🎉 Database setup complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

setupTables(); 