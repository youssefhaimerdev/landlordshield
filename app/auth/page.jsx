'use client'
import { useRouter } from 'next/navigation'
import AuthForm from '@/components/AuthForm'

export default function AuthPage() {
  const router = useRouter()

  const handleSuccess = async ({ email, name }) => {
    // Store basic session info — replace with real Supabase auth
    localStorage.setItem('lr_user', JSON.stringify({ email, name }))
    router.push('/onboarding')
  }

  return <AuthForm onSuccess={handleSuccess} />
}
