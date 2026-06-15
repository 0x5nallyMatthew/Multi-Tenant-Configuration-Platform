"use client"

import React, { useState, useMemo, useCallback } from "react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { TenantConfig } from "@/lib/tenant-schema"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import {
  Building2,
  Search,
  Settings2,
  Eye,
  History,
  Trash2,
  Plus,
  ShieldAlert,
  LayoutDashboard
} from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"

interface Tenant {
  id: string
  name: string
  slug: string
  config: TenantConfig
  updatedAt: string
  ownerId?: string
  owner?: { name: string; email: string }
}

interface TenantsClientProps {
  initialTenants: Tenant[]
  userRole: string
  userId: string
}

// Memoized tenant row component
const TenantRow = React.memo(({ 
  tenant, 
  userRole, 
  userId, 
  onDelete 
}: { 
  tenant: Tenant
  userRole: string
  userId: string
  onDelete: (tenant: Tenant) => void
}) => {
  const router = useRouter()
  const config = tenant.config
  const branding = config?.branding
  const claimTypes = config?.claimTypes
  const primaryColor = branding?.primaryColor || "#6d28d9"

  const enabledClaimTypesCount = useMemo(() => 
    claimTypes ? Object.values(claimTypes).filter((ct) => ct.enabled).length : 0,
    [claimTypes]
  )

  const canManage = useMemo(() => 
    userRole === "admin" || tenant.ownerId === userId,
    [userRole, tenant.ownerId, userId]
  )

  const handleManage = useCallback(() => {
    if (canManage) {
      router.push(`/tenants/${tenant.id}`)
    } else {
      toast.error("You don't have permission to manage this tenant")
    }
  }, [canManage, router, tenant.id])

  return (
    <TableRow className="border-border dark:border-zinc-800 hover:bg-card dark:bg-zinc-900/50">
      <TableCell>
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center border text-xs font-bold shrink-0"
            style={{
              backgroundColor: `${primaryColor}15`,
              borderColor: `${primaryColor}40`,
              color: primaryColor
            }}
          >
            {tenant.name.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-foreground">{tenant.name}</span>
            <span className="text-xs text-muted-foreground font-mono">{tenant.slug}</span>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="bg-card dark:bg-zinc-900 border-border dark:border-zinc-700/50">
          {enabledClaimTypesCount} Active Claims
        </Badge>
      </TableCell>
      <TableCell className="font-mono text-sm text-foreground dark:text-zinc-300">
        {config?.approvalRules?.autoApproveThreshold === 0
          ? "Manual"
          : `$${config?.approvalRules?.autoApproveThreshold?.toLocaleString()}`
        }
      </TableCell>
      {(userRole === "admin") && (
        <TableCell className="text-sm text-foreground dark:text-zinc-300">
          {tenant.owner?.name || "N/A"}
        </TableCell>
      )}
      <TableCell className="text-sm text-muted-foreground dark:text-zinc-400">
        {formatDate(tenant.updatedAt)}
      </TableCell>
      <TableCell className="text-right space-x-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-muted-foreground dark:text-zinc-400 hover:text-foreground dark:text-white cursor-pointer"
          onClick={handleManage}
          disabled={!canManage}
        >
          <Settings2 className="w-4 h-4" />
        </Button>
        <Link href={`/tenants/${tenant.id}/preview`} title="Simulate" className="inline-flex items-center justify-center h-8 w-8 p-0 text-primary hover:text-primary/90 hover:bg-primary/10 rounded-md transition-colors">
          <Eye className="w-4 h-4" />
        </Link>
        <Link href={`/tenants/${tenant.id}/history`} title="History" className="inline-flex items-center justify-center h-8 w-8 p-0 text-muted-foreground dark:text-zinc-400 hover:text-foreground dark:text-white rounded-md transition-colors">
          <History className="w-4 h-4" />
        </Link>
        {canManage && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-950/40"
            onClick={(e) => {
              e.preventDefault()
              onDelete(tenant)
            }}
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </TableCell>
    </TableRow>
  )
})

TenantRow.displayName = 'TenantRow'

export default function TenantsClient({ initialTenants, userRole, userId }: TenantsClientProps) {
  const [tenants, setTenants] = useState<Tenant[]>(initialTenants)
  const [searchQuery, setSearchQuery] = useState("")
  const [deletingTenant, setDeletingTenant] = useState<Tenant | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  // Memoized filtered tenants
  const filteredTenants = useMemo(() => 
    tenants.filter(
      (tenant) =>
        tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.slug.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [tenants, searchQuery]
  )

  // Memoized delete handler
  const handleDelete = useCallback(async () => {
    if (!deletingTenant) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/tenants/${deletingTenant.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete tenant")
      }

      setTenants(prev => prev.filter((t) => t.id !== deletingTenant.id))
      toast.success("Tenant deleted successfully")
      setDeletingTenant(null)
    } catch {
      toast.error("Error deleting tenant. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }, [deletingTenant])

  // Memoized delete trigger
  const handleDeleteTrigger = useCallback((tenant: Tenant) => {
    setDeletingTenant(tenant)
  }, [])

  // Memoized search handler
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }, [])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <LayoutDashboard className="w-8 h-8 text-primary" />
            Insurance Tenants
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Manage tenant branding, claim logic, SLAs, and custom forms</p>
        </div>
        {userRole === "admin" && (
          <Link href="/tenants/new" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-sm font-semibold transition-all shadow-lg shadow-primary/10">
            <Plus className="w-4 h-4" />
            Create Tenant
          </Link>
        )}
      </div>

      <Card className="bg-background dark:bg-zinc-950/50 border-border dark:border-zinc-800">
        <CardHeader className="pb-3">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground dark:text-zinc-500">
              <Search className="w-4 h-4" />
            </div>
            <Input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by company name or slug..."
              className="pl-10 bg-card dark:bg-zinc-900 border-border dark:border-zinc-800 focus-visible:ring-primary"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredTenants.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-card dark:bg-zinc-900 border border-border dark:border-zinc-800 text-muted-foreground dark:text-zinc-500 mb-4">
                <Building2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-foreground">No tenants found</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                {searchQuery ? "Try refining your search query." : "Get started by configuring your first insurance tenant."}
              </p>
              {!searchQuery && (
                <Link href="/tenants/new" className="inline-flex items-center gap-2 mt-6 px-4 py-2 text-primary border border-primary/20 hover:bg-primary/10 hover:text-primary rounded-lg text-sm font-medium transition-all">
                  Configure First Tenant
                </Link>
              )}
            </div>
          ) : (
            <div className="rounded-md border border-border dark:border-zinc-800 overflow-x-auto">
              <div className="min-w-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border dark:border-zinc-800 hover:bg-transparent">
                      <TableHead className="w-[300px]">Tenant</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Auto-Approval</TableHead>
                      {(userRole === "admin") && <TableHead>Owner</TableHead>}
                      <TableHead>Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTenants.map((tenant) => (
                      <TenantRow
                        key={tenant.id}
                        tenant={tenant}
                        userRole={userRole}
                        userId={userId}
                        onDelete={handleDeleteTrigger}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!deletingTenant} onOpenChange={(open) => !open && setDeletingTenant(null)}>
        <DialogContent className="bg-background dark:bg-zinc-950 border-border dark:border-zinc-800 text-foreground">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-400">
              <ShieldAlert className="w-5 h-5" />
              Delete Tenant
            </DialogTitle>
            <DialogDescription className="text-muted-foreground dark:text-zinc-400 pt-3">
              Are you sure you want to delete <strong className="text-foreground dark:text-white">{deletingTenant?.name}</strong>?
              This will permanently delete this tenant, all its configurations, and its entire version history. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeletingTenant(null)}
              disabled={isDeleting}
              className="bg-transparent border-border dark:border-zinc-800 hover:bg-card dark:bg-zinc-900 text-foreground dark:text-white"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-500 text-foreground dark:text-white"
            >
              {isDeleting ? "Deleting..." : "Delete Tenant"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
