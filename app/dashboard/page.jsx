'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Dashboard from '@/components/Dashboard'

export default function DashboardPage() {
  const router = useRouter()
  const [user,  setUser]  = useState(null)
  const [prefs, setPrefs] = useState(null)

  useEffect(() => {
    const u = localStorage.getItem('lr_user')
    const p = localStorage.getItem('lr_prefs')
    if (!u) { router.push('/auth'); return }
    setUser(JSON.parse(u))
    setPrefs(p ? JSON.parse(p) : null)
  }, [router])

  if (!user) return null
  return <Dashboard user={user} prefs={prefs} />
}
