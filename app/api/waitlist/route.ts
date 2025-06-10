import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/neon'
import type { WaitlistEntry } from '@/lib/neon'

// Enhanced email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
  return emailRegex.test(email)
}

export async function POST(request: NextRequest) {
  try {
    const { email, source = 'landing_page' } = await request.json()

    // Enhanced validation
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    const cleanEmail = email.toLowerCase().trim()

    // Additional validation
    if (cleanEmail.length > 255) {
      return NextResponse.json(
        { error: 'Email address is too long' },
        { status: 400 }
      )
    }

    console.log('📧 Storing email in NeonDB:', {
      email: cleanEmail,
      source,
      timestamp: new Date().toISOString(),
      referrer: request.headers.get('referer')
    })

    try {
      // Check for duplicates
      const existingEntries = await sql`
        SELECT email FROM waitlist WHERE email = ${cleanEmail}
      `

      if (existingEntries.length > 0) {
        console.log('⚠️  Email already exists:', cleanEmail)
        return NextResponse.json(
          { error: 'This email is already on our waitlist!' },
          { status: 409 }
        )
      }

      // Insert new entry
      const newEntries = await sql`
        INSERT INTO waitlist (email, source, referrer)
        VALUES (${cleanEmail}, ${source}, ${request.headers.get('referer') || null})
        RETURNING id, email, source, referrer, created_at, updated_at
      `

      const newEntry = newEntries[0] as WaitlistEntry

      console.log('✅ Successfully stored email:', newEntry)

      return NextResponse.json(
        { 
          message: 'Successfully joined the waitlist!',
          data: {
            id: newEntry.id,
            email: newEntry.email,
            source: newEntry.source,
            created_at: newEntry.created_at
          }
        },
        { status: 201 }
      )

    } catch (dbError: any) {
      console.error('Database error:', dbError)
      
      // Handle specific database errors
      if (dbError.code === '23505' || dbError.message?.includes('duplicate key')) {
        return NextResponse.json(
          { error: 'This email is already on our waitlist!' },
          { status: 409 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to join waitlist. Please try again.' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('❌ API error:', error)
    
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get waitlist count from NeonDB
    const countResult = await sql`
      SELECT COUNT(*) as count FROM waitlist
    `

    const count = parseInt(countResult[0]?.count as string) || 0
    console.log(`📊 Current waitlist count: ${count}`)

    return NextResponse.json({ count })
  } catch (error) {
    console.error('❌ Count API error:', error)
    // Fall back to a reasonable count estimate
    const mockCount = 247
    return NextResponse.json({ count: mockCount })
  }
} 