import React from "react"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import CompareClient from "./compare-client"

// Disable caching for this route so we always see up-to-date tenant configurations
export const dynamic = "force-dynamic"

interface ComparePageProps {
  searchParams: Promise<{ tenantId?: string; baseVersionId?: string }>
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const session = await auth()

  if (!session || !session.user) {
    redirect("/login")
  }

  const { id: userId, role } = session.user
  const { tenantId, baseVersionId } = await searchParams

  let tenants: any[] = [];

  try {
    if (role === "admin") {
      tenants = await db.tenant.findMany({
        select: { id: true, name: true, config: true },
        orderBy: { name: "asc" }
      })
    } else {
      tenants = await db.tenant.findMany({
        where: { ownerId: userId },
        select: { id: true, name: true, config: true },
        orderBy: { name: "asc" }
      })
    }
  } catch (error) {
    console.error("Failed to fetch tenants for comparison:", error)
  }

  // Fetch version history for initial tenants
  const initialTenantAId = tenantId || tenants[0]?.id
  const initialTenantBId = tenants[1]?.id || tenants[0]?.id

  let versionsA: any[] = []
  let versionsB: any[] = []

  try {
    if (initialTenantAId) {
      versionsA = await db.tenantVersion.findMany({
        where: { tenantId: initialTenantAId },
        orderBy: { version: "desc" },
      })
    }

    if (initialTenantBId) {
      versionsB = await db.tenantVersion.findMany({
        where: { tenantId: initialTenantBId },
        orderBy: { version: "desc" },
      })
    }
  } catch (error) {
    console.error("Failed to fetch version history:", error)
  }

  return (
    <CompareClient
      tenants={tenants}
      initialTenantId={tenantId}
      initialBaseVersionId={baseVersionId}
      initialVersionsA={versionsA}
      initialVersionsB={versionsB}
    />
  )
}