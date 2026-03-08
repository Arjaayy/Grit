import { NextRequest, NextResponse } from 'next/server'
import { getOrganizationByApiKey, getRevenueReport } from '@/lib/events-api'
import { eventsApiPrisma } from '@/lib/events-api'

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
    const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined
    const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined
    const eventId = searchParams.get('eventId')
    const detailed = searchParams.get('detailed') === 'true'

    // Get revenue summary
    const revenueResponse = await getRevenueReport(orgResponse.data!.id, startDate, endDate)
    if (!revenueResponse.success) {
      return NextResponse.json({ error: revenueResponse.error }, { status: 500 })
    }

    let data = {
      summary: revenueResponse.data,
      organization: orgResponse.data
    }

    // If detailed report requested, include transaction breakdown
    if (detailed) {
      const where: any = {
        registration: {
          organizationId: orgResponse.data!.id
        }
      }

      if (startDate || endDate) {
        where.createdAt = {}
        if (startDate) where.createdAt.gte = startDate
        if (endDate) where.createdAt.lte = endDate
      }

      if (eventId) {
        where.registration = {
          ...where.registration,
          eventId
        }
      }

      const transactions = await eventsApiPrisma.transaction.findMany({
        where,
        include: {
          registration: {
            include: {
              event: {
                select: {
                  id: true,
                  name: true,
                  startDate: true
                }
              },
              participant: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      // Calculate monthly breakdown
      const monthlyBreakdown = transactions.reduce((acc: any, transaction: any) => {
        const month = transaction.createdAt.toISOString().slice(0, 7) // YYYY-MM
        if (!acc[month]) {
          acc[month] = {
            month,
            totalRevenue: 0,
            totalTransactions: 0,
            totalRoyalties: 0,
            organizationRevenue: 0,
            fees: 0
          }
        }
        
        acc[month].totalRevenue += Number(transaction.amount)
        acc[month].totalTransactions += 1
        acc[month].totalRoyalties += Number(transaction.gritAmount)
        acc[month].organizationRevenue += Number(transaction.organizationAmount)
        acc[month].fees += Number(transaction.fee)
        
        return acc
      }, {})

      data = {
        ...data,
        transactions,
        monthlyBreakdown: Object.values(monthlyBreakdown),
        filters: {
          startDate,
          endDate,
          eventId
        }
      }
    }

    return NextResponse.json({
      success: true,
      data
    })
  } catch (error) {
    console.error('Revenue report API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
