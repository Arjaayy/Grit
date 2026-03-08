'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Pencil,
  Eye,
  FileText,
  Globe,
  House,
  BuildingOffice,
  UserGroup,
  Phone
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface PageContent {
  id: string
  title: string
  slug: string
  path: string
  lastModified: string
  modifiedBy: string
  status: 'published' | 'draft'
  content: string
  metaTitle?: string
  metaDescription?: string
}

export default function ContentManagement() {
  const [pages, setPages] = useState<PageContent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPage, setSelectedPage] = useState<PageContent | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    try {
      // In a real implementation, this would fetch from your API
      const mockPages: PageContent[] = [
        {
          id: '1',
          title: 'Home',
          slug: 'home',
          path: '/',
          lastModified: '2024-03-15T10:30:00Z',
          modifiedBy: 'Admin User',
          status: 'published',
          content: 'Welcome to Grit Digital Performance...',
          metaTitle: 'Grit Digital Performance | Home',
          metaDescription: 'Leading digital performance agency for sports organizations'
        },
        {
          id: '2',
          title: 'About',
          slug: 'about',
          path: '/about',
          lastModified: '2024-03-14T15:45:00Z',
          modifiedBy: 'Admin User',
          status: 'published',
          content: 'About Grit Digital Performance...',
          metaTitle: 'About Grit Digital Performance',
          metaDescription: 'Learn more about our mission and team'
        },
        {
          id: '3',
          title: 'Services',
          slug: 'services',
          path: '/services',
          lastModified: '2024-03-13T09:20:00Z',
          modifiedBy: 'Admin User',
          status: 'published',
          content: 'Our services include...',
          metaTitle: 'Services - Grit Digital Performance',
          metaDescription: 'Digital performance services for sports organizations'
        },
        {
          id: '4',
          title: 'Contact',
          slug: 'contact',
          path: '/contact',
          lastModified: '2024-03-12T14:15:00Z',
          modifiedBy: 'Admin User',
          status: 'draft',
          content: 'Contact information...',
          metaTitle: 'Contact Grit Digital Performance',
          metaDescription: 'Get in touch with our team'
        }
      ]
      setPages(mockPages)
    } catch (error) {
      console.error('Failed to fetch pages:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPageIcon = (path: string) => {
    switch (path) {
      case '/':
        return <House className="h-4 w-4" />
      case '/about':
        return <BuildingOffice className="h-4 w-4" />
      case '/services':
        return <FileText className="h-4 w-4" />
      case '/contact':
        return <Phone className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Content Management</h2>
        </div>
        <Button className="bg-blue-950 hover:bg-blue-900">
          Create New Page
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pages.length}</div>
            <p className="text-xs text-muted-foreground">
              All website pages
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pages.filter(p => p.status === 'published').length}</div>
            <p className="text-xs text-muted-foreground">
              Live pages
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pages.filter(p => p.status === 'draft').length}</div>
            <p className="text-xs text-muted-foreground">
              Unpublished pages
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
            <Pencil className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pages.length > 0 ? new Date(Math.max(...pages.map(p => new Date(p.lastModified).getTime()))).toLocaleDateString() : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Most recent edit
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pages List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {pages.map((page) => (
              <div key={page.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      {getPageIcon(page.path)}
                      <div>
                        <h3 className="text-lg font-medium">{page.title}</h3>
                        <p className="text-sm text-muted-foreground">{page.path}</p>
                      </div>
                      <Badge variant={page.status === 'published' ? 'default' : 'secondary'}>
                        {page.status}
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Last modified: {new Date(page.lastModified).toLocaleDateString()}</span>
                      <span>By: {page.modifiedBy}</span>
                    </div>
                    {page.metaTitle && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        <strong>SEO Title:</strong> {page.metaTitle}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={page.path} target="_blank">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm">
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pages.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <FileText className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium mb-2">No pages found</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first page
              </p>
              <Button className="bg-blue-950 hover:bg-blue-900">
                Create Your First Page
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
