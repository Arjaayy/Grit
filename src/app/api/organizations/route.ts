import { NextRequest, NextResponse } from 'next/server'
import { createOrganization } from '@/lib/events-api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Create organization
    const orgResponse = await createOrganization(body)
    if (!orgResponse.success) {
      return NextResponse.json({ error: orgResponse.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: orgResponse.data
    })
  } catch (error) {
    console.error('Organizations API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
