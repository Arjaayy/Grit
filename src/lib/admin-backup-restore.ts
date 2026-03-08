import { getAdminEvents, setAdminEvents } from '@/lib/admin-events-store'
import { getAdminOrganizations, setAdminOrganizations } from '@/lib/admin-organizations-store'
import { getAdminParticipants, setAdminParticipants } from '@/lib/admin-participants-store'
import { getAdminPayments, setAdminPayments } from '@/lib/admin-payments-store'
import { getAdminSettings, setAdminSettings } from '@/lib/admin-settings-store'

type AdminBackup = {
  version: string
  timestamp: string
  data: {
    events: ReturnType<typeof getAdminEvents>
    organizations: ReturnType<typeof getAdminOrganizations>
    participants: ReturnType<typeof getAdminParticipants>
    payments: ReturnType<typeof getAdminPayments>
    settings: ReturnType<typeof getAdminSettings>
  }
}

export function createBackup(): AdminBackup {
  return {
    version: '1.0',
    timestamp: new Date().toISOString(),
    data: {
      events: getAdminEvents(),
      organizations: getAdminOrganizations(),
      participants: getAdminParticipants(),
      payments: getAdminPayments(),
      settings: getAdminSettings(),
    },
  }
}

export function restoreBackup(backup: AdminBackup): void {
  if (backup.version !== '1.0') {
    throw new Error('Unsupported backup version')
  }
  const { data } = backup
  setAdminEvents(data.events)
  setAdminOrganizations(data.organizations)
  setAdminParticipants(data.participants)
  setAdminPayments(data.payments)
  setAdminSettings(data.settings)
}

export function downloadBackup(): void {
  const backup = createBackup()
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `grit-admin-backup-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export async function importBackup(file: File): Promise<void> {
  const text = await file.text()
  const backup: AdminBackup = JSON.parse(text)
  restoreBackup(backup)
}
