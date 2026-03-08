import { mockParticipants, type AdminParticipant } from '@/lib/admin-mock-data'

export type AdminParticipantRecord = AdminParticipant & {
  phone?: string
  notes?: string
}

const STORAGE_KEY = 'grit_admin_participants_v1'

const defaultParticipants: AdminParticipantRecord[] = mockParticipants.map((p) => ({
  ...p,
}))

function safeParse(json: string): AdminParticipantRecord[] | null {
  try {
    const value = JSON.parse(json)
    if (!Array.isArray(value)) return null
    return value as AdminParticipantRecord[]
  } catch {
    return null
  }
}

export function getAdminParticipants(): AdminParticipantRecord[] {
  if (typeof window === 'undefined') return defaultParticipants
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return defaultParticipants
  return safeParse(raw) ?? defaultParticipants
}

export function setAdminParticipants(participants: AdminParticipantRecord[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(participants))
}

export function getAdminParticipantById(id: string): AdminParticipantRecord | null {
  return getAdminParticipants().find((p) => p.id === id) ?? null
}

export function upsertAdminParticipant(participant: AdminParticipantRecord) {
  const participants = getAdminParticipants()
  const idx = participants.findIndex((p) => p.id === participant.id)
  const next = [...participants]
  if (idx === -1) next.unshift(participant)
  else next[idx] = participant
  setAdminParticipants(next)
  return next
}

export function deleteAdminParticipant(id: string) {
  const next = getAdminParticipants().filter((p) => p.id !== id)
  setAdminParticipants(next)
  return next
}

export function updateParticipantPaymentStatus(
  participantId: string,
  paymentStatus: AdminParticipantRecord['paymentStatus']
) {
  const participant = getAdminParticipantById(participantId)
  if (!participant) return null
  upsertAdminParticipant({ ...participant, paymentStatus })
  return { ...participant, paymentStatus }
}

export function exportParticipantsCsv(participants: AdminParticipantRecord[]) {
  const header = ['Name', 'Email', 'Event', 'Payment Status', 'Registration Date']
  const rows = participants.map((p) => [
    p.name,
    p.email,
    p.eventName,
    p.paymentStatus,
    p.registrationDate,
  ])

  const csv = [header, ...rows]
    .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `participants-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
