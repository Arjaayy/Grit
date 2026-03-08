'use client'

import { useMemo, useState } from 'react'
import { Gear } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
import {
  defaultAdminSettings,
  getAdminSettings,
  setAdminSettings,
  type AdminSettings,
} from '@/lib/admin-settings-store'

export default function SettingsPage() {
  const [settings, updateSettings] = useState<AdminSettings>(() => getAdminSettings())
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [active, setActive] = useState<'general' | 'event' | 'payment' | 'admin' | 'seo'>(
    'general'
  )

  const canSave = useMemo(() => {
    return Boolean(
      settings.siteName.trim() &&
        settings.siteUrl.trim() &&
        settings.contactEmail.trim() &&
        settings.supportEmail.trim()
    )
  }, [settings])

  const handleSave = async () => {
    if (!canSave) return
    setSaving(true)
    try {
      setAdminSettings(settings)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    updateSettings(defaultAdminSettings)
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-4">
      <AdminPageHeader
        title="Settings"
        description="System configuration"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button onClick={handleSave} disabled={!canSave || saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        }
      />

      {saved && (
        <div className="flex items-center gap-2 text-sm">
          <Gear className="h-4 w-4" />
          <span>Settings saved</span>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-[220px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Sections</CardTitle>
            <CardDescription>Configure the system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant={active === 'general' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActive('general')}
            >
              General
            </Button>
            <Button
              variant={active === 'event' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActive('event')}
            >
              Event
            </Button>
            <Button
              variant={active === 'payment' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActive('payment')}
            >
              Payment
            </Button>
            <Button
              variant={active === 'admin' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActive('admin')}
            >
              Admin
            </Button>
            <Button
              variant={active === 'seo' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActive('seo')}
            >
              SEO
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {active === 'general' ? (
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Site name, branding, and contact</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => updateSettings({ ...settings, siteName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteUrl">Site URL</Label>
                  <Input
                    id="siteUrl"
                    value={settings.siteUrl}
                    onChange={(e) => updateSettings({ ...settings, siteUrl: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact email</Label>
                  <Input
                    id="contactEmail"
                    value={settings.contactEmail}
                    onChange={(e) => updateSettings({ ...settings, contactEmail: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Support email</Label>
                  <Input
                    id="supportEmail"
                    value={settings.supportEmail}
                    onChange={(e) => updateSettings({ ...settings, supportEmail: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    value={settings.social.twitter ?? ''}
                    onChange={(e) =>
                      updateSettings({
                        ...settings,
                        social: { ...settings.social, twitter: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={settings.social.instagram ?? ''}
                    onChange={(e) =>
                      updateSettings({
                        ...settings,
                        social: { ...settings.social, instagram: e.target.value },
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          ) : null}

          {active === 'event' ? (
            <Card>
              <CardHeader>
                <CardTitle>Event Settings</CardTitle>
                <CardDescription>Defaults for events and registration</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Default currency</Label>
                  <Select
                    value={settings.defaultCurrency}
                    onValueChange={(v) => updateSettings({ ...settings, defaultCurrency: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regLimit">Registration limit (default)</Label>
                  <Input
                    id="regLimit"
                    type="number"
                    min={0}
                    value={settings.registrationLimitDefault}
                    onChange={(e) =>
                      updateSettings({
                        ...settings,
                        registrationLimitDefault: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="categories">Event categories (comma-separated)</Label>
                  <Input
                    id="categories"
                    value={settings.eventCategories.join(', ')}
                    onChange={(e) =>
                      updateSettings({
                        ...settings,
                        eventCategories: e.target.value
                          .split(',')
                          .map((c) => c.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          ) : null}

          {active === 'payment' ? (
            <Card>
              <CardHeader>
                <CardTitle>Payment Settings</CardTitle>
                <CardDescription>Stripe configuration and policies</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="stripePk">Stripe publishable key</Label>
                  <Input
                    id="stripePk"
                    value={settings.stripePublishableKey}
                    onChange={(e) =>
                      updateSettings({ ...settings, stripePublishableKey: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stripeSk">Stripe secret key</Label>
                  <Input
                    id="stripeSk"
                    value={settings.stripeSecretKey}
                    onChange={(e) => updateSettings({ ...settings, stripeSecretKey: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Payment mode</Label>
                  <Select
                    value={settings.paymentMode}
                    onValueChange={(v) =>
                      updateSettings({
                        ...settings,
                        paymentMode: v as AdminSettings['paymentMode'],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="test">Test</SelectItem>
                      <SelectItem value="live">Live</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="refund">Refund policy</Label>
                  <Textarea
                    id="refund"
                    value={settings.refundPolicy}
                    onChange={(e) => updateSettings({ ...settings, refundPolicy: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          ) : null}

          {active === 'admin' ? (
            <Card>
              <CardHeader>
                <CardTitle>Admin Settings</CardTitle>
                <CardDescription>Manage admins, roles & permissions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {settings.admins.map((a) => (
                  <div
                    key={a.id}
                    className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{a.name}</p>
                      <p className="text-xs text-muted-foreground">{a.email}</p>
                    </div>
                    <Badge variant={a.role === 'Owner' ? 'default' : 'secondary'}>{a.role}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : null}

          {active === 'seo' ? (
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>Metadata and Open Graph defaults</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="metaTitle">Default meta title</Label>
                  <Input
                    id="metaTitle"
                    value={settings.defaultMetaTitle}
                    onChange={(e) => updateSettings({ ...settings, defaultMetaTitle: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="metaDesc">Meta description</Label>
                  <Textarea
                    id="metaDesc"
                    value={settings.metaDescription}
                    onChange={(e) => updateSettings({ ...settings, metaDescription: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="ogImage">Open Graph image URL</Label>
                  <Input
                    id="ogImage"
                    value={settings.openGraphImage}
                    onChange={(e) => updateSettings({ ...settings, openGraphImage: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  )
}
