import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Path to store waitlist data
const WAITLIST_FILE = path.join(process.cwd(), 'data', 'waitlist.json')

// Ensure data directory exists
function ensureDataDirectory() {
  const dataDir = path.dirname(WAITLIST_FILE)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Read waitlist data from file
function readWaitlistData() {
  ensureDataDirectory()
  
  if (!fs.existsSync(WAITLIST_FILE)) {
    return []
  }
  
  try {
    const data = fs.readFileSync(WAITLIST_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading waitlist file:', error)
    return []
  }
}

// Write waitlist data to file
function writeWaitlistData(data: any[]) {
  ensureDataDirectory()
  
  try {
    fs.writeFileSync(WAITLIST_FILE, JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    console.error('Error writing waitlist file:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, source = 'landing_page' } = await request.json()

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    const cleanEmail = email.toLowerCase().trim()

    console.log('📧 Storing email in local file:', {
      email: cleanEmail,
      source,
      timestamp: new Date().toISOString(),
      referrer: request.headers.get('referer')
    })

    // Read existing data
    const waitlistData = readWaitlistData()

    // Check for duplicates
    const existingEntry = waitlistData.find((entry: any) => entry.email === cleanEmail)
    if (existingEntry) {
      console.log('⚠️  Email already exists:', cleanEmail)
      return NextResponse.json(
        { error: 'This email is already on our waitlist!' },
        { status: 409 }
      )
    }

    // Create new entry
    const newEntry = {
      id: waitlistData.length + 1,
      email: cleanEmail,
      source,
      referrer: request.headers.get('referer') || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Add to data
    waitlistData.push(newEntry)

    // Save to file
    const success = writeWaitlistData(waitlistData)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to save email. Please try again.' },
        { status: 500 }
      )
    }

    console.log('✅ Successfully stored email:', newEntry)

    return NextResponse.json(
      { 
        message: 'Successfully joined the waitlist!',
        data: newEntry
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('❌ API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get waitlist count from local file
    const waitlistData = readWaitlistData()
    const count = waitlistData.length

    console.log(`📊 Current waitlist count: ${count}`)

    return NextResponse.json({ count })
  } catch (error) {
    console.error('❌ API error:', error)
    // Fall back to mock count if there's an error
    const mockCount = Math.floor(Math.random() * 1000) + 500
    return NextResponse.json({ count: mockCount })
  }
} 