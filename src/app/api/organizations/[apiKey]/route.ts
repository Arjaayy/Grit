import { NextRequest, NextResponse } from 'next/server'
import { getOrganizationByApiKey, getRevenueReport } from '@/lib/events-api'

export async function GET(
  request: NextRequest,
  { params }: { params: { apiKey: string } }
) {
  try {
    // Get organization details
    const orgResponse = await getOrganizationByApiKey(params.apiKey)
    if (!orgResponse.success) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const includeRevenue = searchParams.get('includeRevenue') === 'true'
    
    let data = orgResponse.data

    if (includeRevenue) {
      const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined
      const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined
      
      const revenueResponse = await getRevenueReport(orgResponse.data!.id, startDate, endDate)
      if (revenueResponse.success) {
        data = {
          ...orgResponse.data,
          revenue: revenueResponse.data
        }
      }
    }

    return NextResponse.json({
      success: true,
      data
    })
  } catch (error) {
    console.error('Organization API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
