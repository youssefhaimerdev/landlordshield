'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import OnboardingFlow from '@/components/OnboardingFlow'

export default function OnboardingPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('lr_user')
    if (!stored) { router.push('/auth'); return }
    setUser(JSON.parse(stored))
  }, [router])

  const handleSuccess = (prefs) => {
    localStorage.setItem('lr_prefs', JSON.stringify(prefs))
    router.push('/dashboard')
  }

  if (!user) return null
  return <OnboardingFlow user={user} onSuccess={handleSuccess} />
}
