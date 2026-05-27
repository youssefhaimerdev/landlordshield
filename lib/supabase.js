import { createClient } from '@supabase/supabase-js'

// ── Lazy factory functions ─────────────────────────────────────
// createClient() is only called at request-time, never at module-import time.
// This prevents "supabaseUrl is required" errors during Next.js build.

export const getSupabase = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

export const supabaseAdmin = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

// ── Auth helpers (used by client-side pages) ──────────────────
export const signUp  = (email, password) => getSupabase().auth.signUp({ email, password })
export const signIn  = (email, password) => getSupabase().auth.signInWithPassword({ email, password })
export const signOut = ()                => getSupabase().auth.signOut()

export async function getSession() {
  const { data } = await getSupabase().auth.getSession()
  return data.session
}

// ── Data helpers ───────────────────────────────────────────────
export async function getUserProfile(userId) {
  const { data } = await getSupabase().from('users').select('*').eq('id', userId).single()
  return data
}

export async function getUserProperties(userId) {
  const { data } = await getSupabase().from('properties').select('*').eq('user_id', userId)
  return data || []
}

export async function getAlertsForStates(states) {
  const { data } = await getSupabase()
    .from('law_alerts').select('*').in('state', states)
    .order('created_at', { ascending: false }).limit(50)
  return data || []
}
