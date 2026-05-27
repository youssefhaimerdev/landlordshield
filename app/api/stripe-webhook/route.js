export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'

// App Router already gives us the raw body via request.text() — no config needed.
export async function POST(request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const body = await request.text()
  const sig  = request.headers.get('stripe-signature')

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('[stripe-webhook] Invalid signature:', err.message)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  const db = supabaseAdmin()

  switch (event.type) {

    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub      = event.data.object
      const isActive = ['active', 'trialing'].includes(sub.status)
      await db
        .from('users')
        .update({
          subscription_tier:      isActive ? 'pro' : 'free',
          stripe_subscription_id: sub.id,
        })
        .eq('stripe_customer_id', sub.customer)
      break
    }

    case 'customer.subscription.deleted': {
      await db
        .from('users')
        .update({ subscription_tier: 'free', stripe_subscription_id: null })
        .eq('stripe_customer_id', event.data.object.customer)
      break
    }

    case 'checkout.session.completed': {
      const session    = event.data.object
      const customerId = session.customer
      const userId     = session.metadata?.userId
      if (userId && customerId) {
        await db.from('users').update({ stripe_customer_id: customerId }).eq('id', userId)
      }
      break
    }

    case 'invoice.payment_failed': {
      console.log('[stripe-webhook] Payment failed for:', event.data.object.customer)
      break
    }
  }

  return NextResponse.json({ received: true })
}
