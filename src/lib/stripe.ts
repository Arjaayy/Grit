import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-10-28.acacia',
  typescript: true,
})

export interface StripePaymentIntent {
  clientSecret: string
  paymentIntentId: string
}

export interface CreatePaymentIntentParams {
  amount: number
  currency?: string
  metadata?: Record<string, string>
  eventId?: string
  registrationId?: string
}

export async function createPaymentIntent(params: CreatePaymentIntentParams): Promise<StripePaymentIntent> {
  const { amount, currency = 'usd', metadata, eventId, registrationId } = params

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        ...metadata,
        ...(eventId && { eventId }),
        ...(registrationId && { registrationId }),
        service: 'event-registration-api'
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return {
      clientSecret: paymentIntent.client_secret!,
      paymentIntentId: paymentIntent.id,
    }
  } catch (error) {
    console.error('Error creating payment intent:', error)
    throw new Error('Failed to create payment intent')
  }
}

export async function confirmPayment(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    return paymentIntent
  } catch (error) {
    console.error('Error confirming payment:', error)
    throw new Error('Failed to confirm payment')
  }
}

export async function createRefund(paymentIntentId: string, amount?: number): Promise<Stripe.Refund> {
  try {
    const refundParams: Stripe.RefundCreateParams = {
      payment_intent: paymentIntentId,
    }

    if (amount) {
      refundParams.amount = Math.round(amount * 100) // Convert to cents
    }

    const refund = await stripe.refunds.create(refundParams)
    return refund
  } catch (error) {
    console.error('Error creating refund:', error)
    throw new Error('Failed to create refund')
  }
}

export async function retrievePaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    return paymentIntent
  } catch (error) {
    console.error('Error retrieving payment intent:', error)
    throw new Error('Failed to retrieve payment intent')
  }
}

// Webhook handler for Stripe events
export function constructWebhookEvent(payload: string, signature: string): Stripe.Event {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not configured')
  }

  return stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET)
}
