"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  ArrowUpDown, 
  ChevronUp,
  ChevronDown
} from "lucide-react"

interface TableColumn {
  key: string
  title: string
  sortable?: boolean
  render?: (value: any, row: any) => React.ReactNode
}

interface TableProps {
  data: any[]
  columns: TableColumn[]
  onSort?: (column: string, direction: 'asc' | 'desc') => void
  sortColumn?: string
  sortDirection?: 'asc' | 'desc'
  onRowClick?: (row: any) => void
  className?: string
}

export function DataTable({ 
  data, 
  columns, 
  onSort, 
  sortColumn, 
  sortDirection, 
  onRowClick, 
  className = "" 
}: TableProps) {
  const handleSort = (column: string) => {
    const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc'
    onSort?.(column, newDirection)
  }

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />
    }
    return sortDirection === 'asc' ? 
      <ChevronUp className="ml-2 h-4 w-4" /> : 
      <ChevronDown className="ml-2 h-4 w-4" />
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Data Table</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {data.length} items
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  {columns.map((column) => (
                    <th 
                      key={column.key}
                      className="text-left p-3 font-medium"
                      onClick={column.sortable ? () => handleSort(column.key) : undefined}
                    >
                      <div className="flex items-center space-x-1">
                        {column.title}
                        {column.sortable && getSortIcon(column.key)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr 
                    key={index}
                    className="border-b hover:bg-muted/50 cursor-pointer"
                    onClick={() => onRowClick?.(row)}
                  >
                    {columns.map((column) => (
                      <td key={column.key} className="p-3">
                        {column.render ? column.render(row[column.key], row) : row[column.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between px-2 py-4">
          <div className="text-sm text-muted-foreground">
            Showing {data.length} items
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {/* Handle previous page */}}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {/* Handle next page */}}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface ResponsiveTableProps extends TableProps {
  pageSize?: number
}

export function ResponsiveTable({ 
  data, 
  columns, 
  onSort, 
  sortColumn, 
  sortDirection, 
  onRowClick, 
  pageSize = 10,
  className = "" 
}: ResponsiveTableProps) {
  const [currentPage, setCurrentPage] = React.useState(1)
  const totalPages = Math.ceil(data.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, data.length)
  const paginatedData = data.slice(startIndex, endIndex)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Responsive Data Table</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Mobile View */}
        <div className="md:hidden">
          <div className="space-y-2">
            {paginatedData.map((row, index) => (
              <div 
                key={index}
                className="border rounded-lg p-4 space-y-2"
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <div key={column.key} className="flex justify-between">
                    <span className="font-medium">{column.title}:</span>
                    <span className="text-sm text-muted-foreground">
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          
          {/* Mobile Pagination */}
          <div className="flex items-center justify-between p-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block">
          <DataTable 
            data={paginatedData}
            columns={columns}
            onSort={onSort}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onRowClick={onRowClick}
          />
          
          {/* Desktop Pagination */}
          <div className="flex items-center justify-between px-2 py-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                Page
              </span>
              <Select value={currentPage.toString()} onValueChange={(value) => setCurrentPage(parseInt(value))}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
