#!/usr/bin/env node

/**
 * Migration script to transfer waitlist data from JSON file to NeonDB database
 * 
 * Usage:
 * 1. Make sure you have .env.local with your DATABASE_URL
 * 2. Run: node scripts/migrate-waitlist.js
 */

const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '.env.local' })

// Import NeonDB client
const { neon } = require('@neondatabase/serverless')

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  console.error('❌ Missing DATABASE_URL environment variable!')
  console.error('Please set DATABASE_URL in .env.local')
  console.error('Example: DATABASE_URL=postgresql://username:password@hostname/database')
  process.exit(1)
}

const sql = neon(databaseUrl)

async function migrateWaitlist() {
  try {
    console.log('🚀 Starting waitlist migration to NeonDB...')

    // Read existing JSON data
    const dataFile = path.join(process.cwd(), 'data', 'waitlist.json')
    
    if (!fs.existsSync(dataFile)) {
      console.log('📝 No existing waitlist.json found. Nothing to migrate.')
      return
    }

    const jsonData = fs.readFileSync(dataFile, 'utf-8')
    const waitlistData = JSON.parse(jsonData)

    if (!Array.isArray(waitlistData) || waitlistData.length === 0) {
      console.log('📝 No data found in waitlist.json. Nothing to migrate.')
      return
    }

    console.log(`📊 Found ${waitlistData.length} entries to migrate`)

    // Check if table exists
    try {
      await sql`SELECT 1 FROM waitlist LIMIT 1`
    } catch (error) {
      console.error('❌ waitlist table does not exist!')
      console.error('Please run the SQL from database/setup.sql first.')
      return
    }

    let successCount = 0
    let skipCount = 0

    // Insert each entry individually to handle duplicates gracefully
    for (const entry of waitlistData) {
      try {
        await sql`
          INSERT INTO waitlist (email, source, referrer, created_at, updated_at)
          VALUES (
            ${entry.email},
            ${entry.source || 'landing_page'},
            ${entry.referrer || null},
            ${entry.created_at},
            ${entry.updated_at}
          )
        `
        successCount++
        console.log(`✅ Migrated: ${entry.email}`)
      } catch (error) {
        if (error.code === '23505' || error.message?.includes('duplicate key')) {
          console.log(`⚠️  Skipped duplicate: ${entry.email}`)
          skipCount++
        } else {
          console.error(`❌ Failed to migrate ${entry.email}:`, error.message)
        }
      }
    }

    console.log(`\n🎉 Migration completed!`)
    console.log(`✅ Successfully migrated: ${successCount} entries`)
    if (skipCount > 0) {
      console.log(`⚠️  Skipped duplicates: ${skipCount} entries`)
    }

    // Create backup of the original file
    const backupFile = path.join(process.cwd(), 'data', `waitlist-backup-${Date.now()}.json`)
    fs.copyFileSync(dataFile, backupFile)
    console.log(`💾 Created backup: ${backupFile}`)

    // Verify final count
    const countResult = await sql`SELECT COUNT(*) as count FROM waitlist`
    const totalCount = parseInt(countResult[0]?.count) || 0
    console.log(`📊 Total entries in database: ${totalCount}`)

  } catch (error) {
    console.error('❌ Migration error:', error)
    process.exit(1)
  }
}

// Run migration
migrateWaitlist() 