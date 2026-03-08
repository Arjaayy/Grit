'use client'

import { useMemo, useState } from 'react'
import { MagnifyingGlass } from '@phosphor-icons/react'
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
import { mockEvents, mockPayments } from '@/lib/admin-mock-data'
import { formatCurrency } from '@/lib/admin-utils'

const paymentStatusVariant = (status: string) => {
  if (status === 'Paid') return 'default'
  if (status === 'Refunded') return 'secondary'
  if (status === 'Failed') return 'destructive'
  return 'outline'
}

export default function PaymentsPage() {
  const [search, setSearch] = useState('')
  const [eventId, setEventId] = useState<string>('all')
  const [paymentStatus, setPaymentStatus] = useState<string>('all')

  const events = useMemo(() => mockEvents, [])

  const payments = useMemo(() => {
    return mockPayments.filter((p) => {
      const matchesSearch =
        !search ||
        p.participantName.toLowerCase().includes(search.toLowerCase()) ||
        p.eventName.toLowerCase().includes(search.toLowerCase()) ||
        p.transactionId.toLowerCase().includes(search.toLowerCase())

      const matchesEvent = eventId === 'all' || p.eventId === eventId
      const matchesPayment = paymentStatus === 'all' || p.paymentStatus === paymentStatus

      return matchesSearch && matchesEvent && matchesPayment
    })
  }, [eventId, paymentStatus, search])

  return (
    <div className="flex-1 space-y-4 p-4 pt-4">
      <AdminPageHeader
        title="Payments"
        description="Track Stripe payments and transaction status"
      />

      <Card>
        <CardContent className="p-4">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search participant, event, or transaction..."
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Participant</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Transaction ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.participantName}</TableCell>
                  <TableCell>{p.eventName}</TableCell>
                  <TableCell>{formatCurrency(p.amount)}</TableCell>
                  <TableCell>
                    <Badge variant={paymentStatusVariant(p.paymentStatus)}>
                      {p.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{p.transactionId}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {payments.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">No payments found.</div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
