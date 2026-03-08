'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Plus,
  Pencil,
  Trash,
  Eye,
  MagnifyingGlass,
  Funnel
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { LoadingState } from '@/components/admin/loading-states'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import AdminPageHeader from '@/components/admin/admin-page-header'
import { formatDateShort } from '@/lib/admin-utils'
import {
  deletePortfolioProject,
  getPortfolioProjects,
  AdminPortfolioProject,
} from '@/lib/admin-portfolio-store'

export default function PortfolioManagement() {
  const [projects, setProjects] = useState<AdminPortfolioProject[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterOrganization, setFilterOrganization] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortKey, setSortKey] = useState<
    'title' | 'clientName' | 'projectType' | 'status' | 'createdAt'
  >('createdAt')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setProjects(getPortfolioProjects())
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = projects
    .filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.clientName.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory =
        filterCategory === 'all' ||
        !filterCategory ||
        project.projectType === filterCategory

      const matchesOrg =
        filterOrganization === 'all' ||
        !filterOrganization ||
        project.clientName === filterOrganization

      const matchesStatus =
        filterStatus === 'all' || !filterStatus || project.status === filterStatus

      return matchesSearch && matchesCategory && matchesOrg && matchesStatus
    })
    .sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]
      const dir = sortDir === 'asc' ? 1 : -1

      if (sortKey === 'createdAt') {
        const aTime = new Date(aVal).getTime()
        const bTime = new Date(bVal).getTime()
        return (aTime - bTime) * dir
      }

      return String(aVal).localeCompare(String(bVal)) * dir
    })

  const handleDelete = async (projectId: string) => {
    try {
      // In a real implementation, this would call your API
      console.log('Deleting project:', projectId)
      deletePortfolioProject(projectId)
      setProjects(getPortfolioProjects())
      setShowDeleteModal(false)
      setProjectToDelete(null)
    } catch (error) {
      console.error('Failed to delete project:', error)
    }
  }

  const categories = Array.from(new Set(projects.map(p => p.projectType)))
  const organizations = Array.from(new Set(projects.map(p => p.clientName)))
  const statuses = Array.from(new Set(projects.map(p => p.status)))

  if (loading) {
    return <LoadingState type="page" message="Loading portfolio projects..." />
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-4">
      <AdminPageHeader
        title="Portfolio"
        description="Manage showcase projects for sports organizations"
        actions={
          <Button asChild size="sm">
            <Link href="/admin/portfolio/new">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Add Project</span>
              <span className="sm:hidden">New</span>
            </Link>
          </Button>
        }
      />

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterOrganization} onValueChange={setFilterOrganization}>
              <SelectTrigger>
                <SelectValue placeholder="All Organizations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Organizations</SelectItem>
                {organizations.map(org => (
                  <SelectItem key={org} value={org}>{org}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('')
                setFilterCategory('all')
                setFilterOrganization('all')
                setFilterStatus('all')
              }}
            >
              <Funnel className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Projects Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">
                    <button
                      type="button"
                      className="inline-flex items-center"
                      onClick={() => {
                        setSortKey('title')
                        setSortDir((d) => (sortKey === 'title' ? (d === 'asc' ? 'desc' : 'asc') : 'asc'))
                      }}
                    >
                      Project Name
                    </button>
                  </TableHead>
                  <TableHead className="min-w-[120px] hidden sm:table-cell">
                    <button
                      type="button"
                      className="inline-flex items-center"
                      onClick={() => {
                        setSortKey('clientName')
                        setSortDir((d) =>
                          sortKey === 'clientName' ? (d === 'asc' ? 'desc' : 'asc') : 'asc'
                        )
                      }}
                    >
                      Organization
                    </button>
                  </TableHead>
                  <TableHead className="min-w-[100px] hidden md:table-cell">
                    <button
                      type="button"
                      className="inline-flex items-center"
                      onClick={() => {
                        setSortKey('projectType')
                        setSortDir((d) =>
                          sortKey === 'projectType' ? (d === 'asc' ? 'desc' : 'asc') : 'asc'
                        )
                      }}
                    >
                      Category
                    </button>
                  </TableHead>
                  <TableHead className="min-w-[80px]">Status</TableHead>
                  <TableHead className="min-w-[100px] hidden lg:table-cell">
                    <button
                      type="button"
                      className="inline-flex items-center"
                      onClick={() => {
                        setSortKey('createdAt')
                        setSortDir((d) =>
                          sortKey === 'createdAt' ? (d === 'asc' ? 'desc' : 'asc') : 'desc'
                        )
                      }}
                    >
                      Created Date
                    </button>
                  </TableHead>
                  <TableHead className="min-w-[120px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate font-medium">{project.title}</span>
                          {project.featured ? (
                            <Badge variant="secondary" className="text-xs">
                              Featured
                            </Badge>
                          ) : null}
                        </div>
                        <div className="text-xs text-muted-foreground sm:hidden">
                          {project.clientName}
                        </div>
                        <div className="flex items-center gap-2 sm:hidden">
                          <Badge variant="outline" className="text-xs">
                            {project.projectType}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {project.sportCategory}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{project.clientName}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {project.projectType}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {project.sportCategory}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={project.status === 'completed' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{formatDateShort(project.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col sm:flex-row sm:inline-flex items-center gap-1 sm:gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/portfolio/${project.id}`}>
                            <Eye className="h-3 w-3 mr-1" />
                            <span className="hidden sm:inline">View</span>
                            <span className="sm:hidden">V</span>
                          </Link>
                        </Button>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/portfolio/${project.id}/edit`}>
                            <Pencil className="h-3 w-3 mr-1" />
                            <span className="hidden sm:inline">Edit</span>
                            <span className="sm:hidden">E</span>
                          </Link>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setProjectToDelete(project.id)
                            setShowDeleteModal(true)
                          }}
                        >
                          <Trash className="h-3 w-3 mr-1" />
                          <span className="hidden sm:inline">Delete</span>
                          <span className="sm:hidden">D</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <Funnel className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium mb-2">No projects found</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                {searchTerm || filterCategory || filterStatus 
                  ? 'Try adjusting your filters or search terms'
                  : 'Get started by creating your first portfolio project'
                }
              </p>
              {!searchTerm && !filterCategory && !filterStatus && (
                <Button asChild size="sm">
                  <Link href="/admin/portfolio/new">
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Add Your First Project</span>
                    <span className="sm:hidden">Add Project</span>
                  </Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false)
                setProjectToDelete(null)
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => projectToDelete && handleDelete(projectToDelete)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
