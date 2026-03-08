import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export async function requireAuth() {
  const session = await getServerSession()
  
  if (!session) {
    redirect('/admin/auth/signin')
  }
  
  if (session.user?.role !== 'admin') {
    redirect('/admin/auth/error?error=access_denied')
  }
  
  return session
}

export async function getSession() {
  return await getServerSession()
}
