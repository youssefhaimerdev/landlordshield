'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'
import AuthForm from '@/components/AuthForm'

export default function AuthPage() {
  const router = useRouter()

  useEffect(() => {
    getSupabase().auth.getSession().then(({ data: { session } }) => {
      if (!session) return
      getSupabase().from('properties').select('id').eq('user_id', session.user.id).limit(1)
        .then(({ data }) => {
          router.replace(data?.length > 0 ? '/dashboard' : '/onboarding')
        })
    })
  }, [router])

  const handleSuccess = async ({ userId }) => {
    const { data } = await getSupabase()
      .from('properties').select('id').eq('user_id', userId).limit(1)
    router.push(data?.length > 0 ? '/dashboard' : '/onboarding')
  }

  return <AuthForm onSuccess={handleSuccess} />
}

