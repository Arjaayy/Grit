'use client'

import * as React from 'react'
import { X, CheckCircle, Warning, Info } from '@phosphor-icons/react'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export type Notification = {
  id: string
  type: NotificationType
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
  dismissible?: boolean
}

type NotificationContextType = {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id'>) => string
  removeNotification: (id: string) => void
  clearAll: () => void
}

const NotificationContext = React.createContext<NotificationContextType | null>(null)

export function useNotifications() {
  const context = React.useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = React.useState<Notification[]>([])

  const removeNotification = React.useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const addNotification = React.useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration ?? 5000,
      dismissible: notification.dismissible ?? true
    }

    setNotifications(prev => [...prev, newNotification])

    // Auto-remove after duration
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }

    return id
  }, [removeNotification])

  const clearAll = React.useCallback(() => {
    setNotifications([])
  }, [])

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      removeNotification,
      clearAll
    }}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  )
}

function NotificationContainer() {
  const { notifications, removeNotification } = useNotifications()

  return (
    <div 
      className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  )
}

function NotificationItem({ 
  notification, 
  onClose 
}: { 
  notification: Notification
  onClose: () => void 
}) {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'error':
        return <Warning className="h-5 w-5 text-red-600" />
      case 'warning':
        return <Warning className="h-5 w-5 text-yellow-600" />
      case 'info':
        return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  const getStyles = () => {
    switch (notification.type) {
      case 'success':
        return 'border-green-200 bg-green-50 text-green-800'
      case 'error':
        return 'border-red-200 bg-red-50 text-red-800'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800'
      case 'info':
        return 'border-blue-200 bg-blue-50 text-blue-800'
    }
  }

  return (
    <div
      className={`
        relative flex items-start gap-3 p-4 rounded-lg border shadow-lg
        transition-all duration-300 ease-in-out
        animate-in slide-in-from-right-full
        ${getStyles()}
      `}
      role="alert"
      aria-labelledby={`notification-title-${notification.id}`}
      aria-describedby={notification.message ? `notification-message-${notification.id}` : undefined}
    >
      {getIcon()}
      <div className="flex-1 min-w-0">
        <h4 
          id={`notification-title-${notification.id}`}
          className="font-medium text-sm"
        >
          {notification.title}
        </h4>
        {notification.message && (
          <p 
            id={`notification-message-${notification.id}`}
            className="text-sm mt-1 opacity-90"
          >
            {notification.message}
          </p>
        )}
        {notification.action && (
          <button
            onClick={notification.action.onClick}
            className="text-sm font-medium mt-2 underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current rounded"
          >
            {notification.action.label}
          </button>
        )}
      </div>
      {notification.dismissible && (
        <button
          onClick={onClose}
          className="shrink-0 p-1 rounded-md hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current"
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

// Convenience functions for common notification types
export const notify = {
  success: (title: string, message?: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'title' | 'message'>>) => {
    const { addNotification } = useNotifications()
    return addNotification({ type: 'success', title, message, ...options })
  },
  error: (title: string, message?: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'title' | 'message'>>) => {
    const { addNotification } = useNotifications()
    return addNotification({ type: 'error', title, message, duration: 0, ...options })
  },
  warning: (title: string, message?: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'title' | 'message'>>) => {
    const { addNotification } = useNotifications()
    return addNotification({ type: 'warning', title, message, ...options })
  },
  info: (title: string, message?: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'title' | 'message'>>) => {
    const { addNotification } = useNotifications()
    return addNotification({ type: 'info', title, message, ...options })
  }
}

// Hook for async operations with automatic notifications
export function useNotifyAsync<T = unknown>() {
  const [isLoading, setIsLoading] = React.useState(false)
  const { addNotification } = useNotifications()

  const execute = React.useCallback(async (
    operation: () => Promise<T>,
    options: {
      successMessage?: string
      errorMessage?: string
      loadingMessage?: string
    } = {}
  ) => {
    setIsLoading(true)
    
    if (options.loadingMessage) {
      const loadingId = addNotification({
        type: 'info',
        title: options.loadingMessage,
        duration: 0
      })
    }

    try {
      const result = await operation()
      
      if (options.successMessage) {
        addNotification({
          type: 'success',
          title: 'Success',
          message: options.successMessage
        })
      }
      
      return result
    } catch (error) {
      const message = options.errorMessage || (error instanceof Error ? error.message : 'An error occurred')
      
      addNotification({
        type: 'error',
        title: 'Error',
        message,
        duration: 0
      })
      
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [addNotification])

  return {
    isLoading,
    execute
  }
}
