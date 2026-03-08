'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from '@phosphor-icons/react'
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
import {
  AdminPortfolioProject,
  getPortfolioProjects,
  upsertPortfolioProject,
} from '@/lib/admin-portfolio-store'

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export default function NewPortfolioProjectPage() {
  const router = useRouter()

  const existing = useMemo(() => getPortfolioProjects(), [])

  const [title, setTitle] = useState('')
  const [clientName, setClientName] = useState('')
  const [sportCategory, setSportCategory] = useState('football')
  const [projectType, setProjectType] = useState('website-redesign')
  const [status, setStatus] = useState('draft')
  const [featured, setFeatured] = useState(false)
  const [thumbnailImage, setThumbnailImage] = useState('')
  const [description, setDescription] = useState('')
  const [technologies, setTechnologies] = useState('')

  const canSave = title.trim().length > 0 && clientName.trim().length > 0

  const handleCreate = () => {
    if (!canSave) return

    const id = `p_${Date.now()}`
    const slug = slugify(title)

    const project: AdminPortfolioProject = {
      id,
      title: title.trim(),
      slug,
      clientName: clientName.trim(),
      sportCategory,
      projectType,
      status,
      featured,
      createdAt: new Date().toISOString().slice(0, 10),
      thumbnailImage: thumbnailImage.trim() || '/images/placeholder-project.jpg',
      description: description.trim() || undefined,
      technologies: technologies.trim() || undefined,
    }

    upsertPortfolioProject(project)
    router.push('/admin/portfolio')
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-4">
      <AdminPageHeader
        title="New Portfolio Project"
        description="Create a new showcase project"
        actions={
          <Button onClick={handleCreate} disabled={!canSave}>
            <Plus className="h-4 w-4 mr-2" />
            Create Project
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Project Name</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Tournament Registration Platform"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientName">Organization</Label>
            <Input
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g. Denver United FC"
              list="orgs"
            />
            <datalist id="orgs">
              {Array.from(new Set(existing.map((p) => p.clientName))).map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={projectType} onValueChange={setProjectType}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="website-redesign">Website</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="event-platform">Event Platform</SelectItem>
                <SelectItem value="new-website">New Website</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Sport Category</Label>
            <Select value={sportCategory} onValueChange={setSportCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select sport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="football">Football</SelectItem>
                <SelectItem value="basketball">Basketball</SelectItem>
                <SelectItem value="soccer">Soccer</SelectItem>
                <SelectItem value="baseball">Baseball</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Featured</Label>
            <Select value={featured ? 'yes' : 'no'} onValueChange={(v) => setFeatured(v === 'yes')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="yes">Yes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="thumbnail">Thumbnail Image URL</Label>
            <Input
              id="thumbnail"
              value={thumbnailImage}
              onChange={(e) => setThumbnailImage(e.target.value)}
              placeholder="/images/projects/my-project.jpg or https://..."
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short project description..."
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="technologies">Technologies Used</Label>
            <Input
              id="technologies"
              value={technologies}
              onChange={(e) => setTechnologies(e.target.value)}
              placeholder="e.g. Next.js, TailwindCSS, Stripe"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
