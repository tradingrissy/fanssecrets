import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as any
      const { fan_id, creator_id, tier_id, type, content_id, message, platform_fee, creator_payout } = session.metadata

      if (type === 'tip') {
        await supabaseAdmin.from('transactions').insert({
          fan_id, creator_id, amount: session.amount_total,
          platform_fee: parseInt(platform_fee),
          creator_payout: parseInt(creator_payout),
          type: 'tip', status: 'completed',
          stripe_payment_intent_id: session.payment_intent
        })
        await supabaseAdmin.from('notifications').insert({
          user_id: creator_id, type: 'new_tip',
          title: 'You received a tip!',
          body: `Someone tipped you $${(session.amount_total/100).toFixed(2)}${message ? `: "${message}"` : ''}`,
          related_user_id: fan_id
        })
      }

      else if (type === 'ppv') {
        await supabaseAdmin.from('transactions').insert({
          fan_id, creator_id, content_id,
          amount: session.amount_total,
          platform_fee: parseInt(platform_fee),
          creator_payout: parseInt(creator_payout),
          type: 'ppv', status: 'completed',
          stripe_payment_intent_id: session.payment_intent
        })
        await supabaseAdmin.from('notifications').insert({
          user_id: creator_id, type: 'ppv_unlock',
          title: 'Someone unlocked your content!',
          body: `A fan paid $${(session.amount_total/100).toFixed(2)} to unlock your post`,
          related_user_id: fan_id
        })
      }

      else {
        await supabaseAdmin.from('user_subscriptions').insert({
          fan_id, creator_id, tier_id,
          stripe_subscription_id: session.subscription,
          stripe_customer_id: session.customer,
          status: 'active',
          current_period_end: new Date(Date.now() + 30*24*60*60*1000).toISOString()
        })
        await supabaseAdmin.from('transactions').insert({
          fan_id, creator_id,
          amount: session.amount_total,
          platform_fee: Math.round(session.amount_total * 0.20),
          creator_payout: Math.round(session.amount_total * 0.80),
          type: 'subscription', status: 'completed',
          stripe_payment_intent_id: session.payment_intent
        })
        await supabaseAdmin.from('notifications').insert({
          user_id: creator_id, type: 'new_subscriber',
          title: 'New subscriber!',
          body: 'Someone just subscribed to your page',
          related_user_id: fan_id
        })
      }
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as any
      await supabaseAdmin.from('user_subscriptions')
        .update({ status: 'cancelled' })
        .eq('stripe_subscription_id', sub.id)
      break
    }

    case 'invoice.paid': {
      const invoice = event.data.object as any
      await supabaseAdmin.from('user_subscriptions')
        .update({
          status: 'active',
          current_period_end: new Date(invoice.lines.data[0].period.end * 1000).toISOString()
        })
        .eq('stripe_subscription_id', invoice.subscription)
      break
    }
  }

  return NextResponse.json({ received: true })
}