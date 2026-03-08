'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { 
  Calendar, 
  CurrencyDollar,
  Users,
  MagnifyingGlass, 
  Funnel, 
  Plus,
  Download
} from '@phosphor-icons/react'
import { useRequireAuth } from '@/lib/client-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { LoadingState } from '@/components/admin/loading-states'
import AdminPageHeader from '@/components/admin/admin-page-header'
import { exportEventsCsv, getAdminEvents } from '@/lib/admin-events-store'
import { formatCurrency, formatDateShort } from '@/lib/admin-utils'

export default function EventsPage() {
  const { loading, authenticated } = useRequireAuth()
  const events = useMemo(() => getAdminEvents(), [])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterOrg, setFilterOrg] = useState('all')

  if (loading) {
    return <LoadingState type="page" message="Loading events..." />
  }

  if (!authenticated) {
    return null
  }

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.organizationName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === 'all' || event.registrationStatus === filterStatus
    const matchesOrg = filterOrg === 'all' || event.organizationName === filterOrg

    return matchesSearch && matchesStatus && matchesOrg
  })

  const organizations = Array.from(new Set(events.map((e) => e.organizationName)))
  const statuses = Array.from(new Set(events.map((e) => e.registrationStatus)))

  return (
    <div className="flex-1 space-y-4 p-4 pt-4">
      <AdminPageHeader
        title="Events"
        description="Manage tournaments and competitions"
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" onClick={() => exportEventsCsv(filteredEvents)} size="sm">
              <Download className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Export CSV</span>
              <span className="sm:hidden">CSV</span>
            </Button>
            <Button asChild size="sm">
              <Link href="/admin/events/new">
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Create Event</span>
                <span className="sm:hidden">New</span>
              </Link>
            </Button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar data-icon="inline-end" className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
            <p className="text-xs text-muted-foreground">
              <Badge variant="secondary" className="text-xs">+2</Badge> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
            <Users data-icon="inline-end" className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.reduce((sum, e) => sum + e.registrationsCount, 0)}</div>
            <p className="text-xs text-muted-foreground">
              <Badge variant="secondary" className="text-xs">+12%</Badge> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CurrencyDollar data-icon="inline-end" className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${events
                .reduce((sum, e) => sum + e.price * e.registrationsCount, 0)
                .toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <Badge variant="secondary" className="text-xs">+20%</Badge> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar data-icon="inline-end" className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.filter(e => e.registrationStatus === 'Open').length}</div>
            <p className="text-xs text-muted-foreground">
              Next 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterOrg} onValueChange={setFilterOrg}>
              <SelectTrigger>
                <SelectValue placeholder="All Organizations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Organizations</SelectItem>
                {organizations.map((org) => (
                  <SelectItem key={org} value={org}>
                    {org}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('')
                setFilterOrg('all')
                setFilterStatus('all')
              }}
            >
              <Funnel className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Events Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">Event Name</TableHead>
                  <TableHead className="min-w-[120px] hidden sm:table-cell">Organization</TableHead>
                  <TableHead className="min-w-[100px]">Date</TableHead>
                  <TableHead className="min-w-[100px] hidden md:table-cell">Location</TableHead>
                  <TableHead className="min-w-[120px]">Status</TableHead>
                  <TableHead className="min-w-[80px] text-right hidden sm:table-cell">Price</TableHead>
                  <TableHead className="min-w-[80px] text-right hidden lg:table-cell">Regs</TableHead>
                  <TableHead className="min-w-[80px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-medium">{event.name}</div>
                        <div className="text-xs text-muted-foreground sm:hidden">{event.organizationName}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{event.organizationName}</TableCell>
                    <TableCell>{formatDateShort(event.date)}</TableCell>
                    <TableCell className="hidden md:table-cell">{event.location}</TableCell>
                    <TableCell>
                      <Badge variant={event.registrationStatus === 'Open' ? 'default' : 'secondary'} className="text-xs">
                        {event.registrationStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right hidden sm:table-cell">{formatCurrency(event.price)}</TableCell>
                    <TableCell className="text-right hidden lg:table-cell">{event.registrationsCount}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/events/${event.id}`}>
                          <span className="hidden sm:inline">View</span>
                          <span className="sm:hidden">V</span>
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <Calendar className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium mb-2">No events found</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                {searchTerm || filterOrg !== 'all' || filterStatus !== 'all'
                  ? 'Try adjusting your filters or search terms'
                  : 'Get started by creating your first event'
                }
              </p>
              {!searchTerm && filterOrg === 'all' && filterStatus === 'all' && (
                <Button asChild size="sm">
                  <Link href="/admin/events/new">
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Create Your First Event</span>
                    <span className="sm:hidden">Create Event</span>
                  </Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
