'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router  = useRouter()
  const [msg,   setMsg]   = useState('Completing sign in…')
  const [error, setError] = useState(null)

  useEffect(() => {
    const handle = async () => {
      const supabase = getSupabase()
      const params   = new URLSearchParams(window.location.search)
      const code     = params.get('code')
      const errParam = params.get('error')

      if (errParam) {
        setError(`OAuth error: ${errParam}`)
        setTimeout(() => router.push('/auth'), 3000)
        return
      }

      // Exchange code for session
      if (code) {
        setMsg('Exchanging token…')
        const { data, error: exchErr } = await supabase.auth.exchangeCodeForSession(code)

        if (exchErr) {
          // Exchange failed — maybe already used. Check if session exists anyway.
          setMsg('Checking session…')
        } else if (data?.session) {
          setMsg('Signed in! Redirecting…')
          await redirect(supabase, data.session.user.id)
          return
        }
      }

      // Fallback: poll for session (handles implicit flow and timing issues)
      setMsg('Verifying session…')
      for (let i = 0; i < 8; i++) {
        await new Promise(r => setTimeout(r, 800))
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          setMsg('Signed in! Redirecting…')
          await redirect(supabase, session.user.id)
          return
        }
      }

      // Nothing worked
      setError('Sign in timed out. Please try again.')
      setTimeout(() => router.push('/auth'), 2000)
    }

    const redirect = async (supabase, userId) => {
      try {
        const { data: props } = await supabase
          .from('properties').select('id').eq('user_id', userId).limit(1)
        router.replace(props?.length > 0 ? '/dashboard' : '/onboarding')
      } catch {
        router.replace('/onboarding')
      }
    }

    handle()
  }, [router])

  return (
    <div style={{ minHeight:'100vh', background:'#070C18', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16, fontFamily:'sans-serif' }}>
      {error ? (
        <p style={{ fontSize:15, color:'#EF4444', maxWidth:360, textAlign:'center' }}>{error}<br /><span style={{ color:'#94A3B8', fontSize:13 }}>Redirecting you back…</span></p>
      ) : (
        <>
          <div style={{ width:40, height:40, border:'3px solid rgba(255,255,255,0.1)', borderTopColor:'#F59E0B', borderRadius:'50%', animation:'spin .8s linear infinite' }} />
          <p style={{ fontSize:15, color:'#94A3B8' }}>{msg}</p>
        </>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
