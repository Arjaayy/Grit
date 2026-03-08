import { validateEmail, validatePhone, validateCurrency, validateRequired } from '@/lib/admin-validation'
import * as React from 'react'

export type ValidationResult = {
  isValid: boolean
  error?: string
}

export type FieldValidator = (value: unknown) => ValidationResult

export type FormFieldConfig = {
  name: string
  label: string
  type?: 'text' | 'email' | 'tel' | 'url' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio'
  placeholder?: string
  required?: boolean
  validation?: {
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
    pattern?: RegExp
    custom?: (value: unknown) => string | undefined
  }
  options?: Array<{ value: string; label: string }>
  description?: string
}

export type FormConfig<T = unknown> = {
  fields: FormFieldConfig[]
  onSubmit?: (data: T) => Promise<void> | void
  submitText?: string
  resetOnSubmit?: boolean
}

export const validators: Record<string, FieldValidator> = {
  required: (value: unknown): ValidationResult => ({
    isValid: validateRequired(String(value)),
    error: validateRequired(String(value)) ? undefined : 'This field is required',
  }),
  email: (value: string): ValidationResult => ({
    isValid: validateEmail(value),
    error: validateEmail(value) ? undefined : 'Please enter a valid email address',
  }),
  phone: (value: string): ValidationResult => ({
    isValid: validatePhone(value),
    error: validatePhone(value) ? undefined : 'Please enter a valid phone number (e.g., (555) 123-4567)',
  }),
  currency: (value: string): ValidationResult => ({
    isValid: validateCurrency(value),
    error: validateCurrency(value) ? undefined : 'Please enter a valid amount (e.g., 99.99)',
  }),
  positiveCurrency: (value: string): ValidationResult => {
    const valid = validateCurrency(value) && Number(value) > 0
    return {
      isValid: valid,
      error: valid ? undefined : 'Please enter a positive amount',
    }
  },
  minLength: (value: string, min: number): ValidationResult => {
    const valid = !value || value.length >= min
    return {
      isValid: valid,
      error: valid ? undefined : `Must be at least ${min} characters`,
    }
  },
  maxLength: (value: string, max: number): ValidationResult => {
    const valid = !value || value.length <= max
    return {
      isValid: valid,
      error: valid ? undefined : `Must not exceed ${max} characters`,
    }
  },
  min: (value: number, min: number): ValidationResult => {
    const valid = value === undefined || value >= min
    return {
      isValid: valid,
      error: valid ? undefined : `Must be at least ${min}`,
    }
  },
  max: (value: number, max: number): ValidationResult => {
    const valid = value === undefined || value <= max
    return {
      isValid: valid,
      error: valid ? undefined : `Must not exceed ${max}`,
    }
  },
}

export function validateField(value: unknown, config: FormFieldConfig): ValidationResult {
  const { label, required, validation, type } = config

  // Required validation
  if (required) {
    const requiredResult = validators.required(value)
    if (!requiredResult.isValid) {
      return { isValid: false, error: `${label} is required` }
    }
  }

  // Skip other validations if field is empty and not required
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { isValid: true }
  }

  // Type-specific validations
  if (type === 'email') {
    const result = validators.email(String(value))
    if (!result.isValid) return result
  }

  if (type === 'tel') {
    const result = validators.phone(String(value))
    if (!result.isValid) return result
  }

  // Custom validation rules
  if (validation) {
    const { minLength, maxLength, min, max, pattern, custom } = validation

    if (minLength !== undefined && typeof value === 'string') {
      const result = validators.minLength(value, minLength)
      if (!result.isValid) return result
    }

    if (maxLength !== undefined && typeof value === 'string') {
      const result = validators.maxLength(value, maxLength)
      if (!result.isValid) return result
    }

    if (min !== undefined && typeof value === 'number') {
      const result = validators.min(value, min)
      if (!result.isValid) return result
    }

    if (max !== undefined && typeof value === 'number') {
      const result = validators.max(value, max)
      if (!result.isValid) return result
    }

    if (pattern && typeof value === 'string') {
      const valid = pattern.test(value)
      if (!valid) {
        return { isValid: false, error: `${label} format is invalid` }
      }
    }

    if (custom) {
      const customError = custom(value)
      if (customError) {
        return { isValid: false, error: customError }
      }
    }
  }

  return { isValid: true }
}

export function validateForm<T extends Record<string, unknown>>(
  values: T,
  config: FormConfig<T>
): Record<keyof T, ValidationResult> {
  const results = {} as Record<keyof T, ValidationResult>
  
  for (const field of config.fields) {
    results[field.name as keyof T] = validateField(values[field.name], field)
  }
  
  return results
}

export function hasFormErrors<T extends Record<string, unknown>>(
  results: Record<keyof T, ValidationResult>
): boolean {
  return Object.values(results).some((r) => !r.isValid)
}

// Hook for form management
export function useForm<T = unknown>(config: FormConfig<T>) {
  const [formData, setFormData] = React.useState<Record<string, unknown>>(() => {
    const initial: Record<string, any> = {}
    config.fields.forEach(field => {
      initial[field.name] = field.type === 'checkbox' ? false : ''
    })
    return initial
  })

  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitError, setSubmitError] = React.useState<string | null>(null)

  const updateField = React.useCallback((name: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error for this field when value changes
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }, [errors])

  const validateField = React.useCallback((name: string) => {
    const field = config.fields.find(f => f.name === name)
    if (!field) return

    const result = validateField(formData[name], field)
    if (!result.isValid) {
      setErrors(prev => ({ ...prev, [name]: result.error || 'Invalid value' }))
    } else {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }, [formData, config.fields])

  const validateForm = React.useCallback(() => {
    const results = validateForm(formData, config)
    const hasErrors = hasFormErrors(results)
    
    const newErrors: Record<string, string> = {}
    Object.entries(results).forEach(([field, result]) => {
      if (!result.isValid && result.error) {
        newErrors[field] = result.error
      }
    })
    
    setErrors(newErrors)
    return !hasErrors
  }, [formData, config])

  const handleSubmit = React.useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault()
    
    const isValid = validateForm()
    if (!isValid) return

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      await config.onSubmit?.(formData as T)
      
      if (config.resetOnSubmit) {
        const resetData: Record<string, any> = {}
        config.fields.forEach(field => {
          resetData[field.name] = field.type === 'checkbox' ? false : ''
        })
        setFormData(resetData)
      }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An unexpected error occurred'
      setSubmitError(error)
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, config, validateForm])

  const reset = React.useCallback(() => {
    const resetData: Record<string, any> = {}
    config.fields.forEach(field => {
      resetData[field.name] = field.type === 'checkbox' ? false : ''
    })
    setFormData(resetData)
    setErrors({})
    setSubmitError(null)
  }, [config.fields])

  return {
    formData,
    errors,
    isSubmitting,
    submitError,
    updateField,
    validateField,
    validateForm,
    handleSubmit,
    reset
  }
}
