import { NextRequest, NextResponse } from 'next/server'
import { getEvent } from '@/lib/events-api'

export async function GET(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const apiKey = searchParams.get('apiKey')

    if (!apiKey) {
      return NextResponse.json({ error: 'API key required' }, { status: 401 })
    }

    // Get event details
    const eventResponse = await getEvent(params.eventId)
    if (!eventResponse.success) {
      return NextResponse.json({ error: eventResponse.error }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: eventResponse.data
    })
  } catch (error) {
    console.error('Event registration API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
