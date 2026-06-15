import React from "react"
import { Building } from "lucide-react"
import { Tenant, TenantVersion } from "../types"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface TenantSelectorProps {
    label: string
    labelColor: string
    tenants: Tenant[]
    selectedTenantId: string
    selectedVersionId: string
    versions: TenantVersion[]
    loading: boolean
    onTenantChange: (tenantId: string) => void
    onVersionChange: (versionId: string) => void
    disabled?: boolean
}

export function TenantSelector({
    label,
    labelColor,
    tenants,
    selectedTenantId,
    selectedVersionId,
    versions,
    loading,
    onTenantChange,
    onVersionChange,
    disabled = false
}: TenantSelectorProps) {
    // Find the selected tenant name to display
    const selectedTenant = tenants.find(t => t.id === selectedTenantId)
    const displayTenantName = selectedTenant?.name || "Select tenant"

    // Find the selected version display text
    let displayVersionText = "Select version"
    if (selectedVersionId === "active") {
        displayVersionText = "Active (Latest)"
    } else if (selectedVersionId) {
        const selectedVersion = versions.find(v => v.id === selectedVersionId)
        if (selectedVersion) {
            displayVersionText = `v${selectedVersion.version} - ${selectedVersion.note}`
        }
    }

    return (
        <div className="space-y-4">
            <h3 className={`text-xs font-bold tracking-wider ${labelColor} flex items-center gap-1.5`}>
                <Building className="w-4 h-4" /> {label}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <Select value={selectedTenantId} onValueChange={(value) => value && onTenantChange(value)}>
                        <SelectTrigger disabled={disabled} className="w-full px-3 py-2.5 h-auto bg-background dark:bg-zinc-950 border-border dark:border-zinc-800 rounded-xl text-xs">
                            <SelectValue>
                                <span className="truncate">{displayTenantName}</span>
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="relative z-[100]">
                            {tenants.map((t) => (
                                <SelectItem key={t.id} value={t.id} className="text-xs">
                                    {t.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Select value={selectedVersionId} onValueChange={(value) => value && onVersionChange(value)} disabled={loading}>
                        <SelectTrigger disabled={disabled} className="w-full px-3 py-2.5 h-auto bg-background dark:bg-zinc-950 border-border dark:border-zinc-800 rounded-xl text-xs disabled:opacity-50">
                            <SelectValue>
                                <span className="truncate">{displayVersionText}</span>
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="relative z-[100]">
                            <SelectItem value="active" className="text-xs">Active (Latest)</SelectItem>
                            {versions.map((v) => (
                                <SelectItem key={v.id} value={v.id} className="text-xs">
                                    v{v.version} - {v.note}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    )
}
