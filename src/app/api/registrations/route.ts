import { NextRequest, NextResponse } from 'next/server'
import { getOrganizationByApiKey, createRegistration, listRegistrations } from '@/lib/events-api'

export async function GET(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-api-key')
    if (!apiKey) {
      return NextResponse.json({ error: 'API key required' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('eventId')
    const status = searchParams.get('status') || undefined

    if (!eventId) {
      return NextResponse.json({ error: 'Event ID required' }, { status: 400 })
    }

    // Verify organization
    const orgResponse = await getOrganizationByApiKey(apiKey)
    if (!orgResponse.success) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
    }

    // List registrations
    const registrationsResponse = await listRegistrations(eventId, orgResponse.data!.id, status)
    if (!registrationsResponse.success) {
      return NextResponse.json({ error: registrationsResponse.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: registrationsResponse.data
    })
  } catch (error) {
    console.error('Registrations API error:', error)
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
    
    // Create registration
    const registrationResponse = await createRegistration({
      ...body,
      organizationId: orgResponse.data!.id
    })

    if (!registrationResponse.success) {
      return NextResponse.json({ error: registrationResponse.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: registrationResponse.data
    })
  } catch (error) {
    console.error('Registrations API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
