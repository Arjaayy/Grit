'use client'

import { useState, useEffect } from 'react'
import { 
  ChartBar,
  Users,
  Calendar,
  CurrencyDollar,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface AnalyticsData {
  totalRevenue: number
  revenueChange: number
  totalEvents: number
  eventsChange: number
  totalUsers: number
  usersChange: number
  totalRegistrations: number
  registrationsChange: number
  monthlyData: {
    month: string
    revenue: number
    events: number
    users: number
    registrations: number
  }[]
  topEvents: {
    id: string
    title: string
    registrations: number
    revenue: number
  }[]
  topOrganizations: {
    id: string
    name: string
    events: number
    revenue: number
  }[]
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      // Mock data for now
      const mockData: AnalyticsData = {
        totalRevenue: 485000,
        revenueChange: 12.5,
        totalEvents: 45,
        eventsChange: 8.3,
        totalUsers: 1250,
        usersChange: 15.2,
        totalRegistrations: 890,
        registrationsChange: 10.7,
        monthlyData: [
          { month: 'Jan', revenue: 35000, events: 3, users: 100, registrations: 85 },
          { month: 'Feb', revenue: 42000, events: 4, users: 120, registrations: 95 },
          { month: 'Mar', revenue: 38000, events: 3, users: 110, registrations: 88 },
          { month: 'Apr', revenue: 45000, events: 5, users: 140, registrations: 110 },
          { month: 'May', revenue: 52000, events: 4, users: 160, registrations: 125 },
          { month: 'Jun', revenue: 48000, events: 4, users: 150, registrations: 118 },
        ],
        topEvents: [
          { id: '1', title: 'Summer Soccer Camp', registrations: 45, revenue: 22500 },
          { id: '2', title: 'Basketball Tournament', registrations: 32, revenue: 16000 },
          { id: '3', title: 'Football Training Camp', registrations: 28, revenue: 14000 },
        ],
        topOrganizations: [
          { id: '1', name: 'Denver Soccer Academy', events: 12, revenue: 125000 },
          { id: '2', name: 'Colorado Sports League', events: 8, revenue: 95000 },
          { id: '3', name: 'Elite Athletes Academy', events: 5, revenue: 45000 },
        ]
      }
      setData(mockData)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="flex-1 space-y-4 p-4 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analytics</h2>
        </div>
        <Button variant="outline">
          <ChartBar className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CurrencyDollar data-icon="inline-end" className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.totalRevenue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {data.revenueChange > 0 ? (
                <ArrowUpRight data-icon="inline-start" className="text-green-600" />
              ) : (
                <ArrowDownRight data-icon="inline-start" className="text-red-600" />
              )}
              <Badge variant={data.revenueChange > 0 ? "secondary" : "destructive"} className="text-xs ml-1">
                {Math.abs(data.revenueChange)}%
              </Badge>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar data-icon="inline-end" className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalEvents}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {data.eventsChange > 0 ? (
                <ArrowUpRight data-icon="inline-start" className="text-green-600" />
              ) : (
                <ArrowDownRight data-icon="inline-start" className="text-red-600" />
              )}
              <Badge variant={data.eventsChange > 0 ? "secondary" : "destructive"} className="text-xs ml-1">
                {Math.abs(data.eventsChange)}%
              </Badge>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users data-icon="inline-end" className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalUsers.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {data.usersChange > 0 ? (
                <ArrowUpRight data-icon="inline-start" className="text-green-600" />
              ) : (
                <ArrowDownRight data-icon="inline-start" className="text-red-600" />
              )}
              <Badge variant={data.usersChange > 0 ? "secondary" : "destructive"} className="text-xs ml-1">
                {Math.abs(data.usersChange)}%
              </Badge>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium">Registrations</CardTitle>
            <ChartBar data-icon="inline-end" className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalRegistrations.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {data.registrationsChange > 0 ? (
                <ArrowUpRight data-icon="inline-start" className="text-green-600" />
              ) : (
                <ArrowDownRight data-icon="inline-start" className="text-red-600" />
              )}
              <Badge variant={data.registrationsChange > 0 ? "secondary" : "destructive"} className="text-xs ml-1">
                {Math.abs(data.registrationsChange)}%
              </Badge>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.monthlyData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.month}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div 
                        className="bg-blue-950 h-2 rounded-full" 
                        style={{ width: `${(item.revenue / 52000) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-muted-foreground w-16 text-right">
                      ${item.revenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Growth Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.monthlyData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.month}</span>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground w-8">{item.users}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground w-8">{item.events}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Lists */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topEvents.map((event, index) => (
                <div key={event.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                      {index + 1}
                    </Badge>
                    <div>
                      <p className="text-sm font-medium">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{event.registrations} registrations</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">${event.revenue.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Organizations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topOrganizations.map((org, index) => (
                <div key={org.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                      {index + 1}
                    </Badge>
                    <div>
                      <p className="text-sm font-medium">{org.name}</p>
                      <p className="text-xs text-muted-foreground">{org.events} events</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">${org.revenue.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
