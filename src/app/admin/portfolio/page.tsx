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

interface PortfolioProject {
  id: string
  title: string
  slug: string
  clientName: string
  sportCategory: string
  projectType: string
  status: string
  featured: boolean
  createdAt: string
  thumbnailImage: string
}

export default function PortfolioManagement() {
  const [projects, setProjects] = useState<PortfolioProject[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      // In a real implementation, this would fetch from your API
      const mockProjects: PortfolioProject[] = [
        {
          id: '1',
          title: 'Football Club Website',
          slug: 'football-club-website',
          clientName: 'Denver United FC',
          sportCategory: 'football',
          projectType: 'website-redesign',
          status: 'completed',
          featured: true,
          createdAt: '2024-01-15',
          thumbnailImage: '/images/projects/football-club-thumb.jpg'
        },
        {
          id: '2',
          title: 'Basketball Tournament Platform',
          slug: 'basketball-tournament-platform',
          clientName: 'Colorado Basketball Association',
          sportCategory: 'basketball',
          projectType: 'event-platform',
          status: 'completed',
          featured: false,
          createdAt: '2024-02-20',
          thumbnailImage: '/images/projects/basketball-platform-thumb.jpg'
        },
        {
          id: '3',
          title: 'Soccer League Management',
          slug: 'soccer-league-management',
          clientName: 'Rocky Mountain Soccer',
          sportCategory: 'soccer',
          projectType: 'new-website',
          status: 'in-progress',
          featured: false,
          createdAt: '2024-03-10',
          thumbnailImage: '/images/projects/soccer-league-thumb.jpg'
        }
      ]
      setProjects(mockProjects)
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !filterCategory || project.sportCategory === filterCategory
    const matchesStatus = !filterStatus || project.status === filterStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleDelete = async (projectId: string) => {
    try {
      // In a real implementation, this would call your API
      console.log('Deleting project:', projectId)
      setProjects(prev => prev.filter(p => p.id !== projectId))
      setShowDeleteModal(false)
      setProjectToDelete(null)
    } catch (error) {
      console.error('Failed to delete project:', error)
    }
  }

  const categories = Array.from(new Set(projects.map(p => p.sportCategory)))
  const statuses = Array.from(new Set(projects.map(p => p.status)))

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Portfolio Management</h1>
        <p className="text-gray-600">Manage your portfolio projects and case studies</p>
        <div className="mt-4">
          <Link
            href="/admin/portfolio/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-950 hover:bg-blue-900"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Link>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlass className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-950 focus:border-blue-950 font-inter"
              />
            </div>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-950 focus:border-blue-950 font-inter"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-950 focus:border-blue-950 font-inter"
            >
              <option value="">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <button
              onClick={() => {
                setSearchTerm('')
                setFilterCategory('')
                setFilterStatus('')
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 font-inter"
            >
              <Funnel className="h-4 w-4 mr-2" />
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div key={project.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  {/* Project Image */}
                  <div className="h-48 bg-gray-200 relative">
                    <img
                      src={project.thumbnailImage}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/images/placeholder-project.jpg'
                      }}
                    />
                    {project.featured && (
                      <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-md font-medium">
                        Featured
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded-md">
                      {project.sportCategory}
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">{project.title}</h3>
                    <div className="mt-2 text-sm text-gray-600 font-inter">{project.clientName}</div>
                    
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500 font-inter">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-inter ${
                        project.status === 'published' 
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                      }`}>
                        {project.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Link
                        href={`/portfolio/${project.slug}`}
                        target="_blank"
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 font-inter"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Link>
                      <Link
                        href={`/admin/portfolio/${project.id}/edit`}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 font-inter"
                      >
                        <Pencil className="h-3 w-3 mr-1" />
                        Edit
                      </Link>
                      <button
                        onClick={() => {
                          setProjectToDelete(project.id)
                          setShowDeleteModal(true)
                        }}
                        className="inline-flex items-center px-3 py-1.5 border border-red-300 text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 font-inter"
                      >
                        <Trash className="h-3 w-3 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Funnel className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2 font-inter">No projects found</h3>
                <p className="text-gray-600 mb-4 font-inter">
                  {searchTerm || filterCategory || filterStatus 
                    ? 'Try adjusting your filters or search terms'
                    : 'Get started by creating your first portfolio project'
                  }
                </p>
                {!searchTerm && !filterCategory && !filterStatus && (
                  <Link
                    href="/admin/portfolio/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-950 hover:bg-blue-900 font-inter"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Project
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Delete Project
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this project? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setProjectToDelete(null)
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => projectToDelete && handleDelete(projectToDelete)}
                className="flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
