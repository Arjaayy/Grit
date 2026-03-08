import NextAuth from 'next-auth'
import { NextAuthOptions } from 'next-auth'

const authOptions: NextAuthOptions = {
  providers: [
    {
      id: 'credentials',
      name: 'Credentials',
      type: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // In a real implementation, you would verify against your database
        // For now, we'll use a simple hardcoded admin user
        if (credentials?.email === 'admin@gritdigitalperformance.com' && credentials?.password === 'admin123') {
          return {
            id: '1',
            name: 'Admin User',
            email: 'admin@gritdigitalperformance.com',
            role: 'admin'
          }
        }
        return null
      }
    }
  ],
  pages: {
    signIn: '/admin/auth/signin',
    error: '/admin/auth/error',
  },
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
