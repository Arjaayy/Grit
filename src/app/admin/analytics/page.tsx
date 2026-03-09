'use client'

import { useState, useEffect } from 'react'
import { 
  ChartBar,
  Users,
  Calendar,
  CurrencyDollar,
  ArrowUpRight,
  ArrowDownRight
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import LoadingSpinner from '@/components/ui/loading-spinner'
import AdminPageHeader from '@/components/admin/admin-page-header'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

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
  const [dateRange, setDateRange] = useState('30d')

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
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!data) return null

  const exportReportCsv = () => {
    const header = ['Month', 'Revenue', 'Events', 'Users', 'Registrations']
    const rows = data.monthlyData.map((row) => [
      row.month,
      String(row.revenue),
      String(row.events),
      String(row.users),
      String(row.registrations),
    ])

    const csv = [header, ...rows]
      .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-4">
      <AdminPageHeader
        title="Analytics"
        description="Performance insights and reporting"
        actions={
          <div className="flex items-center gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={exportReportCsv}>
              <ChartBar className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        }
      />

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
            <CardDescription>Revenue by month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.monthlyData} margin={{ left: 8, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} width={40} />
                  <Tooltip
                    cursor={{ stroke: 'oklch(37.2% 0.044 257.287)' }}
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null
                      return (
                        <div
                          className="rounded-lg border px-3 py-2 text-sm shadow-md"
                          style={{
                            backgroundColor: 'oklch(21% 0.034 264.665)',
                            borderColor: 'oklch(37.2% 0.044 257.287)',
                          }}
                        >
                          <p className="font-medium mb-1" style={{ color: 'white' }}>
                            {label}
                          </p>
                          {payload.map((entry, index) => (
                            <div key={index} className="flex flex-col">
                              <span style={{ color: entry.color || entry.stroke }}>
                                {entry.name || 'Revenue'}: {entry.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      )
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#e8192c"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Registration Trends</CardTitle>
            <CardDescription>Registrations by month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.monthlyData} margin={{ left: 8, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} width={40} />
                  <Tooltip
                    cursor={{ fill: 'oklch(20.8% 0.042 265.755)' }}
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null
                      return (
                        <div
                          className="rounded-lg border px-3 py-2 text-sm shadow-md"
                          style={{
                            backgroundColor: 'oklch(21% 0.034 264.665)',
                            borderColor: 'oklch(37.2% 0.044 257.287)',
                          }}
                        >
                          <p className="font-medium mb-1" style={{ color: 'white' }}>
                            {label}
                          </p>
                          {payload.map((entry, index) => (
                            <div key={index} className="flex flex-col">
                              <span style={{ color: entry.color || entry.fill }}>
                                {entry.name || 'Registrations'}: {entry.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      )
                    }}
                  />
                  <Bar dataKey="registrations" fill="#e8192c" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
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
