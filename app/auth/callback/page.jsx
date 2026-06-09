'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()
  const [msg,  setMsg]  = useState('Completing sign in…')
  const [err,  setErr]  = useState(null)

  useEffect(() => {
    const handle = async () => {
      const sb     = getSupabase()
      const params = new URLSearchParams(window.location.search)
      const code   = params.get('code')
      const errP   = params.get('error')

      if (errP) { setErr(errP); setTimeout(() => router.push('/auth'), 3000); return }

      if (code) {
        setMsg('Exchanging token…')
        const { data, error } = await sb.auth.exchangeCodeForSession(code)
        if (!error && data?.session) {
          await goTo(sb, data.session.user.id); return
        }
      }

      // Poll for session (handles timing edge cases)
      setMsg('Verifying session…')
      for (let i = 0; i < 10; i++) {
        await new Promise(r => setTimeout(r, 600))
        const { data: { session } } = await sb.auth.getSession()
        if (session) { await goTo(sb, session.user.id); return }
      }

      setErr('Sign-in timed out. Please try again.')
      setTimeout(() => router.push('/auth'), 2000)
    }

    const goTo = async (sb, userId) => {
      const { data } = await sb.from('properties').select('id').eq('user_id', userId).limit(1)
      router.replace(data?.length > 0 ? '/dashboard' : '/onboarding')
    }

    handle()
  }, [router])

  return (
    <div style={{ minHeight:'100vh', background:'#070C18', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16, fontFamily:'sans-serif' }}>
      {err
        ? <p style={{ color:'#EF4444', fontSize:15, textAlign:'center', maxWidth:320 }}>Error: {err}<br/><span style={{ color:'#94A3B8', fontSize:13 }}>Redirecting back…</span></p>
        : <>
            <div style={{ width:40, height:40, border:'3px solid rgba(255,255,255,0.1)', borderTopColor:'#F59E0B', borderRadius:'50%', animation:'spin .8s linear infinite' }} />
            <p style={{ color:'#94A3B8', fontSize:15 }}>{msg}</p>
          </>
      }
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
