"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { GitCompare, ArrowRight, LoaderCircle } from "lucide-react"
import { Tenant, TenantVersion } from "./types"
import { TenantSelector } from "./components/TenantSelector"
import { ComparisonTable } from "./components/ComparisonTable"
import { MotionWrapper } from "@/components/motion-wrapper"
import { useTenantSelector } from "./hooks/useTenantSelector"

interface CompareClientProps {
  tenants: Tenant[]
  initialTenantId?: string
  initialBaseVersionId?: string
  initialVersionsA: TenantVersion[]
  initialVersionsB: TenantVersion[]
}

export default function CompareClient({
  tenants,
  initialTenantId,
  initialBaseVersionId,
  initialVersionsA,
  initialVersionsB,
}: CompareClientProps) {
  const isComparingToActiveVersion = !!initialBaseVersionId

  // Side A: Historical version or first tenant
  const selectorA = useTenantSelector({
    tenants,
    initialTenantId,
    initialVersionId: initialBaseVersionId || "active",
    initialVersions: initialVersionsA,
    initialConfig:
      initialVersionsA.find((v) => v.id === initialBaseVersionId)?.config ||
      tenants.find((t) => t.id === (initialTenantId || tenants[0]?.id))?.config,
  })

  // Side B: Same tenant's active config (when comparing historical), or second tenant
  const selectorB = useTenantSelector({
    tenants,
    initialTenantId: isComparingToActiveVersion
      ? initialTenantId || tenants[0]?.id
      : tenants[1]?.id || tenants[0]?.id,
    initialVersionId: "active",
    initialVersions: initialVersionsB,
    initialConfig: tenants.find(
      (t) =>
        t.id ===
        (isComparingToActiveVersion
          ? initialTenantId || tenants[0]?.id
          : tenants[1]?.id || tenants[0]?.id)
    )?.config,
  })

  const isLoading = !selectorA.config || !selectorB.config
  const isVersionLoading = selectorA.versionLoading || selectorB.versionLoading

  return (
    <div className="space-y-8">
      <MotionWrapper direction="down" duration={0.5}>
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <GitCompare className="w-8 h-8 text-primary" />
            Configuration Diff Engine
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Perform side-by-side property comparisons and change detection
            between tenants or configuration version history.
          </p>
        </div>
      </MotionWrapper>

      {!isComparingToActiveVersion && (
        <Card className="bg-background dark:bg-zinc-950/50 border-border dark:border-zinc-800 shadow-xl overflow-hidden">
          <CardContent className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-11 gap-4 md:gap-6 items-center">
            <div className="md:col-span-5">
              <TenantSelector
                label="Base Config (Source A)"
                labelColor="text-violet-400"
                tenants={tenants}
                selectedTenantId={selectorA.tenantId}
                selectedVersionId={selectorA.versionId}
                versions={selectorA.versions}
                loading={selectorA.loading}
                onTenantChange={selectorA.setTenantId}
                onVersionChange={selectorA.setVersionId}
                disabled={isComparingToActiveVersion}
              />
            </div>

            <div className="md:col-span-1 flex justify-center">
              <div className="w-8 h-8 rounded-full bg-muted dark:bg-zinc-850 border border-border dark:border-zinc-800 flex items-center justify-center text-foreground">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            <div className="md:col-span-5">
              <TenantSelector
                label="Target Config (Source B)"
                labelColor="text-indigo-400"
                tenants={tenants}
                selectedTenantId={selectorB.tenantId}
                selectedVersionId={selectorB.versionId}
                versions={selectorB.versions}
                loading={selectorB.loading}
                onTenantChange={selectorB.setTenantId}
                onVersionChange={selectorB.setVersionId}
                disabled={isComparingToActiveVersion}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="h-48 flex items-center justify-center text-muted-foreground dark:text-zinc-500 bg-card dark:bg-zinc-900/20 border border-border dark:border-zinc-850 rounded-2xl">
          <LoaderCircle className="w-8 h-8 animate-spin" />
        </div>
      ) : isVersionLoading ? (
        <div className="h-48 flex items-center justify-center text-muted-foreground dark:text-zinc-500 bg-card dark:bg-zinc-900/20 border border-border dark:border-zinc-850 rounded-2xl">
          <LoaderCircle className="w-6 h-6 animate-spin" />
        </div>
      ) : (
        <ComparisonTable configA={selectorA.config} configB={selectorB.config} />
      )}
    </div>
  )
}
