'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { useParams } from 'next/navigation'
import { Pencil } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AdminPageHeader from '@/components/admin/admin-page-header'
import { getPortfolioProjectById } from '@/lib/admin-portfolio-store'
import { formatDateShort } from '@/lib/admin-utils'

export default function AdminPortfolioProjectDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id

  const project = useMemo(() => {
    if (!id) return null
    return getPortfolioProjectById(id)
  }, [id])

  if (!project) {
    return (
      <div className="flex-1 space-y-4 p-4 pt-4">
        <AdminPageHeader title="Portfolio Project" description="Project not found" />
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-4">
      <AdminPageHeader
        title={project.title}
        description={project.clientName}
        actions={
          <Button asChild variant="outline">
            <Link href={`/admin/portfolio/${project.id}/edit`}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{project.projectType}</Badge>
              <Badge variant="secondary">{project.sportCategory}</Badge>
              <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>
                {project.status}
              </Badge>
              {project.featured ? <Badge variant="secondary">Featured</Badge> : null}
            </div>

            {project.description ? (
              <div className="text-sm text-muted-foreground">{project.description}</div>
            ) : (
              <div className="text-sm text-muted-foreground">No description.</div>
            )}

            {project.technologies ? (
              <div className="text-sm">
                <span className="text-muted-foreground">Technologies: </span>
                {project.technologies}
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Created: </span>
              {formatDateShort(project.createdAt)}
            </div>
            <div>
              <span className="text-muted-foreground">Slug: </span>
              <span className="font-mono text-xs">{project.slug}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Thumbnail: </span>
              <span className="font-mono text-xs">{project.thumbnailImage}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
