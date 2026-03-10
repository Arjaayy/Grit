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
    const event_id = searchParams.get('event_id')
    const source = searchParams.get('source') // 'external', 'internal', 'all'

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

    // TODO: Implement actual participant retrieval logic
    // 1. Find organization by slug
    // 2. Get participants for that organization
    // 3. Filter by event_id if provided
    // 4. Filter by source if provided
    // 5. Return participant information with source tracking
    
    // Mock response for now
    const mockParticipants = [
      {
        id: 'par_123',
        event_id: event_id || 'evt_123',
        name: 'Juan Dela Cruz',
        email: 'juan@email.com',
        phone: '09123456789',
        team: 'Tuguegarao Warriors',
        status: 'confirmed',
        registration_date: '2026-03-10T14:30:00.000Z',
        source: 'external',
        source_details: {
          domain: 'tuguegaraoleague.gritdp.com',
          user_agent: 'Mozilla/5.0...',
          ip_address: '192.168.1.100'
        },
        organization: {
          id: 'org_123',
          name: 'Tuguegarao League',
          slug: organization_slug
        }
      },
      {
        id: 'par_124',
        event_id: event_id || 'evt_123',
        name: 'Maria Santos',
        email: 'maria@email.com',
        phone: '09123456788',
        team: 'Cagayan Eagles',
        status: 'confirmed',
        registration_date: '2026-03-11T09:15:00.000Z',
        source: 'internal',
        source_details: {
          registered_by: 'admin@gritdp.com',
          registration_method: 'admin_dashboard'
        },
        organization: {
          id: 'org_123',
          name: 'Tuguegarao League',
          slug: organization_slug
        }
      },
      {
        id: 'par_125',
        event_id: event_id || 'evt_124',
        name: 'Jose Reyes',
        email: 'jose@email.com',
        phone: '09123456787',
        team: 'Tuguegarao Knights',
        status: 'waitlisted',
        registration_date: '2026-03-12T16:45:00.000Z',
        source: 'external',
        source_details: {
          domain: 'tuguegaraoleague.gritdp.com',
          user_agent: 'Mozilla/5.0...',
          ip_address: '192.168.1.101'
        },
        organization: {
          id: 'org_123',
          name: 'Tuguegarao League',
          slug: organization_slug
        }
      }
    ]

    // Filter participants
    let filteredParticipants = mockParticipants
    
    if (event_id) {
      filteredParticipants = filteredParticipants.filter(p => p.event_id === event_id)
    }
    
    if (source && source !== 'all') {
      filteredParticipants = filteredParticipants.filter(p => p.source === source)
    }

    // Calculate statistics
    const stats = {
      total: filteredParticipants.length,
      by_status: {
        confirmed: filteredParticipants.filter(p => p.status === 'confirmed').length,
        waitlisted: filteredParticipants.filter(p => p.status === 'waitlisted').length,
        cancelled: filteredParticipants.filter(p => p.status === 'cancelled').length
      },
      by_source: {
        external: filteredParticipants.filter(p => p.source === 'external').length,
        internal: filteredParticipants.filter(p => p.source === 'internal').length
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        participants: filteredParticipants,
        stats,
        filters: {
          organization_slug,
          event_id,
          source
        }
      }
    }, { headers: responseHeaders })

  } catch (error) {
    console.error('Participants API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
}
