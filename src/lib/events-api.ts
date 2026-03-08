import { PrismaClient } from '@prisma/client'
import { stripe, createPaymentIntent, confirmPayment, createRefund } from './stripe'
import type { 
  Organization, 
  Event, 
  Registration, 
  Transaction 
} from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  eventsApiPrisma: PrismaClient | undefined
}

export const eventsApiPrisma = globalForPrisma.eventsApiPrisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.eventsApiPrisma = eventsApiPrisma

// Types for API responses
export interface CreateEventParams {
  organizationId: string
  name: string
  description?: string
  startDate: Date
  endDate: Date
  location?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  virtual?: boolean
  maxParticipants?: number
  price: number
  currency?: string
  earlyBirdPrice?: number
  earlyBirdDeadline?: Date
  registrationStart: Date
  registrationEnd: Date
  waitlistEnabled?: boolean
  requiresApproval?: boolean
  customFields?: any[]
}

export interface CreateRegistrationParams {
  eventId: string
  organizationId: string
  participantId: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  dateOfBirth?: Date
  gender?: string
  emergencyContact?: any
  medicalInfo?: string
  dietaryRestrictions?: string
  customResponses?: any
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Organization Management
export async function createOrganization(data: {
  name: string
  email: string
  phone?: string
  website?: string
  sportCategory: string
  billingEmail: string
}): Promise<ApiResponse<Organization>> {
  try {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    
    const organization = await eventsApiPrisma.organization.create({
      data: {
        ...data,
        slug,
        apiKey: `org_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }
    })

    return { success: true, data: organization }
  } catch (error) {
    console.error('Error creating organization:', error)
    return { success: false, error: 'Failed to create organization' }
  }
}

export async function getOrganizationByApiKey(apiKey: string): Promise<ApiResponse<Organization>> {
  try {
    const organization = await eventsApiPrisma.organization.findUnique({
      where: { apiKey },
      include: {
        events: true,
        registrations: true
      }
    })

    if (!organization) {
      return { success: false, error: 'Organization not found' }
    }

    return { success: true, data: organization }
  } catch (error) {
    console.error('Error fetching organization:', error)
    return { success: false, error: 'Failed to fetch organization' }
  }
}

// Event Management
export async function createEvent(params: CreateEventParams): Promise<ApiResponse<Event>> {
  try {
    const slug = params.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    
    const event = await eventsApiPrisma.event.create({
      data: {
        ...params,
        slug,
        customFields: params.customFields || []
      }
    })

    return { success: true, data: event }
  } catch (error) {
    console.error('Error creating event:', error)
    return { success: false, error: 'Failed to create event' }
  }
}

export async function getEvent(eventId: string, organizationId?: string): Promise<ApiResponse<Event>> {
  try {
    const event = await eventsApiPrisma.event.findFirst({
      where: {
        id: eventId,
        ...(organizationId && { organizationId })
      },
      include: {
        organization: true,
        registrations: {
          where: { status: 'confirmed' }
        }
      }
    })

    if (!event) {
      return { success: false, error: 'Event not found' }
    }

    return { success: true, data: event }
  } catch (error) {
    console.error('Error fetching event:', error)
    return { success: false, error: 'Failed to fetch event' }
  }
}

export async function updateEvent(eventId: string, organizationId: string, data: Partial<Event>): Promise<ApiResponse<Event>> {
  try {
    const event = await eventsApiPrisma.event.update({
      where: { 
        id: eventId,
        organizationId 
      },
      data
    })

    return { success: true, data: event }
  } catch (error) {
    console.error('Error updating event:', error)
    return { success: false, error: 'Failed to update event' }
  }
}

export async function listEvents(organizationId: string, status?: string): Promise<ApiResponse<Event[]>> {
  try {
    const events = await eventsApiPrisma.event.findMany({
      where: {
        organizationId,
        ...(status && { status })
      },
      include: {
        _count: {
          select: { registrations: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return { success: true, data: events }
  } catch (error) {
    console.error('Error listing events:', error)
    return { success: false, error: 'Failed to list events' }
  }
}

// Registration Management
export async function createRegistration(params: CreateRegistrationParams): Promise<ApiResponse<Registration & { paymentIntent?: any }>> {
  try {
    // Check if event exists and is available for registration
    const event = await getEvent(params.eventId)
    if (!event.success || !event.data) {
      return { success: false, error: 'Event not found' }
    }

    // Check registration limits
    if (event.data.maxParticipants) {
      const confirmedRegistrations = await eventsApiPrisma.registration.count({
        where: {
          eventId: params.eventId,
          status: 'confirmed'
        }
      })

      if (confirmedRegistrations >= event.data.maxParticipants) {
        if (!event.data.waitlistEnabled) {
          return { success: false, error: 'Event is full' }
        }
        params.status = 'waitlisted'
      }
    }

    // Check if participant is already registered
    const existingRegistration = await eventsApiPrisma.registration.findFirst({
      where: {
        eventId: params.eventId,
        participantId: params.participantId
      }
    })

    if (existingRegistration) {
      return { success: false, error: 'Participant already registered' }
    }

    // Determine price (early bird vs regular)
    let price = event.data.price
    if (event.data.earlyBirdPrice && event.data.earlyBirdDeadline && new Date() < event.data.earlyBirdDeadline) {
      price = event.data.earlyBirdPrice
    }

    // Create registration
    const registration = await eventsApiPrisma.registration.create({
      data: {
        ...params,
        amount: price,
        currency: event.data.currency,
        status: params.requiresApproval ? 'pending' : 'confirmed'
      }
    })

    // Create payment intent if payment is required
    let paymentIntent = null
    if (price > 0) {
      paymentIntent = await createPaymentIntent({
        amount: Number(price),
        currency: event.data.currency,
        eventId: params.eventId,
        registrationId: registration.id
      })

      // Update registration with payment intent ID
      await eventsApiPrisma.registration.update({
        where: { id: registration.id },
        data: { paymentIntentId: paymentIntent.paymentIntentId }
      })
    }

    return { 
      success: true, 
      data: { 
        ...registration, 
        paymentIntent 
      } 
    }
  } catch (error) {
    console.error('Error creating registration:', error)
    return { success: false, error: 'Failed to create registration' }
  }
}

export async function confirmRegistration(registrationId: string, paymentIntentId: string): Promise<ApiResponse<Registration>> {
  try {
    // Confirm payment with Stripe
    const payment = await confirmPayment(paymentIntentId)
    
    if (payment.status !== 'succeeded') {
      return { success: false, error: 'Payment not successful' }
    }

    // Update registration
    const registration = await eventsApiPrisma.registration.update({
      where: { id: registrationId },
      data: {
        paid: true,
        paidAt: new Date(),
        status: 'confirmed'
      }
    })

    // Create transaction record
    await createTransaction({
      registrationId,
      stripePaymentId: paymentIntentId,
      amount: registration.amount,
      currency: registration.currency,
      status: 'completed'
    })

    return { success: true, data: registration }
  } catch (error) {
    console.error('Error confirming registration:', error)
    return { success: false, error: 'Failed to confirm registration' }
  }
}

export async function getRegistration(registrationId: string, organizationId?: string): Promise<ApiResponse<Registration>> {
  try {
    const registration = await eventsApiPrisma.registration.findFirst({
      where: {
        id: registrationId,
        ...(organizationId && { organizationId })
      },
      include: {
        event: true
      }
    })

    if (!registration) {
      return { success: false, error: 'Registration not found' }
    }

    return { success: true, data: registration }
  } catch (error) {
    console.error('Error fetching registration:', error)
    return { success: false, error: 'Failed to fetch registration' }
  }
}

export async function listRegistrations(eventId: string, organizationId: string, status?: string): Promise<ApiResponse<Registration[]>> {
  try {
    const registrations = await eventsApiPrisma.registration.findMany({
      where: {
        eventId,
        organizationId,
        ...(status && { status })
      },
      orderBy: { createdAt: 'desc' }
    })

    return { success: true, data: registrations }
  } catch (error) {
    console.error('Error listing registrations:', error)
    return { success: false, error: 'Failed to list registrations' }
  }
}

// Transaction Management
export async function createTransaction(data: {
  registrationId: string
  stripePaymentId: string
  amount: number
  currency: string
  status: string
}): Promise<ApiResponse<Transaction>> {
  try {
    // Calculate revenue sharing (5% royalty to Grit)
    const royaltyRate = 0.05
    const gritAmount = data.amount * royaltyRate
    const organizationAmount = data.amount - gritAmount

    const transaction = await eventsApiPrisma.transaction.create({
      data: {
        ...data,
        fee: data.amount * 0.029 + 0.3, // Stripe fee (2.9% + $0.30)
        netAmount: data.amount - (data.amount * 0.029 + 0.3),
        gritAmount,
        organizationAmount,
        royaltyRate,
        completedAt: data.status === 'completed' ? new Date() : null
      }
    })

    return { success: true, data: transaction }
  } catch (error) {
    console.error('Error creating transaction:', error)
    return { success: false, error: 'Failed to create transaction' }
  }
}

export async function refundRegistration(registrationId: string, amount?: number): Promise<ApiResponse<Transaction>> {
  try {
    const registration = await getRegistration(registrationId)
    if (!registration.success || !registration.data) {
      return { success: false, error: 'Registration not found' }
    }

    if (!registration.data.paymentIntentId) {
      return { success: false, error: 'No payment found for this registration' }
    }

    // Create refund with Stripe
    const refund = await createRefund(registration.data.paymentIntentId, amount)

    // Update registration
    await eventsApiPrisma.registration.update({
      where: { id: registrationId },
      data: {
        status: 'refunded',
        cancelledAt: new Date(),
        refundAmount: amount ? amount : registration.data.amount
      }
    })

    // Create refund transaction record
    const transaction = await createTransaction({
      registrationId,
      stripePaymentId: refund.id,
      amount: -(amount || Number(registration.data.amount)),
      currency: registration.data.currency,
      status: 'refunded'
    })

    return { success: true, data: transaction }
  } catch (error) {
    console.error('Error refunding registration:', error)
    return { success: false, error: 'Failed to refund registration' }
  }
}

// Revenue tracking
export async function getRevenueReport(organizationId: string, startDate?: Date, endDate?: Date): Promise<ApiResponse<{
  totalRevenue: number
  totalTransactions: number
  totalRoyalties: number
  organizationRevenue: number
  averageTransactionValue: number
}>> {
  try {
    const where: any = {
      registration: {
        organizationId
      }
    }

    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = startDate
      if (endDate) where.createdAt.lte = endDate
    }

    const transactions = await eventsApiPrisma.transaction.findMany({
      where,
      include: {
        registration: true
      }
    })

    const totalRevenue = transactions.reduce((sum, t) => sum + Number(t.amount), 0)
    const totalRoyalties = transactions.reduce((sum, t) => sum + Number(t.gritAmount), 0)
    const organizationRevenue = transactions.reduce((sum, t) => sum + Number(t.organizationAmount), 0)
    const totalTransactions = transactions.length
    const averageTransactionValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0

    return {
      success: true,
      data: {
        totalRevenue,
        totalTransactions,
        totalRoyalties,
        organizationRevenue,
        averageTransactionValue
      }
    }
  } catch (error) {
    console.error('Error generating revenue report:', error)
    return { success: false, error: 'Failed to generate revenue report' }
  }
}
