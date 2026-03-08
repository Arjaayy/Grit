'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

type LoadingStateProps = {
  type?: 'page' | 'card' | 'table' | 'chart' | 'form'
  message?: string
  className?: string
}

export function LoadingState({ 
  type = 'page', 
  message = 'Loading...', 
  className 
}: LoadingStateProps) {
  if (type === 'page') {
    return (
      <div className={`flex items-center justify-center min-h-[400px] p-4 ${className}`}>
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground">{message}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (type === 'card') {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-10 w-1/2" />
        </CardContent>
      </Card>
    )
  }

  if (type === 'table') {
    return (
      <Card className={className}>
        <CardContent className="p-0">
          <div className="space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/5" />
                <Skeleton className="h-4 w-1/6" />
                <Skeleton className="h-8 w-20 ml-auto" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (type === 'chart') {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
        </CardHeader>
        <CardContent>
          <div className="h-[200px] sm:h-[220px] flex items-center justify-center">
            <div className="animate-pulse space-y-2 w-full">
              <div className="h-4 bg-muted rounded w-1/4 mx-auto"></div>
              <div className="h-32 bg-muted rounded mx-auto"></div>
              <div className="flex justify-between px-4">
                <div className="h-3 bg-muted rounded w-8"></div>
                <div className="h-3 bg-muted rounded w-8"></div>
                <div className="h-3 bg-muted rounded w-8"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (type === 'form') {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/5" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/6" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-24 w-full" />
          </div>
          <div className="flex gap-2 pt-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-20" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      <span className="ml-2 text-sm text-muted-foreground">{message}</span>
    </div>
  )
}

type LoadingSpinnerProps = {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  return (
    <div className={`animate-spin rounded-full border-b-2 border-primary ${sizeClasses[size]} ${className}`}></div>
  )
}

// Hook for managing loading states in async operations
export function useAsyncOperation<T = unknown>() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)
  const [data, setData] = React.useState<T | null>(null)

  const execute = React.useCallback(async (operation: () => Promise<T>) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await operation()
      setData(result)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred')
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = React.useCallback(() => {
    setIsLoading(false)
    setError(null)
    setData(null)
  }, [])

  return {
    isLoading,
    error,
    data,
    execute,
    reset
  }
}
