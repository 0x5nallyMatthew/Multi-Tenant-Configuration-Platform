import React from "react"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { canUserAccessTenant } from "@/lib/auth-helpers"
import { TenantConfig } from "@/lib/tenant-schema"
import EditTenantClient from "./edit-tenant-client"

interface EditTenantPageProps {
  params: Promise<{ id: string }>
}

export default async function EditTenantPage({ params }: EditTenantPageProps) {
  const session = await auth()

  if (!session || !session.user) {
    redirect("/login")
  }

  const { id } = await params

  const tenant = await db.tenant.findUnique({
    where: { id }
  })

  if (!tenant) {
    return (
      <div className="p-8 bg-card dark:bg-zinc-900/40 border border-border dark:border-zinc-800 rounded-2xl text-center">
        <h3 className="text-lg font-bold text-foreground">Tenant not found</h3>
        <p className="text-sm text-muted-foreground dark:text-zinc-400 mt-1">The requested tenant configuration does not exist.</p>
      </div>
    )
  }

  if (!canUserAccessTenant(session.user, tenant.ownerId)) {
    redirect("/tenants")
  }

  // Serialize dates for Client Component safety
  const serializedTenant = {
    id: tenant.id,
    name: tenant.name,
    slug: tenant.slug,
    config: tenant.config as TenantConfig,
  }

  return <EditTenantClient tenant={serializedTenant} />
}
