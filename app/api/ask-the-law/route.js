export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { answerLandlordQuestion } from '@/lib/gemini'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request) {
  const { question, state, userId } = await request.json()

  if (!question?.trim() || !state) {
    return NextResponse.json({ error: 'question and state are required' }, { status: 400 })
  }

  const db = supabaseAdmin()

  // Fetch recent law alerts for this state to give Gemini context
  const { data: recentAlerts } = await db
    .from('law_alerts')
    .select('title, plain_summary, deadline')
    .eq('state', state)
    .order('created_at', { ascending: false })
    .limit(5)

  const context = recentAlerts?.length
    ? recentAlerts.map(a => `- ${a.title}: ${a.plain_summary}${a.deadline ? ` (Deadline: ${a.deadline})` : ''}`).join('\n')
    : 'No recent changes tracked for this state.'

  const answer = await answerLandlordQuestion(question, state, context)

  // Log anonymised query for analytics (no PII stored)
  if (userId) {
    await db.from('ai_queries').insert({
      user_id:     userId,
      state,
      created_at:  new Date().toISOString(),
    }).catch(() => {}) // Non-critical, swallow errors
  }

  return NextResponse.json({ answer })
}
