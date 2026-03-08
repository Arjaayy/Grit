'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CustomField {
  name: string
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'date'
  required: boolean
  options?: string[]
  placeholder?: string
  label?: string
}

interface Event {
  id: string
  name: string
  description?: string
  startDate: string
  endDate: string
  location?: string
  price: number
  currency: string
  earlyBirdPrice?: number
  earlyBirdDeadline?: string
  maxParticipants?: number
  customFields?: CustomField[]
}

interface RegistrationFormProps {
  event: Event
  apiKey: string
  onSuccess?: (registration: any) => void
  onError?: (error: string) => void
}

function RegistrationFormComponent({ event, apiKey, onSuccess, onError }: RegistrationFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    participantId: '', // Will be set to email
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    },
    medicalInfo: '',
    dietaryRestrictions: '',
    customResponses: {} as Record<string, any>
  })

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleCustomFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      customResponses: {
        ...prev.customResponses,
        [fieldName]: value
      }
    }))
  }

  const renderCustomField = (field: CustomField) => {
    const value = formData.customResponses[field.name] || ''

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
        return (
          <input
            type={field.type}
            id={field.name}
            name={field.name}
            value={value}
            onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )

      case 'textarea':
        return (
          <textarea
            id={field.name}
            name={field.name}
            value={value}
            onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )

      case 'select':
        return (
          <select
            id={field.name}
            name={field.name}
            value={value}
            onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
            required={field.required}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select...</option>
            {field.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        )

      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={field.name}
              name={field.name}
              checked={value}
              onChange={(e) => handleCustomFieldChange(field.name, e.target.checked)}
              required={field.required}
              className="mr-2"
            />
            <label htmlFor={field.name} className="text-sm text-gray-700">
              {field.label || field.name}
            </label>
          </div>
        )

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map(option => (
              <div key={option} className="flex items-center">
                <input
                  type="radio"
                  id={`${field.name}-${option}`}
                  name={field.name}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
                  required={field.required}
                  className="mr-2"
                />
                <label htmlFor={`${field.name}-${option}`} className="text-sm text-gray-700">
                  {option}
                </label>
              </div>
            ))}
          </div>
        )

      case 'date':
        return (
          <input
            type="date"
            id={field.name}
            name={field.name}
            value={value}
            onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
            required={field.required}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )

      default:
        return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Set participantId to email
      const registrationData = {
        ...formData,
        participantId: formData.email
      }

      // Create registration
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify({
          eventId: event.id,
          ...registrationData
        })
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Registration failed')
      }

      const registration = result.data

      // Process payment if required
      if (event.price > 0 && registration.paymentIntent) {
        if (!stripe || !elements) {
          throw new Error('Stripe not loaded')
        }

        const { error: paymentError } = await stripe.confirmCardPayment(
          registration.paymentIntent.clientSecret,
          {
            payment_method: {
              card: elements.getElement(CardElement),
              billing_details: {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email
              }
            }
          }
        )

        if (paymentError) {
          throw new Error(paymentError.message)
        }
      }

      onSuccess?.(registration)
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Registration failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getCurrentPrice = () => {
    if (event.earlyBirdPrice && event.earlyBirdDeadline && new Date() < new Date(event.earlyBirdDeadline)) {
      return event.earlyBirdPrice
    }
    return event.price
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Event Information */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">{event.name}</h3>
        {event.description && <p className="text-gray-600 mb-2">{event.description}</p>}
        <div className="text-sm text-gray-600">
          <p>📅 {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}</p>
          {event.location && <p>📍 {event.location}</p>}
          <p>💰 {getCurrentPrice()} {event.currency}</p>
        </div>
      </div>

      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Personal Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select...</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Emergency Contact</h3>
        
        <div>
          <label htmlFor="emergencyName" className="block text-sm font-medium text-gray-700 mb-1">
            Contact Name *
          </label>
          <input
            type="text"
            id="emergencyName"
            value={formData.emergencyContact.name}
            onChange={(e) => handleInputChange('emergencyContact.name', e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="emergencyPhone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              id="emergencyPhone"
              value={formData.emergencyContact.phone}
              onChange={(e) => handleInputChange('emergencyContact.phone', e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="emergencyRelationship" className="block text-sm font-medium text-gray-700 mb-1">
              Relationship *
            </label>
            <input
              type="text"
              id="emergencyRelationship"
              value={formData.emergencyContact.relationship}
              onChange={(e) => handleInputChange('emergencyContact.relationship', e.target.value)}
              required
              placeholder="e.g., Mother, Father, Guardian"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Additional Information</h3>
        
        <div>
          <label htmlFor="medicalInfo" className="block text-sm font-medium text-gray-700 mb-1">
            Medical Information or Conditions
          </label>
          <textarea
            id="medicalInfo"
            name="medicalInfo"
            value={formData.medicalInfo}
            onChange={(e) => handleInputChange('medicalInfo', e.target.value)}
            rows={3}
            placeholder="Please list any medical conditions, allergies, or medications we should be aware of..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="dietaryRestrictions" className="block text-sm font-medium text-gray-700 mb-1">
            Dietary Restrictions
          </label>
          <textarea
            id="dietaryRestrictions"
            name="dietaryRestrictions"
            value={formData.dietaryRestrictions}
            onChange={(e) => handleInputChange('dietaryRestrictions', e.target.value)}
            rows={2}
            placeholder="Please list any dietary restrictions or food allergies..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Custom Fields */}
      {event.customFields && event.customFields.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Additional Information</h3>
          {event.customFields.map((field, index) => (
            <div key={index}>
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
                {field.label || field.name} {field.required && '*'}
              </label>
              {renderCustomField(field)}
            </div>
          ))}
        </div>
      )}

      {/* Payment */}
      {getCurrentPrice() > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Payment Information</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">
              Registration Fee: <span className="font-semibold">{getCurrentPrice()} {event.currency}</span>
            </p>
            {event.earlyBirdPrice && event.earlyBirdDeadline && new Date() < new Date(event.earlyBirdDeadline) && (
              <p className="text-sm text-green-600">
                🎉 Early bird pricing! Save {event.price - event.earlyBirdPrice} {event.currency}
              </p>
            )}
          </div>
          <div className="border rounded-lg p-4">
            <CardElement options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              }
            }} />
          </div>
        </div>
      )}

      {/* Submit */}
      <div>
        <button
          type="submit"
          disabled={isSubmitting || !stripe}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Processing...' : `Register for ${getCurrentPrice()} ${event.currency}`}
        </button>
      </div>
    </form>
  )
}

export default function RegistrationForm(props: RegistrationFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <RegistrationFormComponent {...props} />
    </Elements>
  )
}
