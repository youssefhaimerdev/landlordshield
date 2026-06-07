'use client'
import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { exchangeCode, getUserProperties } from '@/lib/supabase'

function CallbackInner() {
  const router = useRouter()
  const params = useSearchParams()

  useEffect(() => {
    const handle = async () => {
      const code  = params.get('code')
      const error = params.get('error')

      if (error) { router.push('/auth?error=' + error); return }

      if (code) {
        const { data, error: exchErr } = await exchangeCode(code)
        if (exchErr || !data?.session) {
          router.push('/auth?error=callback_failed'); return
        }
        const props = await getUserProperties(data.session.user.id)
        router.push(props.length > 0 ? '/dashboard' : '/onboarding')
        return
      }

      router.push('/dashboard')
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
