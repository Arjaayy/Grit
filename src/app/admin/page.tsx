'use client'

import { useRequireAuth } from '@/lib/client-auth'
import Link from 'next/link'
import { 
  ArrowUpRight,
  Images, 
  Calendar, 
  Users, 
  CreditCard,
  CurrencyDollar
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
import DashboardMetricCard from '@/components/admin/dashboard-metric-card'
import DashboardOverviewChart from '@/components/admin/dashboard-overview-chart'
import DashboardActivityFeed from '@/components/admin/dashboard-activity-feed'
import { mockEvents, mockOrganizations } from '@/lib/admin-mock-data'
import { formatCurrency } from '@/lib/admin-utils'

export default function AdminDashboard() {
  const { loading, authenticated } = useRequireAuth()

  const totalRevenue = mockEvents.reduce(
    (sum, e) => sum + e.price * e.registrationsCount,
    0
  )
  const totalRegistrations = mockEvents.reduce(
    (sum, e) => sum + e.registrationsCount,
    0
  )
  const upcomingEvents = mockEvents.filter((e) => e.registrationStatus === 'Open')

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!authenticated) {
    return null // Will redirect to login
  }

  const activity = [
    {
      id: 'act_1',
      type: 'registration' as const,
      title: 'New registration',
      detail: 'Alex Rivera registered for Summer Soccer Camp',
      timestamp: '2m',
    },
    {
      id: 'act_2',
      type: 'event' as const,
      title: 'Event updated',
      detail: 'Basketball Tournament registration closed',
      timestamp: '1h',
    },
    {
      id: 'act_3',
      type: 'organization' as const,
      title: 'Organization created',
      detail: 'Boulder High Athletics added',
      timestamp: '1d',
    },
  ]

  const overviewData = [
    { month: 'Jan', registrations: 120, revenue: 52000 },
    { month: 'Feb', registrations: 180, revenue: 64000 },
    { month: 'Mar', registrations: 260, revenue: 81000 },
    { month: 'Apr', registrations: 220, revenue: 76000 },
    { month: 'May', registrations: 310, revenue: 92000 },
    { month: 'Jun', registrations: 280, revenue: 88000 },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 pt-4">
      <AdminPageHeader
        title="Dashboard"
        actions={
          <div className="flex items-center gap-2">
            <Select defaultValue="30d">
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardMetricCard
          title="Total Events"
          value={mockEvents.length}
          icon={<Calendar data-icon="inline-end" />}
          footer={
            <span>
              <Badge variant="secondary" className="text-xs">
                +2
              </Badge>{' '}
              from last month
            </span>
          }
        />

        <DashboardMetricCard
          title="Total Organizations"
          value={mockOrganizations.length}
          icon={<Users data-icon="inline-end" />}
          footer={<span>Across leagues, schools, and clubs</span>}
        />

        <DashboardMetricCard
          title="Event Registrations"
          value={totalRegistrations}
          icon={<CreditCard data-icon="inline-end" />}
          footer={
            <span>
              <Badge variant="secondary" className="text-xs">
                +12%
              </Badge>{' '}
              from last month
            </span>
          }
        />

        <DashboardMetricCard
          title="Revenue from Events"
          value={formatCurrency(totalRevenue)}
          icon={<CurrencyDollar data-icon="inline-end" />}
          footer={
            <span>
              <Badge variant="secondary" className="text-xs">
                +20%
              </Badge>{' '}
              from last month
            </span>
          }
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Overview Card */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <DashboardOverviewChart data={overviewData} />
          </CardContent>
        </Card>

        {/* Activity */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Activity</CardTitle>
            <CardDescription>New registrations and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <DashboardActivityFeed items={activity} />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild>
              <Link href="/admin/portfolio/new">
                <Images className="h-4 w-4 mr-2" />
                Add Portfolio Project
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/admin/events/new">
                <Calendar className="h-4 w-4 mr-2" />
                Create Event
              </Link>
            </Button>
            <Button asChild>
              <Link href="/admin/organizations/new">
                <Users className="h-4 w-4 mr-2" />
                Add Organization
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/analytics">
                <ArrowUpRight className="h-4 w-4 mr-2" />
                View Analytics
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>Next events with registration open</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingEvents.map((e) => (
            <div key={e.id} className="flex items-center gap-3">
              <div className="text-sm font-medium">{e.name}</div>
              <div className="text-xs text-muted-foreground">{e.location}</div>
              <div className="ml-auto text-sm">{e.registrationsCount} regs</div>
            </div>
          ))}
          {upcomingEvents.length === 0 ? (
            <div className="text-sm text-muted-foreground">No upcoming events.</div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
