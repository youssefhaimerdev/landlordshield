'use client'
import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

function CallbackInner() {
  const router = useRouter()
  const params = useSearchParams()

  useEffect(() => {
    const handle = async () => {
      const code  = params.get('code')
      const error = params.get('error')

      if (error) {
        console.error('OAuth error:', error)
        router.push('/auth')
        return
      }

      if (code) {
        try {
          const supabase = getClient()
          const { data, error: exchErr } = await supabase.auth.exchangeCodeForSession(code)

          if (exchErr) {
            console.error('Exchange error:', exchErr)
            router.push('/auth')
            return
          }

          if (data?.session) {
            // Check if user has properties (already onboarded)
            const { data: props } = await supabase
              .from('properties')
              .select('id')
              .eq('user_id', data.session.user.id)
              .limit(1)

            if (props && props.length > 0) {
              router.push('/dashboard')
            } else {
              router.push('/onboarding')
            }
            return
          }
        } catch (e) {
          console.error('Callback error:', e)
        }
      }

      router.push('/auth')
    }

    handle()
  }, [params, router])

  return (
    <div style={{ minHeight:'100vh', background:'#070C18', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16, fontFamily:'sans-serif', color:'#F1F5F9' }}>
      <div style={{ width:40, height:40, border:'3px solid rgba(255,255,255,0.1)', borderTopColor:'#F59E0B', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
      <p style={{ fontSize:15, color:'#94A3B8' }}>Completing sign in…</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

export default function AuthCallback() {
  return (
    <Suspense fallback={null}>
      <CallbackInner />
    </Suspense>
  )
}
