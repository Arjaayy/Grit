'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Filter } from 'lucide-react'
import type { PortfolioFilter } from '@/lib/portfolio'

interface PortfolioFilterProps {
  onFilterChange: (filter: PortfolioFilter) => void
  sportCategories: { name: string; displayName: string }[]
  projectTypes: { name: string; displayName: string }[]
}

export default function PortfolioFilter({ onFilterChange, sportCategories, projectTypes }: PortfolioFilterProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const filter: PortfolioFilter = {
      search: searchTerm || undefined,
      sportCategory: selectedCategory,
      projectType: selectedType
    }
    onFilterChange(filter)
  }, [searchTerm, selectedCategory, selectedType, onFilterChange])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('all')
    setSelectedType('all')
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </form>

      {/* Filter Toggle */}
      <div className="text-center">
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="btn-outline"
        >
          <Filter className="w-4 h-4 mr-2" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="space-y-6 bg-white p-6 rounded-lg border border-slate-200">
          {/* Sport Category Filter */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Sport Category</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                className={selectedCategory === 'all' ? 'btn-primary' : 'btn-outline'}
                onClick={() => setSelectedCategory('all')}
              >
                All Sports
              </Button>
              {sportCategories.map((category) => (
                <Button
                  key={category.name}
                  size="sm"
                  variant={selectedCategory === category.name ? 'default' : 'outline'}
                  className={selectedCategory === category.name ? 'btn-primary' : 'btn-outline'}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  {category.displayName}
                </Button>
              ))}
            </div>
          </div>

          {/* Project Type Filter */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Project Type</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={selectedType === 'all' ? 'default' : 'outline'}
                className={selectedType === 'all' ? 'btn-primary' : 'btn-outline'}
                onClick={() => setSelectedType('all')}
              >
                All Types
              </Button>
              {projectTypes.map((type) => (
                <Button
                  key={type.name}
                  size="sm"
                  variant={selectedType === type.name ? 'default' : 'outline'}
                  className={selectedType === type.name ? 'btn-primary' : 'btn-outline'}
                  onClick={() => setSelectedType(type.name)}
                >
                  {type.displayName}
                </Button>
              ))}
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchTerm || selectedCategory !== 'all' || selectedType !== 'all') && (
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                    Search: {searchTerm}
                  </Badge>
                )}
                {selectedCategory !== 'all' && (
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                    Category: {sportCategories.find(c => c.name === selectedCategory)?.displayName}
                  </Badge>
                )}
                {selectedType !== 'all' && (
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                    Type: {projectTypes.find(t => t.name === selectedType)?.displayName}
                  </Badge>
                )}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={clearFilters}
                className="btn-outline"
              >
                Clear All
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
