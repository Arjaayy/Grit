import { mockPayments, type AdminPayment } from '@/lib/admin-mock-data'

export type AdminPaymentRecord = AdminPayment & {
  refundedAmount?: number
  refundReason?: string
  notes?: string
}

const STORAGE_KEY = 'grit_admin_payments_v1'

const defaultPayments: AdminPaymentRecord[] = mockPayments.map((p) => ({
  ...p,
}))

function safeParse(json: string): AdminPaymentRecord[] | null {
  try {
    const value = JSON.parse(json)
    if (!Array.isArray(value)) return null
    return value as AdminPaymentRecord[]
  } catch {
    return null
  }
}

export function getAdminPayments(): AdminPaymentRecord[] {
  if (typeof window === 'undefined') return defaultPayments
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return defaultPayments
  return safeParse(raw) ?? defaultPayments
}

export function setAdminPayments(payments: AdminPaymentRecord[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payments))
}

export function getAdminPaymentById(id: string): AdminPaymentRecord | null {
  return getAdminPayments().find((p) => p.id === id) ?? null
}

export function upsertAdminPayment(payment: AdminPaymentRecord) {
  const payments = getAdminPayments()
  const idx = payments.findIndex((p) => p.id === payment.id)
  const next = [...payments]
  if (idx === -1) next.unshift(payment)
  else next[idx] = payment
  setAdminPayments(next)
  return next
}

export function updatePaymentStatus(
  paymentId: string,
  paymentStatus: AdminPaymentRecord['paymentStatus'],
  refundAmount?: number,
  refundReason?: string
) {
  const payment = getAdminPaymentById(paymentId)
  if (!payment) return null
  const updated = {
    ...payment,
    paymentStatus,
    refundedAmount: refundAmount ?? payment.refundedAmount,
    refundReason: refundReason ?? payment.refundReason,
  }
  upsertAdminPayment(updated)
  return updated
}

export function deleteAdminPayment(id: string) {
  const next = getAdminPayments().filter((p) => p.id !== id)
  setAdminPayments(next)
  return next
}

export function exportPaymentsCsv(payments: AdminPaymentRecord[]) {
  const header = [
    'Participant',
    'Event',
    'Amount',
    'Payment Status',
    'Refunded Amount',
    'Transaction ID',
    'Notes',
  ]
  const rows = payments.map((p) => [
    p.participantName,
    p.eventName,
    String(p.amount),
    p.paymentStatus,
    p.refundedAmount ? String(p.refundedAmount) : '',
    p.transactionId,
    p.notes ?? '',
  ])

  const csv = [header, ...rows]
    .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `payments-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
