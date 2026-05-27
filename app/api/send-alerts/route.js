export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendLawAlert } from '@/lib/resend'

export async function POST(request) {
  const auth = request.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { alertId } = await request.json()
  const db = supabaseAdmin()

  // Load the alert
  const { data: alert, error: alertErr } = await db
    .from('law_alerts')
    .select('*')
    .eq('id', alertId)
    .single()

  if (alertErr || !alert) {
    return NextResponse.json({ error: 'Alert not found' }, { status: 404 })
  }

  // Find users who monitor this state (via their properties table)
  const { data: props } = await db
    .from('properties')
    .select('user_id, users(email, name, subscription_tier)')
    .eq('state', alert.state)

  if (!props?.length) return NextResponse.json({ sent: 0 })

  // De-duplicate users (one user may have multiple properties in the state)
  const seen = new Set()
  const users = []
  for (const p of props) {
    if (!seen.has(p.user_id) && p.users) {
      seen.add(p.user_id)
      users.push({ userId: p.user_id, ...p.users })
    }
  }

  let sent = 0
  for (const user of users) {
    // Free tier: only send urgent (high) alerts in real-time; others go in monthly digest
    if (user.subscription_tier === 'free' && alert.alert_level !== 'high') continue

    try {
      await sendLawAlert({
        to:         user.email,
        userName:   user.name,
        state:      alert.state,
        lawTitle:   alert.title,
        summary:    alert.plain_summary,
        action:     alert.action_required,
        deadline:   alert.deadline,
        alertLevel: alert.alert_level,
      })

      // Log so we don't double-send
      await db.from('user_alerts').insert({
        user_id:      user.userId,
        law_alert_id: alertId,
        sent_at:      new Date().toISOString(),
      })

      sent++
    } catch (err) {
      console.error(`[send-alerts] Failed for ${user.email}:`, err.message)
    }
  }

  return NextResponse.json({ sent })
}
