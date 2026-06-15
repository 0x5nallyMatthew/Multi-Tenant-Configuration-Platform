import React, { Suspense } from "react"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { TenantConfig } from "@/lib/tenant-schema"

// Dynamic import for the client component to reduce initial bundle size
import dynamic from "next/dynamic"
import { TenantFormValues } from "./tenant-form-constants"

const TenantsClient = dynamic(() => import("./tenants-client"), {
  loading: () => <TenantsPageSkeleton />,
  ssr: true
})

// Disable caching for this route so we always see up-to-date tenant configurations
export const dynamic_route = "force-dynamic"

// Skeleton component for loading state
function TenantsPageSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 bg-muted rounded w-64" />
          <div className="h-4 bg-muted rounded w-96" />
        </div>
        <div className="h-10 bg-muted rounded w-32" />
      </div>

      {/* Card skeleton */}
      <div className="bg-card rounded-lg border p-6 space-y-4">
        <div className="h-10 bg-muted rounded max-w-md" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-muted rounded" />
          ))}
        </div>
      </div>
    </div>
  )
}

// Optimized fetch function with caching
async function fetchTenants() {
  try {
    const rawTenants = await db.tenant.findMany({
      include: {
        owner: {
          select: { name: true, email: true }
        }
      },
      orderBy: { updatedAt: "desc" },
      take: 50, // Limit initial load
    })
    return rawTenants
  } catch (error) {
    console.error("Failed to load tenants on SSR:", error)
    return []
  }
}

// Main page component with streaming
export default async function TenantsPage() {
  const session = await auth()

  if (!session || !session.user) {
    redirect("/login")
  }

  const { id: userId, role } = session.user

  // Fetch tenants with optimized query
  const rawTenants = await fetchTenants()

  // Handle config casting and owner name nullability
  const tenants: TenantFormValues[] = rawTenants.map((t) => ({
    ...t,
    config: t.config as TenantConfig,
    owner: t.owner ? { name: t.owner.name || "", email: t.owner.email } : undefined
  }))

  // Map dates to ISO strings to avoid Next.js serialization warnings
  const serializedTenants = tenants.map((tenant: TenantFormValues) => ({
    ...tenant,
    createdAt: tenant.createdAt.toISOString(),
    updatedAt: tenant.updatedAt.toISOString(),
  }))

  return (
    <Suspense fallback={<TenantsPageSkeleton />}>
      <TenantsClient
        initialTenants={serializedTenants}
        userRole={role}
        userId={userId}
      />
    </Suspense>
  )
}
