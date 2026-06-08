import { createClient } from '@supabase/supabase-js'

// ── Singleton client — one instance shared across the whole app ──
let _client = null

export function getSupabase() {
  if (_client) return _client
  _client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession:   true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'ls-auth',
      },
    }
  )
  return _client
}

export const supabaseAdmin = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

// ── Auth ──────────────────────────────────────────────────────
export async function signUpWithEmail(email, password, name) {
  return getSupabase().auth.signUp({ email, password, options: { data: { name } } })
}

export async function signInWithEmail(email, password) {
  return getSupabase().auth.signInWithPassword({ email, password })
}

export async function signInWithGoogle() {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  return getSupabase().auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${origin}/auth/callback` },
  })
}

export async function signOut() {
  return getSupabase().auth.signOut()
}

export async function getSession() {
  const { data } = await getSupabase().auth.getSession()
  return data.session
}

export async function exchangeCode(code) {
  return getSupabase().auth.exchangeCodeForSession(code)
}

// ── User data ─────────────────────────────────────────────────
export async function markOnboarded(userId) {
  return getSupabase()
    .from('users')
    .update({ onboarded_at: new Date().toISOString() })
    .eq('id', userId)
}

export async function saveUserProperties(userId, states, propTypes) {
  await getSupabase().from('properties').delete().eq('user_id', userId)
  const types = propTypes.length > 0 ? propTypes : ['general']
  const rows  = states.flatMap(state => types.map(property_type => ({ user_id: userId, state, property_type })))
  return getSupabase().from('properties').insert(rows)
}

export async function getUserProperties(userId) {
  const { data } = await getSupabase()
    .from('properties').select('*').eq('user_id', userId)
  return data || []
}

export async function getAlertsForStates(states) {
  const { data } = await getSupabase()
    .from('law_alerts').select('*').in('state', states)
    .order('created_at', { ascending: false }).limit(50)
  return data || []
}
