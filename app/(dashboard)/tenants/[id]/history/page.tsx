import React from "react"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { TenantConfig } from "@/lib/tenant-schema"
import HistoryClient from "./history-client"

interface HistoryPageProps {
  params: Promise<{ id: string }>
}


export default async function HistoryPage({ params }: HistoryPageProps) {
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

  const versions = await db.tenantVersion.findMany({
    where: { tenantId: id },
    orderBy: { version: "desc" }
  })

  // Serialize dates for Client Component safety
  const serializedTenant = {
    id: tenant.id,
    name: tenant.name,
    config: tenant.config as TenantConfig,
  }

  const serializedVersions = versions.map((v: any) => ({
    id: v.id,
    tenantId: v.tenantId,
    config: v.config as TenantConfig,
    version: v.version,
    savedAt: v.savedAt.toISOString(),
    note: v.note,
  }))

  return <HistoryClient tenant={serializedTenant} versions={serializedVersions} />
}
