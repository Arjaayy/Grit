'use client'

import React, { createContext, useContext, useCallback } from 'react'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface NotificationOptions {
  title?: string
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

type NotificationContextType = {
  notify: (type: NotificationType, options: NotificationOptions) => void
  success: (options: NotificationOptions) => void
  error: (options: NotificationOptions) => void
  warning: (options: NotificationOptions) => void
  info: (options: NotificationOptions) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function useNotifications() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider')
  return ctx
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const notify = useCallback((type: NotificationType, options: NotificationOptions) => {
    const { title, description, duration, action } = options
    const message = title || description || ''
    const descriptionText = title && description ? description : undefined

    switch (type) {
      case 'success':
        sonnerToast.success(message, {
          description: descriptionText,
          duration,
          action: action ? { label: action.label, onClick: action.onClick } : undefined,
        })
        break
      case 'error':
        sonnerToast.error(message, {
          description: descriptionText,
          duration,
          action: action ? { label: action.label, onClick: action.onClick } : undefined,
        })
        break
      case 'warning':
        sonnerToast.warning(message, {
          description: descriptionText,
          duration,
          action: action ? { label: action.label, onClick: action.onClick } : undefined,
        })
        break
      case 'info':
        sonnerToast.info(message, {
          description: descriptionText,
          duration,
          action: action ? { label: action.label, onClick: action.onClick } : undefined,
        })
        break
    }
  }, [])

  const success = useCallback((options: NotificationOptions) => notify('success', options), [notify])
  const error = useCallback((options: NotificationOptions) => notify('error', options), [notify])
  const warning = useCallback((options: NotificationOptions) => notify('warning', options), [notify])
  const info = useCallback((options: NotificationOptions) => notify('info', options), [notify])

  return (
    <NotificationContext.Provider value={{ notify, success, error, warning, info }}>
      {children}
    </NotificationContext.Provider>
  )
}
