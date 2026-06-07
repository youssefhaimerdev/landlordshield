'use client'
import { useEffect, useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { getSession, markOnboarded, saveUserProperties } from '@/lib/supabase'
import OnboardingFlow from '@/components/OnboardingFlow'

function OnboardingInner() {
  const router  = useRouter()
  const [user,  setUser]  = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    getSession().then(session => {
      if (!session) { router.push('/auth'); return }
      setUser({
        id:    session.user.id,
        email: session.user.email,
        name:  session.user.user_metadata?.name || session.user.email.split('@')[0],
      })
      setReady(true)
    })
  }, [router])

  const handleSuccess = async ({ selStates, selTypes }) => {
    if (!user) return
    await saveUserProperties(user.id, selStates, selTypes)
    await markOnboarded(user.id)
    router.push('/dashboard')
  }

  if (!ready) return null
  return <OnboardingFlow user={user} onSuccess={handleSuccess} />
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={null}>
      <OnboardingInner />
    </Suspense>
  )
}
