'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { PencilSimpleLine } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import AdminPageHeader from '@/components/admin/admin-page-header'
import { formatCurrency } from '@/lib/admin-utils'
import {
  getAdminPaymentById,
  upsertAdminPayment,
  type AdminPaymentRecord,
} from '@/lib/admin-payments-store'

const paymentStatusVariant = (status: string) => {
  if (status === 'Paid') return 'default'
  if (status === 'Refunded') return 'secondary'
  if (status === 'Failed') return 'destructive'
  return 'outline'
}

export default function PaymentDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = params?.id

  const initial = useMemo(() => {
    if (!id) return null
    return getAdminPaymentById(id)
  }, [id])

  const [payment, setPayment] = useState<AdminPaymentRecord | null>(initial)
  const [saving, setSaving] = useState(false)

  if (!payment) {
    return (
      <div className="flex-1 space-y-4 p-4 pt-4">
        <AdminPageHeader title="Payment" description="Payment not found" />
      </div>
    )
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      upsertAdminPayment(payment)
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-4">
      <AdminPageHeader
        title={`Payment for ${payment.participantName}`}
        description={payment.eventName}
        actions={
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link href="/admin/payments">
                <PencilSimpleLine className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Participant</Label>
              <Input value={payment.participantName} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Event</Label>
              <Input value={payment.eventName} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input value={formatCurrency(payment.amount)} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Transaction ID</Label>
              <Input value={payment.transactionId} readOnly className="font-mono text-xs" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Notes</Label>
              <Textarea
                value={payment.notes ?? ''}
                onChange={(e) => setPayment({ ...payment, notes: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status & Refunds</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant={paymentStatusVariant(payment.paymentStatus)}>
                {payment.paymentStatus}
              </Badge>
            </div>
            <div className="space-y-2">
              <Label>Payment status</Label>
              <Select
                value={payment.paymentStatus}
                onValueChange={(v) =>
                  setPayment({
                    ...payment,
                    paymentStatus: v as AdminPaymentRecord['paymentStatus'],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                  <SelectItem value="Refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {payment.paymentStatus === 'Refunded' && (
              <>
                <div className="space-y-2">
                  <Label>Refunded amount</Label>
                  <Input
                    type="number"
                    min={0}
                    value={payment.refundedAmount ?? ''}
                    onChange={(e) =>
                      setPayment({ ...payment, refundedAmount: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Refund reason</Label>
                  <Textarea
                    value={payment.refundReason ?? ''}
                    onChange={(e) => setPayment({ ...payment, refundReason: e.target.value })}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
