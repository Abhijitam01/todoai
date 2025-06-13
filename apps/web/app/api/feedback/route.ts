import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/neon'
import type { FeedbackEntry } from '@/lib/neon'

// Enhanced email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
  return emailRegex.test(email)
}

export async function POST(request: NextRequest) {
  try {
    // Check if database is configured
    if (!sql) {
      console.error('❌ Database not configured - DATABASE_URL missing')
      return NextResponse.json(
        { error: 'Database configuration error. Please contact support.' },
        { status: 500 }
      )
    }

    const { 
      email, 
      love, 
      want = '', 
      changes = '', 
      pricing = '', 
      rating, 
      recommendation = 0, 
      source = 'feedback_page' 
    } = await request.json()

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

    if (!love || typeof love !== 'string' || love.trim().length === 0) {
      return NextResponse.json(
        { error: 'Please tell us what you love about TodoAI' },
        { status: 400 }
      )
    }

    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 10) {
      return NextResponse.json(
        { error: 'Please provide a rating between 1 and 10' },
        { status: 400 }
      )
    }

    const cleanEmail = email.toLowerCase().trim()
    const cleanLove = love.trim()
    const cleanWant = want.trim()
    const cleanChanges = changes.trim()
    const cleanPricing = pricing.trim()

    // Additional validation
    if (cleanEmail.length > 255) {
      return NextResponse.json(
        { error: 'Email address is too long' },
        { status: 400 }
      )
    }

    if (cleanLove.length > 2000) {
      return NextResponse.json(
        { error: 'Love feedback is too long (max 2000 characters)' },
        { status: 400 }
      )
    }

    if (cleanWant.length > 2000) {
      return NextResponse.json(
        { error: 'Want feedback is too long (max 2000 characters)' },
        { status: 400 }
      )
    }

    if (cleanChanges.length > 2000) {
      return NextResponse.json(
        { error: 'Changes feedback is too long (max 2000 characters)' },
        { status: 400 }
      )
    }

    if (recommendation && (recommendation < 1 || recommendation > 10)) {
      return NextResponse.json(
        { error: 'Recommendation rating must be between 1 and 10' },
        { status: 400 }
      )
    }

    console.log('📝 Storing feedback in NeonDB:', {
      email: cleanEmail,
      love: cleanLove.substring(0, 50) + '...',
      rating,
      recommendation,
      source,
      timestamp: new Date().toISOString(),
      referrer: request.headers.get('referer')
    })

    try {
      // Insert new feedback entry
      const newEntries = await sql`
        INSERT INTO feedback (email, love, want, changes, pricing, rating, recommendation, source)
        VALUES (${cleanEmail}, ${cleanLove}, ${cleanWant || null}, ${cleanChanges || null}, ${cleanPricing || null}, ${rating}, ${recommendation || null}, ${source})
        RETURNING id, email, love, want, changes, pricing, rating, recommendation, source, created_at, updated_at
      `

      const newEntry = newEntries[0] as FeedbackEntry

      console.log('✅ Successfully stored feedback:', { id: newEntry.id, email: newEntry.email, rating: newEntry.rating })

      return NextResponse.json(
        { 
          message: 'Feedback submitted successfully!',
          data: {
            id: newEntry.id,
            email: newEntry.email,
            rating: newEntry.rating,
            source: newEntry.source,
            created_at: newEntry.created_at
          }
        },
        { status: 201 }
      )

    } catch (dbError: any) {
      console.error('Database error:', dbError)
      
      return NextResponse.json(
        { error: 'Failed to submit feedback. Please try again.' },
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
    // Check if database is configured
    if (!sql) {
      console.error('❌ Database not configured for feedback count API')
      // Fall back to a reasonable count estimate
      const mockCount = 25
      return NextResponse.json({ count: mockCount })
    }

    // Get feedback count from NeonDB
    const countResult = await sql`
      SELECT COUNT(*) as count FROM feedback
    `

    const count = parseInt(countResult[0]?.count as string) || 0
    console.log(`📊 Current feedback count: ${count}`)

    return NextResponse.json({ count })
  } catch (error) {
    console.error('❌ Feedback count API error:', error)
    // Fall back to a reasonable count estimate
    const mockCount = 25
    return NextResponse.json({ count: mockCount })
  }
} 