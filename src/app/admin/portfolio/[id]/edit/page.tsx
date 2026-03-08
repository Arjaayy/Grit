'use client'

import { useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { FloppyDisk } from '@phosphor-icons/react'
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
  getPortfolioProjectById,
  upsertPortfolioProject,
} from '@/lib/admin-portfolio-store'

export default function EditPortfolioProjectPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const id = params?.id

  const existing = useMemo(() => {
    return id ? [getPortfolioProjectById(id)].filter(Boolean) as AdminPortfolioProject[] : []
  }, [id])

  const [project, setProject] = useState<AdminPortfolioProject | null>(() => {
    if (!id) return null
    return getPortfolioProjectById(id)
  })

  const canSave = Boolean(project?.title?.trim() && project?.clientName?.trim())

  const handleSave = () => {
    if (!project || !canSave) return
    upsertPortfolioProject(project)
    router.push('/admin/portfolio')
  }

  if (!project) {
    return (
      <div className="flex-1 space-y-4 p-4 pt-4">
        <AdminPageHeader title="Edit Project" description="Project not found" />
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-4">
      <AdminPageHeader
        title="Edit Portfolio Project"
        description={project.title}
        actions={
          <Button onClick={handleSave} disabled={!canSave}>
            <FloppyDisk className="h-4 w-4 mr-2" />
            Save
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
              value={project.title}
              onChange={(e) => setProject({ ...project, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientName">Organization</Label>
            <Input
              id="clientName"
              value={project.clientName}
              onChange={(e) => setProject({ ...project, clientName: e.target.value })}
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
            <Select
              value={project.projectType}
              onValueChange={(v) => setProject({ ...project, projectType: v })}
            >
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
            <Select
              value={project.sportCategory}
              onValueChange={(v) => setProject({ ...project, sportCategory: v })}
            >
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
            <Select
              value={project.status}
              onValueChange={(v) => setProject({ ...project, status: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Featured</Label>
            <Select
              value={project.featured ? 'yes' : 'no'}
              onValueChange={(v) => setProject({ ...project, featured: v === 'yes' })}
            >
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
              value={project.thumbnailImage}
              onChange={(e) => setProject({ ...project, thumbnailImage: e.target.value })}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={project.description ?? ''}
              onChange={(e) => setProject({ ...project, description: e.target.value })}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="technologies">Technologies Used</Label>
            <Input
              id="technologies"
              value={project.technologies ?? ''}
              onChange={(e) => setProject({ ...project, technologies: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
