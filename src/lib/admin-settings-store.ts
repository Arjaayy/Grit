export type AdminSettings = {
  siteName: string
  siteUrl: string
  contactEmail: string
  supportEmail: string
  social: {
    twitter?: string
    instagram?: string
    facebook?: string
  }

  defaultCurrency: string
  registrationLimitDefault: number
  eventCategories: string[]

  stripePublishableKey: string
  stripeSecretKey: string
  paymentMode: 'test' | 'live'
  refundPolicy: string

  admins: { id: string; name: string; email: string; role: 'Owner' | 'Admin' | 'Editor' }[]

  defaultMetaTitle: string
  metaDescription: string
  openGraphImage: string
}

const STORAGE_KEY = 'grit_admin_settings_v1'

export const defaultAdminSettings: AdminSettings = {
  siteName: 'Grit Digital Performance',
  siteUrl: 'https://gritdigitalperformance.com',
  contactEmail: 'admin@gritdigitalperformance.com',
  supportEmail: 'support@gritdigitalperformance.com',
  social: {
    twitter: '',
    instagram: '',
    facebook: '',
  },

  defaultCurrency: 'USD',
  registrationLimitDefault: 100,
  eventCategories: ['Tournament', 'Camp', 'League'],

  stripePublishableKey: '',
  stripeSecretKey: '',
  paymentMode: 'test',
  refundPolicy: 'Refunds available up to 24 hours before event start.',

  admins: [
    { id: 'admin_1', name: 'Admin User', email: 'admin@gritdigitalperformance.com', role: 'Owner' },
  ],

  defaultMetaTitle: 'Grit Digital Performance',
  metaDescription: 'Digital performance systems for sports organizations.',
  openGraphImage: '/og.png',
}

function safeParse(json: string): AdminSettings | null {
  try {
    const value = JSON.parse(json)
    if (!value || typeof value !== 'object') return null
    return value as AdminSettings
  } catch {
    return null
  }
}

export function getAdminSettings(): AdminSettings {
  if (typeof window === 'undefined') return defaultAdminSettings
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return defaultAdminSettings
  return safeParse(raw) ?? defaultAdminSettings
}

export function setAdminSettings(settings: AdminSettings) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}
