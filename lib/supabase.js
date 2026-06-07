import { createClient } from '@supabase/supabase-js'

const getSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export const supabaseAdmin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// ── Auth ──────────────────────────────────────────────────────
export async function signUpWithEmail(email, password, name) {
  return getSupabase().auth.signUp({
    email,
    password,
    options: { data: { name } },
  })
}

export async function signInWithEmail(email, password) {
  return getSupabase().auth.signInWithPassword({ email, password })
}

export async function signInWithGoogle() {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  return getSupabase().auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })
}

export async function signOut() {
  return getSupabase().auth.signOut()
}

export async function getSession() {
  const { data } = await getSupabase().auth.getSession()
  return data.session
}

export async function getCurrentUser() {
  const { data } = await getSupabase().auth.getUser()
  return data.user
}

export async function exchangeCode(code) {
  return getSupabase().auth.exchangeCodeForSession(code)
}

// ── User profile ──────────────────────────────────────────────
export async function getUserProfile(userId) {
  const { data } = await getSupabase()
    .from('users').select('*').eq('id', userId).single()
  return data
}

export async function markOnboarded(userId) {
  return getSupabase()
    .from('users')
    .update({ onboarded_at: new Date().toISOString() })
    .eq('id', userId)
}

// ── Properties ────────────────────────────────────────────────
export async function saveUserProperties(userId, states, propTypes) {
  await getSupabase().from('properties').delete().eq('user_id', userId)
  const rows = states.flatMap(state =>
    (propTypes.length > 0 ? propTypes : ['general']).map(property_type => ({
      user_id: userId,
      state,
      property_type,
    }))
  )
  return getSupabase().from('properties').insert(rows)
}

export async function getUserProperties(userId) {
  const { data } = await getSupabase()
    .from('properties').select('*').eq('user_id', userId)
  return data || []
}

// ── Law alerts ────────────────────────────────────────────────
export async function getAlertsForStates(states) {
  const { data } = await getSupabase()
    .from('law_alerts').select('*').in('state', states)
    .order('created_at', { ascending: false }).limit(50)
  return data || []
}
