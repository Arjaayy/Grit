import { NextRequest, NextResponse } from 'next/server'
import { getOrganizationByApiKey, getRegistration, refundRegistration } from '@/lib/events-api'

export async function GET(
  request: NextRequest,
  { params }: { params: { registrationId: string } }
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

    // Get registration
    const registrationResponse = await getRegistration(params.registrationId, orgResponse.data!.id)
    if (!registrationResponse.success) {
      return NextResponse.json({ error: registrationResponse.error }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: registrationResponse.data
    })
  } catch (error) {
    console.error('Registration API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { registrationId: string } }
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
    const { action, amount } = body

    if (action === 'refund') {
      // Process refund
      const refundResponse = await refundRegistration(params.registrationId, amount)
      if (!refundResponse.success) {
        return NextResponse.json({ error: refundResponse.error }, { status: 400 })
      }

      return NextResponse.json({
        success: true,
        data: refundResponse.data
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Registration API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
