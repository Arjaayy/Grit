'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export function useRequireAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') {
    return { session: null, loading: true, authenticated: false }
  }

  if (!session || session.user?.role !== 'admin') {
    router.push('/admin/auth/signin')
    return { session: null, loading: false, authenticated: false }
  }

  return { session, loading: false, authenticated: true }
}
