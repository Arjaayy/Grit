'use client'

import * as React from 'react'

export type KeyboardShortcut = {
  key: string
  ctrlKey?: boolean
  metaKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  action: () => void
  description?: string
}

export function useKeyboardNavigation(shortcuts: KeyboardShortcut[]) {
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const {
          key,
          ctrlKey = false,
          metaKey = false,
          shiftKey = false,
          altKey = false,
          action
        } = shortcut

        if (
          event.key.toLowerCase() === key.toLowerCase() &&
          event.ctrlKey === ctrlKey &&
          event.metaKey === metaKey &&
          event.shiftKey === shiftKey &&
          event.altKey === altKey
        ) {
          event.preventDefault()
          event.stopPropagation()
          action()
          break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}

// Hook for focus management in modal/dialog contexts
export function useFocusTrap(isActive: boolean) {
  const containerRef = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
    if (!isActive || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }

    container.addEventListener('keydown', handleTabKey)
    firstElement.focus()

    return () => {
      container.removeEventListener('keydown', handleTabKey)
    }
  }, [isActive])

  return containerRef
}

// Hook for managing keyboard navigation in lists/grids
export function useListKeyboardNavigation<T>(
  items: T[],
  onSelect?: (item: T) => void,
  options: {
    orientation?: 'horizontal' | 'vertical'
    loop?: boolean
  } = {}
) {
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const { orientation = 'vertical', loop = true } = options

  const handleKeyDown = React.useCallback((event: KeyboardEvent) => {
    const isVertical = orientation === 'vertical'
    const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight'
    const prevKey = isVertical ? 'ArrowUp' : 'ArrowLeft'

    switch (event.key) {
      case nextKey:
        event.preventDefault()
        setSelectedIndex(prev => {
          const next = prev + 1
          if (next >= items.length) {
            return loop ? 0 : prev
          }
          return next
        })
        break

      case prevKey:
        event.preventDefault()
        setSelectedIndex(prev => {
          const prevIndex = prev - 1
          if (prevIndex < 0) {
            return loop ? items.length - 1 : prev
          }
          return prevIndex
        })
        break

      case 'Home':
        event.preventDefault()
        setSelectedIndex(0)
        break

      case 'End':
        event.preventDefault()
        setSelectedIndex(items.length - 1)
        break

      case 'Enter':
      case ' ':
        event.preventDefault()
        if (items[selectedIndex] && onSelect) {
          onSelect(items[selectedIndex])
        }
        break
    }
  }, [items, selectedIndex, orientation, loop, onSelect])

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return {
    selectedIndex,
    setSelectedIndex,
    handleKeyDown
  }
}

// Hook for managing keyboard navigation in forms
export function useFormKeyboardNavigation(onSubmit?: () => void) {
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Submit form with Ctrl/Cmd + Enter
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault()
        onSubmit?.()
      }

      // Navigate between form fields with Tab (handled by browser)
      // Escape to close modal/dialog (handled by parent component)
    }

    const form = document.querySelector('form')
    if (form) {
      form.addEventListener('keydown', handleKeyDown)
      return () => form.removeEventListener('keydown', handleKeyDown)
    }
  }, [onSubmit])
}
