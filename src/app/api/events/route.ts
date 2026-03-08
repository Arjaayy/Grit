import { NextRequest, NextResponse } from 'next/server'
import { getOrganizationByApiKey, createEvent, listEvents } from '@/lib/events-api'

export async function GET(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-api-key')
    if (!apiKey) {
      return NextResponse.json({ error: 'API key required' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || undefined

    // Verify organization
    const orgResponse = await getOrganizationByApiKey(apiKey)
    if (!orgResponse.success) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
    }

    // List events
    const eventsResponse = await listEvents(orgResponse.data!.id, status)
    if (!eventsResponse.success) {
      return NextResponse.json({ error: eventsResponse.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: eventsResponse.data
    })
  } catch (error) {
    console.error('Events API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-api-key')
    if (!apiKey) {
      return NextResponse.json({ error: 'API key required' }, { status: 401 })
    }

    // Verify organization
    const orgResponse = await getOrganizationByApiKey(apiKey)
    if (!orgResponse.success) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
    }

    const body = await request.json()
    
    // Create event
    const eventResponse = await createEvent({
      ...body,
      organizationId: orgResponse.data!.id
    })

    if (!eventResponse.success) {
      return NextResponse.json({ error: eventResponse.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: eventResponse.data
    })
  } catch (error) {
    console.error('Events API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
