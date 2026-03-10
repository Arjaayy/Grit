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

export async function GET(request: NextRequest) {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')
    
    // Update CORS headers to allow specific origin
    const responseHeaders = {
      ...corsHeaders,
      'Access-Control-Allow-Origin': origin || '*',
    }

    const { searchParams } = new URL(request.url)
    const organization_slug = searchParams.get('organization_slug')
    const status = searchParams.get('status') || undefined

    if (!organization_slug) {
      return NextResponse.json(
        { error: 'organization_slug parameter is required' },
        { status: 400, headers: responseHeaders }
      )
    }

    // Validate organization_slug format
    const orgSlugRegex = /^[a-zA-Z0-9_-]+$/
    if (!orgSlugRegex.test(organization_slug)) {
      return NextResponse.json(
        { error: 'Invalid organization_slug format' },
        { status: 400, headers: responseHeaders }
      )
    }

    // TODO: Implement actual event retrieval logic
    // 1. Find organization by slug
    // 2. Get events for that organization
    // 3. Filter by status if provided
    // 4. Return public event information only
    
    // Mock response for now
    const mockEvents = [
      {
        id: 'evt_123',
        name: 'Basketball Tournament',
        description: 'Annual basketball tournament for high school teams',
        date: '2026-04-15T09:00:00.000Z',
        location: 'Tuguegarao Sports Complex',
        max_participants: 100,
        current_participants: 45,
        registration_status: 'open',
        registration_deadline: '2026-04-10T23:59:59.000Z',
        entry_fee: 500,
        organization: {
          id: 'org_123',
          name: 'Tuguegarao League',
          slug: organization_slug
        }
      },
      {
        id: 'evt_124',
        name: 'Volleyball Championship',
        description: 'Inter-school volleyball championship',
        date: '2026-05-20T08:00:00.000Z',
        location: 'Cagayan Sports Center',
        max_participants: 80,
        current_participants: 62,
        registration_status: 'open',
        registration_deadline: '2026-05-15T23:59:59.000Z',
        entry_fee: 300,
        organization: {
          id: 'org_123',
          name: 'Tuguegarao League',
          slug: organization_slug
        }
      }
    ]

    // Filter by status if provided
    let filteredEvents = mockEvents
    if (status) {
      filteredEvents = mockEvents.filter(event => event.registration_status === status)
    }

    return NextResponse.json({
      success: true,
      data: {
        events: filteredEvents,
        total: filteredEvents.length,
        organization: {
          slug: organization_slug,
          name: 'Tuguegarao League'
        }
      }
    }, { headers: responseHeaders })

  } catch (error) {
    console.error('Public Events API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
}
