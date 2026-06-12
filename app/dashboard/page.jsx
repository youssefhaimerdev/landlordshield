'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'
import Dashboard from '@/components/Dashboard'

export default function DashboardPage() {
  const router  = useRouter()
  const [user,  setUser]  = useState(null)
  const [prefs, setPrefs] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const sb = getSupabase()

    const { data: { subscription } } = sb.auth.onAuthStateChange(async (event, session) => {
      if (event !== 'INITIAL_SESSION' && event !== 'SIGNED_IN') return
      subscription.unsubscribe()

      if (!session) { router.replace('/auth'); return }

      const u = {
        id:    session.user.id,
        email: session.user.email,
        name:  session.user.user_metadata?.name || session.user.email.split('@')[0],
      }
      setUser(u)

      // Load properties — if none found, show dashboard with fallback (no loop)
      const { data: props } = await sb
        .from('properties').select('*').eq('user_id', session.user.id)

      const selStates = props?.length
        ? [...new Set(props.map(p => p.state))]
        : ['CA', 'NY', 'FL', 'WA', 'OR']  // fallback so dashboard always renders

      const selTypes = props?.length
        ? [...new Set(props.map(p => p.property_type).filter(Boolean))]
        : ['general']

      setPrefs({ selStates, selTypes })
      setReady(true)
    })

    return () => subscription.unsubscribe()
  }, [router])

  if (!ready) return (
    <div style={{ minHeight:'100vh', background:'#070C18', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ width:40, height:40, border:'3px solid rgba(255,255,255,0.1)', borderTopColor:'#F59E0B', borderRadius:'50%', animation:'spin .8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  return <Dashboard user={user} prefs={prefs} />
}
