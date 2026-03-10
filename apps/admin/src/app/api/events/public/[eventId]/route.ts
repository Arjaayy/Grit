import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders })
}

export async function GET(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')
    
    // Update CORS headers to allow specific origin
    const responseHeaders = {
      ...corsHeaders,
      'Access-Control-Allow-Origin': origin || '*',
    }

    // Await params to get the eventId
    const { eventId } = await params

    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400, headers: responseHeaders }
      )
    }

    // TODO: Implement actual event retrieval logic
    // 1. Find event by ID
    // 2. Verify event is public or belongs to requesting organization
    // 3. Return full event details
    
    // Mock response for now
    const mockEvent = {
      id: eventId,
      name: 'Basketball Tournament',
      description: 'Annual basketball tournament for high school teams in the Tuguegarao region. This tournament brings together teams from various schools to compete in a friendly yet competitive environment.',
      date: '2026-04-15T09:00:00.000Z',
      end_date: '2026-04-17T18:00:00.000Z',
      location: 'Tuguegarao Sports Complex',
      address: 'Sports Complex, Tuguegarao City, Cagayan',
      max_participants: 100,
      current_participants: 45,
      registration_status: 'open',
      registration_deadline: '2026-04-10T23:59:59.000Z',
      entry_fee: 500,
      prize_pool: 10000,
      requirements: [
        'High school students (15-18 years old)',
        'School ID required',
        'Parental consent for minors',
        'Complete registration form'
      ],
      schedule: [
        {
          date: '2026-04-15',
          time: '09:00',
          activity: 'Registration & Team Briefing'
        },
        {
          date: '2026-04-15',
          time: '10:00',
          activity: 'Opening Ceremony'
        },
        {
          date: '2026-04-15',
          time: '11:00',
          activity: 'First Round Games'
        }
      ],
      contact: {
        organizer: 'Tuguegarao League',
        email: 'info@tuguegaraoleague.gritdp.com',
        phone: '0912-345-6789'
      },
      organization: {
        id: 'org_123',
        name: 'Tuguegarao League',
        slug: 'tuguegaraoleague',
        domain: 'tuguegaraoleague.gritdp.com'
      },
      created_at: '2026-03-01T10:00:00.000Z',
      updated_at: '2026-03-10T15:30:00.000Z'
    }

    return NextResponse.json({
      success: true,
      data: mockEvent
    }, { headers: responseHeaders })

  } catch (error) {
    console.error('Public Event Details API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
}
