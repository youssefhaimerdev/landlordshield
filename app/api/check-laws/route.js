export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { fetchLandlordBills, getBillDetails, getBillText } from '@/lib/legiscan'
import { summarizeLaw } from '@/lib/gemini'
import { supabaseAdmin } from '@/lib/supabase'

// Called by Vercel Cron daily at 08:00 UTC (configured in vercel.json)
// Also callable manually: GET /api/check-laws  (with Authorization header)
export async function GET(request) {
  // Protect with a secret so only Vercel Cron (or you) can trigger it
  const auth = request.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = supabaseAdmin()

  // Start with the most legislatively active states.
  // Add more states as you scale.
  const STATES = ['CA','NY','WA','OR','MA','NJ','IL','FL','CO','MN','MD','PA','VA','NV','HI']
  const processed = []

  for (const state of STATES) {
    try {
      const bills = await fetchLandlordBills(state)

      for (const bill of bills.slice(0, 5)) {  // Max 5 per state per run
        // Skip if already in DB
        const { data: exists } = await db
          .from('law_alerts')
          .select('id')
          .eq('legiscan_bill_id', String(bill.bill_id))
          .maybeSingle()

        if (exists) continue

        // Get full bill details + text
        const details  = await getBillDetails(bill.bill_id)
        const billText = details?.texts?.length
          ? await getBillText(details.texts[0].doc_id)
          : bill.title

        // AI summary via Gemini
        const ai = await summarizeLaw(bill.title, billText, state)
        if (!ai) continue

        // Persist to Supabase
        const { data: alert, error } = await db
          .from('law_alerts')
          .insert({
            state,
            title:               bill.title,
            legiscan_bill_id:    String(bill.bill_id),
            source_url:          details?.url || '',
            plain_summary:       ai.summary,
            action_required:     ai.action,
            deadline:            ai.deadline || null,
            alert_level:         ai.alertLevel || 'medium',
            affects_types:       ai.affectsPropertyTypes || [],
          })
          .select()
          .single()

        if (error) { console.error('Insert error:', error); continue }

        processed.push({ state, title: bill.title, level: ai.alertLevel })

        // Fire alert emails for affected users
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-alerts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${process.env.CRON_SECRET}`,
          },
          body: JSON.stringify({ alertId: alert.id }),
        })
      }
    } catch (err) {
      console.error(`[check-laws] ${state} error:`, err.message)
    }
  }

  return NextResponse.json({ ok: true, processed: processed.length, alerts: processed })
}
