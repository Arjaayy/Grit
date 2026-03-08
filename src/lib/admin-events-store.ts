export type AdminEventRecord = {
  id: string
  name: string
  organizationName: string
  date: string
  location: string
  registrationStatus: 'Open' | 'Closed'
  price: number
  registrationsCount: number
}

const STORAGE_KEY = 'grit_admin_events_v1'

const defaultEvents: AdminEventRecord[] = [
  {
    id: 'evt_1',
    name: 'Summer Soccer Camp',
    organizationName: 'Denver Soccer Academy',
    date: '2026-07-15',
    location: 'Denver, CO',
    registrationStatus: 'Open',
    price: 499,
    registrationsCount: 45,
  },
  {
    id: 'evt_2',
    name: 'Basketball Tournament',
    organizationName: 'Colorado Sports League',
    date: '2026-08-20',
    location: 'Boulder, CO',
    registrationStatus: 'Closed',
    price: 199,
    registrationsCount: 32,
  },
  {
    id: 'evt_3',
    name: 'Football Training Camp',
    organizationName: 'Elite Athletes Academy',
    date: '2026-09-10',
    location: 'Colorado Springs, CO',
    registrationStatus: 'Open',
    price: 299,
    registrationsCount: 28,
  },
]

function safeParse(json: string): AdminEventRecord[] | null {
  try {
    const value = JSON.parse(json)
    if (!Array.isArray(value)) return null
    return value as AdminEventRecord[]
  } catch {
    return null
  }
}

export function getAdminEvents(): AdminEventRecord[] {
  if (typeof window === 'undefined') return defaultEvents
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return defaultEvents
  return safeParse(raw) ?? defaultEvents
}

export function setAdminEvents(events: AdminEventRecord[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
}

export function getAdminEventById(id: string): AdminEventRecord | null {
  return getAdminEvents().find((e) => e.id === id) ?? null
}

export function upsertAdminEvent(event: AdminEventRecord) {
  const events = getAdminEvents()
  const idx = events.findIndex((e) => e.id === event.id)
  const next = [...events]
  if (idx === -1) next.unshift(event)
  else next[idx] = event
  setAdminEvents(next)
  return next
}

export function deleteAdminEvent(id: string) {
  const next = getAdminEvents().filter((e) => e.id !== id)
  setAdminEvents(next)
  return next
}

export function exportEventsCsv(events: AdminEventRecord[]) {
  const header = [
    'Event Name',
    'Organization',
    'Date',
    'Location',
    'Registration Status',
    'Price',
    'Registrations Count',
  ]

  const rows = events.map((e) => [
    e.name,
    e.organizationName,
    e.date,
    e.location,
    e.registrationStatus,
    String(e.price),
    String(e.registrationsCount),
  ])

  const csv = [header, ...rows]
    .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `events-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
