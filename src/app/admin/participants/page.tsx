'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
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
import AdminPageHeader from '@/components/admin/admin-page-header'
import { mockEvents } from '@/lib/admin-mock-data'
import { formatDateShort } from '@/lib/admin-utils'
import {
  exportParticipantsCsv,
  getAdminParticipants,
  updateParticipantPaymentStatus,
  type AdminParticipantRecord,
} from '@/lib/admin-participants-store'

const paymentStatusVariant = (status: string) => {
  if (status === 'Paid') return 'default'
  if (status === 'Refunded') return 'secondary'
  if (status === 'Failed') return 'destructive'
  return 'outline'
}

export default function ParticipantsPage() {
  const [search, setSearch] = useState('')
  const [eventId, setEventId] = useState<string>('all')
  const [paymentStatus, setPaymentStatus] = useState<string>('all')
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({})
  const [bulkStatus, setBulkStatus] = useState<string>('')

  const events = useMemo(() => mockEvents, [])

  const participants = useMemo(() => {
    return getAdminParticipants()
      .filter((p) => {
        const matchesSearch =
          !search ||
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.email.toLowerCase().includes(search.toLowerCase())

        const matchesEvent = eventId === 'all' || p.eventId === eventId
        const matchesPayment =
          paymentStatus === 'all' || p.paymentStatus === paymentStatus

        return matchesSearch && matchesEvent && matchesPayment
      })
      .sort((a, b) => (a.registrationDate < b.registrationDate ? 1 : -1))
  }, [eventId, paymentStatus, search])

  const selectedParticipants = useMemo(() => {
    return participants.filter((p) => selectedIds[p.id])
  }, [participants, selectedIds])

  const allVisibleSelected =
    participants.length > 0 && participants.every((p) => Boolean(selectedIds[p.id]))

  const toggleSelectAllVisible = (checked: boolean) => {
    const next: Record<string, boolean> = { ...selectedIds }
    participants.forEach((p) => {
      next[p.id] = checked
    })
    setSelectedIds(next)
  }

  const toggleRow = (id: string, checked: boolean) => {
    setSelectedIds((prev) => ({ ...prev, [id]: checked }))
  }

  const applyBulkStatus = () => {
    if (!bulkStatus) return
    selectedParticipants.forEach((p) => {
      updateParticipantPaymentStatus(p.id, bulkStatus as AdminParticipantRecord['paymentStatus'])
    })
    setSelectedIds({})
    setBulkStatus('')
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-4">
      <AdminPageHeader
        title="Participants"
        description="Manage all event participants"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => exportParticipantsCsv(participants)}
              disabled={participants.length === 0}
            >
              Export CSV
            </Button>
          </div>
        }
      />

      <Card>
        <CardContent className="p-4">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name or email..."
                className="pl-10"
              />
            </div>

            <Select value={eventId} onValueChange={setEventId}>
              <SelectTrigger>
                <SelectValue placeholder="Event" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                {events.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={paymentStatus} onValueChange={setPaymentStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payment Status</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
                <SelectItem value="Refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {selectedParticipants.length > 0 ? (
            <div className="flex flex-wrap items-center justify-between gap-2 border-b p-3">
              <div className="text-sm text-muted-foreground">
                {selectedParticipants.length} selected
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Select value={bulkStatus} onValueChange={setBulkStatus}>
                  <SelectTrigger className="h-9 w-[200px]">
                    <SelectValue placeholder="Set payment status..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                    <SelectItem value="Refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={applyBulkStatus} disabled={!bulkStatus}>
                  Apply
                </Button>
                <Button
                  variant="outline"
                  onClick={() => exportParticipantsCsv(selectedParticipants)}
                >
                  Export Selected
                </Button>
              </div>
            </div>
          ) : null}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[44px]">
                  <input
                    aria-label="Select all"
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={(e) => toggleSelectAllVisible(e.target.checked)}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participants.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <input
                      aria-label={`Select ${p.name}`}
                      type="checkbox"
                      checked={Boolean(selectedIds[p.id])}
                      onChange={(e) => toggleRow(p.id, e.target.checked)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{p.email}</TableCell>
                  <TableCell>{p.eventName}</TableCell>
                  <TableCell>
                    <Badge variant={paymentStatusVariant(p.paymentStatus)}>
                      {p.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDateShort(p.registrationDate)}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/participants/${p.id}`}>View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {participants.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">
              No participants found.
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
