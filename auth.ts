import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { db } from "./lib/db"
import bcrypt from "bcryptjs"
import { z } from "zod"

// Helper to get the correct base URL for the current environment
function getBaseUrl() {
  if (typeof window !== "undefined") return "" // Client-side, use relative URLs
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}` // Vercel
  return process.env.NEXTAUTH_URL || "http://localhost:3000" // Local development
}

// Extend NextAuth types to include custom user fields (id and role)
declare module "next-auth" {
  interface User {
    id: string
    role: string
  }
  interface Session {
    user: {
      id: string
      role: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials)

        if (!parsedCredentials.success) {
          return null
        }

        const { email, password } = parsedCredentials.data
        const user = await db.user.findUnique({
          where: { email }
        })

        if (!user) {
          return null
        }

        const passwordsMatch = await bcrypt.compare(password, user.password)
        if (!passwordsMatch) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    }
  },
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  }
})
