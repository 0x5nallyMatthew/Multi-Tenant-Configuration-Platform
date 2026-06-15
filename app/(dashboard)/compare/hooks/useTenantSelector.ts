"use client"

import { useState, useEffect, useCallback } from "react"
import { Tenant, TenantVersion, TenantConfig } from "../types"

interface UseTenantSelectorOptions {
  tenants: Tenant[]
  initialTenantId?: string
  initialVersionId?: string
  initialVersions?: TenantVersion[]
  initialConfig?: TenantConfig
}

interface UseTenantSelectorReturn {
  tenantId: string
  versionId: string
  versions: TenantVersion[]
  config: TenantConfig | null
  loading: boolean
  versionLoading: boolean
  setTenantId: (tenantId: string) => void
  setVersionId: (versionId: string) => void
}

export function useTenantSelector({
  tenants,
  initialTenantId,
  initialVersionId = "active",
  initialVersions = [],
  initialConfig,
}: UseTenantSelectorOptions): UseTenantSelectorReturn {
  const [tenantId, setTenantIdState] = useState(
    initialTenantId || tenants[0]?.id || ""
  )
  const [versionId, setVersionIdState] = useState(initialVersionId)
  const [versions, setVersions] = useState<TenantVersion[]>(initialVersions)
  const [config, setConfig] = useState<TenantConfig | null>(
    initialConfig || null
  )
  const [loading, setLoading] = useState(false)
  const [versionLoading, setVersionLoading] = useState(false)

  // Fetch versions when tenant changes (if not already loaded)
  useEffect(() => {
    // Don't fetch if no tenant selected or versions are already loaded
    if (!tenantId || versions.length > 0) return

    const fetchVersions = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/tenants/${tenantId}/history`)
        if (res.ok) {
          const data = await res.json()
          setVersions(data)
          setVersionIdState("active")

          const activeTenant = tenants.find((t) => t.id === tenantId)
          setConfig(activeTenant?.config || null)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchVersions()
  }, [tenantId, versions.length, tenants])

  // Reset state when tenant changes
  const setTenantId = useCallback((newTenantId: string) => {
    setTenantIdState(newTenantId)
    setVersions([])
    setVersionIdState("active")
    setConfig(null)
  }, [])

  // Handle version change with config lookup and loading state
  const setVersionId = useCallback(
    (newVersionId: string) => {
      setVersionLoading(true)
      setVersionIdState(newVersionId)

      // Use setTimeout to show loading indicator briefly for UX feedback
      setTimeout(() => {
        if (newVersionId === "active") {
          const activeTenant = tenants.find((t) => t.id === tenantId)
          setConfig(activeTenant?.config || null)
        } else {
          const selectedVersion = versions.find((v) => v.id === newVersionId)
          setConfig(selectedVersion?.config || null)
        }
        setVersionLoading(false)
      }, 150)
    },
    [tenantId, versions, tenants]
  )

  return {
    tenantId,
    versionId,
    versions,
    config,
    loading,
    versionLoading,
    setTenantId,
    setVersionId,
  }
}
