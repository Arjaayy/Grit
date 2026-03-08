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
import { formatDateShort } from '@/lib/admin-utils'
import {
  getAdminParticipantById,
  upsertAdminParticipant,
  type AdminParticipantRecord,
} from '@/lib/admin-participants-store'

const paymentStatusVariant = (status: string) => {
  if (status === 'Paid') return 'default'
  if (status === 'Refunded') return 'secondary'
  if (status === 'Failed') return 'destructive'
  return 'outline'
}

export default function ParticipantDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = params?.id

  const initial = useMemo(() => {
    if (!id) return null
    return getAdminParticipantById(id)
  }, [id])

  const [participant, setParticipant] = useState<AdminParticipantRecord | null>(initial)
  const [saving, setSaving] = useState(false)

  if (!participant) {
    return (
      <div className="flex-1 space-y-4 p-4 pt-4">
        <AdminPageHeader title="Participant" description="Participant not found" />
      </div>
    )
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      upsertAdminParticipant(participant)
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-4">
      <AdminPageHeader
        title={participant.name}
        description={participant.eventName}
        actions={
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link href="/admin/participants">
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
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={participant.name} onChange={(e) => setParticipant({ ...participant, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={participant.email} onChange={(e) => setParticipant({ ...participant, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={participant.phone ?? ''} onChange={(e) => setParticipant({ ...participant, phone: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Registration date</Label>
              <Input value={formatDateShort(participant.registrationDate)} readOnly />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Notes</Label>
              <Textarea value={participant.notes ?? ''} onChange={(e) => setParticipant({ ...participant, notes: e.target.value })} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant={paymentStatusVariant(participant.paymentStatus)}>{participant.paymentStatus}</Badge>
            </div>
            <div className="space-y-2">
              <Label>Payment status</Label>
              <Select
                value={participant.paymentStatus}
                onValueChange={(v) =>
                  setParticipant({
                    ...participant,
                    paymentStatus: v as AdminParticipantRecord['paymentStatus'],
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
