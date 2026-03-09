import { NextRequest, NextResponse } from 'next/server'
import { getOrganizationByApiKey } from '@/lib/events-api'
import { eventsApiPrisma } from '@/lib/events-api'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('eventId')
    const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined
    const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined
    const status = searchParams.get('status')

    // Build where clause
    const where: any = {
      organizationId: orgResponse.data!.id
    }

    if (eventId) {
      where.eventId = eventId
    }

    if (status) {
      where.status = status
    }

    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = startDate
      if (endDate) where.createdAt.lte = endDate
    }

    // Get registrations with event details
    const registrations = await eventsApiPrisma.registration.findMany({
      where,
      include: {
        event: {
          select: {
            id: true,
            name: true,
            startDate: true,
            endDate: true,
            location: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Calculate summary statistics
    const summary = {
      total: registrations.length,
      pending: registrations.filter((r: any) => r.status === 'pending').length,
      confirmed: registrations.filter((r: any) => r.status === 'confirmed').length,
      waitlisted: registrations.filter((r: any) => r.status === 'waitlisted').length,
      cancelled: registrations.filter((r: any) => r.status === 'cancelled').length,
      refunded: registrations.filter((r: any) => r.status === 'refunded').length,
      totalRevenue: registrations.reduce((sum: number, r: any) => sum + (r.paid ? Number(r.amount) : 0), 0),
      pendingRevenue: registrations.reduce((sum: number, r: any) => sum + (!r.paid ? Number(r.amount) : 0), 0)
    }

    return NextResponse.json({
      success: true,
      data: {
        registrations,
        summary,
        filters: {
          eventId,
          startDate,
          endDate,
          status
        }
      }
    })
  } catch (error) {
    console.error('Registrations report API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


