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
import { LoadingState } from '@/components/admin/loading-states'
import AdminPageHeader from '@/components/admin/admin-page-header'
import DashboardMetricCard from '@/components/admin/dashboard-metric-card'
import DashboardOverviewChart from '@/components/admin/dashboard-overview-chart'
import DashboardActivityFeed from '@/components/admin/dashboard-activity-feed'
import { useKeyboardNavigation } from '@/hooks/use-keyboard-navigation'
import { mockEvents, mockOrganizations } from '@/lib/admin-mock-data'
import { formatCurrency } from '@/lib/admin-utils'

export default function AdminDashboard() {
  const { loading, authenticated } = useRequireAuth()

  // Keyboard navigation shortcuts
  useKeyboardNavigation([
    {
      key: 'n',
      ctrlKey: true,
      metaKey: true,
      action: () => window.location.href = '/admin/events/new',
      description: 'Create new event'
    },
    {
      key: 'p',
      ctrlKey: true,
      metaKey: true,
      action: () => window.location.href = '/admin/portfolio/new',
      description: 'Add portfolio project'
    },
    {
      key: 'o',
      ctrlKey: true,
      metaKey: true,
      action: () => window.location.href = '/admin/organizations/new',
      description: 'Add organization'
    },
    {
      key: 'a',
      ctrlKey: true,
      metaKey: true,
      action: () => window.location.href = '/admin/analytics',
      description: 'View analytics'
    }
  ])

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
    return <LoadingState type="page" message="Loading dashboard..." />
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
          <div className="flex items-center gap-2 flex-wrap" role="toolbar" aria-label="Dashboard actions">
            <Select defaultValue="30d" aria-label="Select date range">
              <SelectTrigger className="w-[140px] sm:w-[160px]" aria-label="Date range selector">
                <SelectValue placeholder="Date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" aria-label="Export dashboard data">
              <Calendar className="mr-2 h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Export</span>
              <span className="sm:hidden">Exp</span>
            </Button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" role="region" aria-label="Dashboard statistics">
        <DashboardMetricCard
          title="Total Events"
          value={mockEvents.length}
          icon={<Calendar data-icon="inline-end" aria-hidden="true" />}
          footer={
            <span>
              <Badge variant="secondary" className="text-xs" aria-label="2 more events than last month">
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

      <div className="grid gap-4 lg:grid-cols-7 xl:grid-cols-7">
        {/* Overview Card */}
        <Card className="col-span-4 lg:col-span-4 xl:col-span-4">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px] sm:h-[220px]" role="img" aria-label="Bar chart showing monthly registrations">
              <DashboardOverviewChart data={overviewData} />
            </div>
          </CardContent>
        </Card>

        {/* Activity */}
        <Card className="col-span-3 lg:col-span-3 xl:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Activity</CardTitle>
            <CardDescription className="text-sm">New registrations and updates</CardDescription>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3" role="toolbar" aria-label="Quick actions">
            <Button asChild className="w-full sm:w-auto" aria-label="Add new portfolio project">
              <Link href="/admin/portfolio/new">
                <Images className="h-4 w-4 mr-2" aria-hidden="true" />
                <span className="truncate">Add Portfolio</span>
              </Link>
            </Button>
            <Button asChild className="w-full sm:w-auto" aria-label="Create new event">
              <Link href="/admin/events/new">
                <Calendar className="h-4 w-4 mr-2" aria-hidden="true" />
                <span className="truncate">Create Event</span>
              </Link>
            </Button>
            <Button asChild className="w-full sm:w-auto" aria-label="Add new organization">
              <Link href="/admin/organizations/new">
                <Users className="h-4 w-4 mr-2" aria-hidden="true" />
                <span className="truncate">Add Organization</span>
              </Link>
            </Button>
            <Button asChild className="w-full sm:w-auto" aria-label="View analytics dashboard">
              <Link href="/admin/analytics">
                <ArrowUpRight className="h-4 w-4 mr-2" aria-hidden="true" />
                <span className="truncate">View Analytics</span>
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
          <h3 className="font-medium sr-only">Upcoming Events</h3>
          {upcomingEvents.map((e) => (
            <div key={e.id} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 rounded-lg border bg-card" role="article" aria-labelledby={`event-${e.id}-name`}>
              <div id={`event-${e.id}-name`} className="text-sm font-medium">{e.name}</div>
              <div className="text-xs text-muted-foreground">{e.location}</div>
              <div className="sm:ml-auto text-sm font-semibold" aria-label={`${e.registrationsCount} registrations`}>{e.registrationsCount} regs</div>
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
