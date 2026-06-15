"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  History,
  RotateCcw,
  GitCompare,
  Clock,
  Check,
} from "lucide-react"
import { formatDate } from "@/lib/utils"
import { TenantConfig } from "@/lib/tenant-schema"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"

interface TenantVersion {
  id: string
  tenantId: string
  config: TenantConfig
  version: number
  savedAt: string
  note: string | null
}

interface HistoryClientProps {
  tenant: {
    id: string
    name: string
    config: TenantConfig
  }
  versions: TenantVersion[]
}

export default function HistoryClient({ tenant, versions }: HistoryClientProps) {
  const router = useRouter()

  const [restoringVersion, setRestoringVersion] = useState<TenantVersion | null>(null)
  const [isRestoring, setIsRestoring] = useState(false)

  const handleRestore = async () => {
    if (!restoringVersion) return

    setIsRestoring(true)
    try {
      const response = await fetch(`/api/tenants/${tenant.id}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ versionId: restoringVersion.id })
      })

      if (!response.ok) {
        throw new Error("Failed to restore configuration")
      }

      toast.success("Configuration restored successfully")
      setRestoringVersion(null)
      router.push("/tenants")
      router.refresh()
    } catch {
      toast.error("Error restoring configuration. Please try again.")
      return
    } finally {
      setIsRestoring(false)
    }
  }

  // Helper to compare if a version is currently the active one
  const isActiveConfig = (versionConfig: TenantConfig) => {
    return JSON.stringify(versionConfig) === JSON.stringify(tenant.config)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border dark:border-zinc-800 pb-4">
        <Link href="/tenants" className="p-2 bg-card dark:bg-zinc-900 border border-border dark:border-zinc-800 hover:bg-muted dark:bg-zinc-800 text-muted-foreground dark:text-zinc-400 rounded-xl transition-all">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Configuration Version History</h2>
          <p className="text-sm text-muted-foreground dark:text-zinc-400 mt-0.5">
            Audit trail and configuration rollback control for <span className="font-semibold text-zinc-200">{tenant.name}</span>
          </p>
        </div>
      </div>

      <Card className="bg-background dark:bg-zinc-950/50 border-border dark:border-zinc-800 shadow-xl">
        <CardHeader className="border-b border-border dark:border-zinc-800 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Audit Log Timeline</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground dark:text-zinc-400 font-medium mt-0">
            Total of {versions.length} {versions.length === 1 ? "version" : "versions"} saved
          </p>
        </CardHeader>

        <CardContent className="p-0">
          {versions.length === 0 ? (
            <div className="p-16 text-center text-sm text-muted-foreground dark:text-zinc-500">
              No configuration history available.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border dark:border-zinc-800 hover:bg-transparent">
                  <TableHead className="w-[150px]">Version</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Saved At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {versions.map((version, index) => {
                  const isCurrent = index === 0

                  return (
                    <TableRow
                      key={version.id}
                      className={`border-border dark:border-zinc-800 hover:bg-card dark:bg-zinc-900/50 ${isCurrent ? "bg-blue-500/5" : ""}`}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono bg-card dark:bg-zinc-900 border-border dark:border-zinc-700">
                            v{version.version}
                          </Badge>
                          {isCurrent && (
                            <Badge variant="secondary" className="text-[10px]">
                              <Check className="w-3 h-3 mr-1" /> Active
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground dark:text-zinc-300 italic">
                        &ldquo;{version.note || "No comment provided."}&rdquo;
                      </TableCell>
                      <TableCell className="text-muted-foreground dark:text-zinc-400 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDate(version.savedAt)} at {new Date(version.savedAt).toLocaleTimeString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right space-x-2 space-y-2">
                        {!isActiveConfig(version.config) && (<Link href={`/compare?tenantId=${tenant.id}&baseVersionId=${version.id}`} className="flex items-center gap-1.5 px-3 py-1.5 bg-card dark:bg-zinc-900 border border-border dark:border-zinc-800 hover:bg-muted dark:bg-zinc-800 text-foreground dark:text-zinc-300 hover:text-foreground dark:text-white rounded-lg text-xs font-medium transition-all">
                          <GitCompare className="w-3.5 h-3.5" />
                          Diff
                        </Link>)}
                        {!isCurrent && (
                          <Button
                            onClick={() => setRestoringVersion(version)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary hover:text-primary border border-primary/20 rounded-lg text-xs font-medium transition-all cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Rollback
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!restoringVersion} onOpenChange={(open) => !open && setRestoringVersion(null)}>
        <DialogContent className="bg-background dark:bg-zinc-950 border-border dark:border-zinc-800 text-foreground">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary">
              <RotateCcw className="w-5 h-5 animate-spin" />
              Confirm Rollback
            </DialogTitle>
            <DialogDescription className="text-muted-foreground dark:text-zinc-400 pt-3">
              Are you sure you want to restore <strong className="text-zinc-200">{tenant.name}</strong> configuration to <Badge variant="outline" className="font-mono mx-1">v{restoringVersion?.version}</Badge>?
              <br className="mb-2 block" />
              This will create a new version log in history and make the settings in v{restoringVersion?.version} immediately active.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2">
            <Button
              variant="outline"
              onClick={() => setRestoringVersion(null)}
              disabled={isRestoring}
              className="bg-transparent border-border dark:border-zinc-800 hover:bg-card dark:bg-zinc-900 text-foreground dark:text-white cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRestore}
              disabled={isRestoring}
              className="bg-primary hover:bg-primary/90 text-primary-foreground dark:text-white shadow-lg shadow-primary/10 cursor-pointer"
            >
              {isRestoring ? "Restoring..." : "Restore Settings"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
