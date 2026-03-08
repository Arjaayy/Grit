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
          content: '<h1>Welcome to Grit Digital Performance</h1>',
          metaTitle: 'Grit Digital Performance - Sports Website Development',
          metaDescription: 'Professional website development for sports organizations'
        },
        {
          id: '2',
          title: 'About Us',
          slug: 'about',
          path: '/about',
          lastModified: '2024-03-14T15:45:00Z',
          modifiedBy: 'Admin User',
          status: 'published',
          content: '<h1>About Our Agency</h1>',
          metaTitle: 'About Grit Digital Performance',
          metaDescription: 'Learn about our mission to create amazing sports websites'
        },
        {
          id: '3',
          title: 'Services',
          slug: 'services',
          path: '/services',
          lastModified: '2024-03-13T09:20:00Z',
          modifiedBy: 'Admin User',
          status: 'published',
          content: '<h1>Our Services</h1>',
          metaTitle: 'Website Development Services for Sports Organizations',
          metaDescription: 'Complete web development solutions for sports teams and organizations'
        },
        {
          id: '4',
          title: 'Portfolio',
          slug: 'portfolio',
          path: '/portfolio',
          lastModified: '2024-03-12T14:15:00Z',
          modifiedBy: 'Admin User',
          status: 'published',
          content: '<h1>Our Portfolio</h1>',
          metaTitle: 'Portfolio - Grit Digital Performance',
          metaDescription: 'View our portfolio of sports website projects'
        },
        {
          id: '5',
          title: 'Contact',
          slug: 'contact',
          path: '/contact',
          lastModified: '2024-03-11T11:30:00Z',
          modifiedBy: 'Admin User',
          status: 'published',
          content: '<h1>Contact Us</h1>',
          metaTitle: 'Contact Grit Digital Performance',
          metaDescription: 'Get in touch with our team for your sports website project'
        }
      ]
      setPages(mockPages)
    } catch (error) {
      console.error('Failed to fetch pages:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPageIcon = (slug: string) => {
    switch (slug) {
      case 'home':
        return <House className="h-5 w-5" />
      case 'about':
        return <BuildingOffice className="h-5 w-5" />
      case 'services':
        return <UserGroup className="h-5 w-5" />
      case 'portfolio':
        return <Globe className="h-5 w-5" />
      case 'contact':
        return <Phone className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const handleEdit = (page: PageContent) => {
    setSelectedPage(page)
    setIsEditing(true)
  }

  const handleSave = async (updatedPage: PageContent) => {
    try {
      // In a real implementation, this would call your API
      console.log('Saving page:', updatedPage)
      setPages(prev => prev.map(p => p.id === updatedPage.id ? updatedPage : p))
      setIsEditing(false)
      setSelectedPage(null)
    } catch (error) {
      console.error('Failed to save page:', error)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setSelectedPage(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (isEditing && selectedPage) {
    return <PageEditor page={selectedPage} onSave={handleSave} onCancel={handleCancel} />
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
        <p className="text-gray-600">Manage website pages and content</p>
        <div className="mt-4">
          <Link
            href="/admin/content/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-950 hover:bg-blue-900"
          >
            <FileText className="h-4 w-4 mr-2" />
            Create Page
          </Link>
        </div>
      </div>

      {/* Pages List */}
      <div>
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-4">
              {pages.map((page) => (
                <div key={page.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 text-gray-400">
                        {getPageIcon(page.slug)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-medium text-gray-900">{page.title}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-inter ${
                            page.status === 'published' 
                              ? 'bg-green-500 text-white'
                              : 'bg-red-500 text-white'
                          }`}>
                            {page.status}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500 font-inter">
                          <span>{page.path}</span>
                          <span>•</span>
                          <span>Last modified: {new Date(page.lastModified).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>By {page.modifiedBy}</span>
                        </div>
                        {page.metaTitle && (
                          <div className="mt-2 text-sm text-gray-600 font-inter">
                            <span className="font-medium">SEO Title:</span> {page.metaTitle}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link
                        href={page.path}
                        target="_blank"
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 font-inter"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Link>
                      <button
                        onClick={() => handleEdit(page)}
                        className="inline-flex items-center px-3 py-1.5 border border-blue-950 text-xs font-medium rounded text-blue-950 bg-white hover:bg-blue-50 font-inter"
                      >
                        <Pencil className="h-3 w-3 mr-1" />
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {pages.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <FileText className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2 font-inter">No pages found</h3>
                <p className="text-gray-600 mb-4 font-inter">
                  Get started by creating your first page
                </p>
                <Link
                  href="/admin/content/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-950 hover:bg-blue-900 font-inter"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Create Your First Page
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface PageEditorProps {
  page: PageContent
  onSave: (page: PageContent) => void
  onCancel: () => void
}

function PageEditor({ page, onSave, onCancel }: PageEditorProps) {
  const [editedPage, setEditedPage] = useState<PageContent>(page)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave({
        ...editedPage,
        lastModified: new Date().toISOString(),
        modifiedBy: 'Admin User'
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Page: {page.title}</h1>
              <p className="text-gray-600">Modify page content and settings</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onCancel}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Page Title */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Page Content</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Page Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={editedPage.title}
                    onChange={(e) => setEditedPage({ ...editedPage, title: e.target.value })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    id="slug"
                    value={editedPage.slug}
                    onChange={(e) => setEditedPage({ ...editedPage, slug: e.target.value })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    id="content"
                    value={editedPage.content}
                    onChange={(e) => setEditedPage({ ...editedPage, content: e.target.value })}
                    rows={15}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter HTML content or markdown..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Page Settings */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Page Settings</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    value={editedPage.status}
                    onChange={(e) => setEditedPage({ ...editedPage, status: e.target.value as 'published' | 'draft' })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="path" className="block text-sm font-medium text-gray-700 mb-1">
                    URL Path
                  </label>
                  <input
                    type="text"
                    id="path"
                    value={editedPage.path}
                    onChange={(e) => setEditedPage({ ...editedPage, path: e.target.value })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* SEO Settings */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    id="metaTitle"
                    value={editedPage.metaTitle || ''}
                    onChange={(e) => setEditedPage({ ...editedPage, metaTitle: e.target.value })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="SEO title (60 chars max)"
                  />
                </div>

                <div>
                  <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Description
                  </label>
                  <textarea
                    id="metaDescription"
                    value={editedPage.metaDescription || ''}
                    onChange={(e) => setEditedPage({ ...editedPage, metaDescription: e.target.value })}
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="SEO description (160 chars max)"
                  />
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Preview</h2>
              <div className="space-y-2">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">URL:</span> {editedPage.path}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Status:</span> 
                  <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    editedPage.status === 'published' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {editedPage.status}
                  </span>
                </div>
                {editedPage.metaTitle && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">SEO Title:</span> {editedPage.metaTitle}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
