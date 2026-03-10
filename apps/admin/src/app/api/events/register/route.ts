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

export async function POST(request: NextRequest) {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')
    
    // Update CORS headers to allow specific origin
    const responseHeaders = {
      ...corsHeaders,
      'Access-Control-Allow-Origin': origin || '*',
    }

    const body = await request.json()
    
    // Validate required fields
    const { organization_slug, event_id, name, email, phone, team } = body
    
    if (!organization_slug || !event_id || !name || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: organization_slug, event_id, name, email' },
        { status: 400, headers: responseHeaders }
      )
    }

    // Validate organization_slug format (alphanumeric, hyphens, underscores only)
    const orgSlugRegex = /^[a-zA-Z0-9_-]+$/
    if (!orgSlugRegex.test(organization_slug)) {
      return NextResponse.json(
        { error: 'Invalid organization_slug format. Use only letters, numbers, hyphens, and underscores.' },
        { status: 400, headers: responseHeaders }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400, headers: responseHeaders }
      )
    }

    // TODO: Implement actual registration logic
    // 1. Validate organization exists in database
    // 2. Validate event exists and is open for registration
    // 3. Check if participant already registered
    // 4. Create participant record with source tracking
    // 5. Send confirmation email
    
    // Mock response for now
    const registration = {
      id: `reg_${Date.now()}`,
      organization_slug,
      event_id,
      name,
      email,
      phone: phone || '',
      team: team || '',
      status: 'confirmed',
      created_at: new Date().toISOString(),
      source: 'external'
    }

    return NextResponse.json({
      status: 'success',
      message: 'Registration successful',
      data: registration
    }, { headers: responseHeaders })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
}
