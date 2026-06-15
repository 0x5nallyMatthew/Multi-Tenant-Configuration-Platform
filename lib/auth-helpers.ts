import { auth } from "@/auth"
import { redirect } from "next/navigation"

export async function getCurrentUser() {
  const session = await auth()
  return session?.user || null
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }
  return user
}

export async function requireAdmin() {
  const user = await requireAuth()
  if (user.role !== "admin") {
    redirect("/tenants")
  }
  return user
}

export function canUserAccessTenant(user: { id: string; role: string }, tenantOwnerId: string) {
  // Admins can access all tenants, Operators can only access their own tenants
  if (user.role === "admin") return true
  return user.id === tenantOwnerId
}
