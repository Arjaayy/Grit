import { NextRequest, NextResponse } from 'next/server'
import { getOrganizationByApiKey, getEvent, updateEvent } from '@/lib/events-api'

export async function GET(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
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

    // Get event
    const eventResponse = await getEvent(params.eventId, orgResponse.data!.id)
    if (!eventResponse.success) {
      return NextResponse.json({ error: eventResponse.error }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: eventResponse.data
    })
  } catch (error) {
    console.error('Event API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
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
    
    // Update event
    const eventResponse = await updateEvent(params.eventId, orgResponse.data!.id, body)
    if (!eventResponse.success) {
      return NextResponse.json({ error: eventResponse.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: eventResponse.data
    })
  } catch (error) {
    console.error('Event API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
