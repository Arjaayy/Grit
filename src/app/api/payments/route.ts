import { NextRequest, NextResponse } from 'next/server'
import { confirmRegistration } from '@/lib/events-api'
import { constructWebhookEvent } from '@/lib/stripe'
import { eventsApiPrisma } from '@/lib/events-api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'Stripe signature required' }, { status: 400 })
    }

    // Construct and verify webhook event
    const event = constructWebhookEvent(body, signature)

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as any
        const registrationId = paymentIntent.metadata?.registrationId

        if (registrationId) {
          await confirmRegistration(registrationId, paymentIntent.id)
          
          // Send webhook notification to organization if configured
          const registration = await eventsApiPrisma.registration.findUnique({
            where: { id: registrationId },
            include: { event: { include: { organization: true } } }
          })

          if (registration?.event.organization.webhookUrl) {
            // Send webhook notification (implementation depends on requirements)
            console.log('Webhook notification sent to:', registration.event.organization.webhookUrl)
          }
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as any
        const registrationId = paymentIntent.metadata?.registrationId

        if (registrationId) {
          await eventsApiPrisma.registration.update({
            where: { id: registrationId },
            data: { status: 'cancelled' }
          })
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
