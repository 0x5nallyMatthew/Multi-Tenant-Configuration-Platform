import React from "react"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { DiffRow } from "./DiffRow"
import { Badge } from "@/components/ui/badge"

interface ComparisonTableProps {
    configA: any
    configB: any
}

export function ComparisonTable({ configA, configB }: ComparisonTableProps) {
    const claimTypes = ["OUTPATIENT", "INPATIENT", "DENTAL", "MATERNITY", "OPTICAL"]

    return (
        <Card className="bg-background dark:bg-zinc-950/50 border-border dark:border-zinc-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-border dark:border-zinc-800 hover:bg-transparent bg-card dark:bg-zinc-900/40">
                            <TableHead className="w-1/3">Configuration Parameter</TableHead>
                            <TableHead>Source A</TableHead>
                            <TableHead>Source B</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {/* SECTION: BRANDING */}
                        <tr className="bg-background dark:bg-zinc-950/40">
                            <td colSpan={3} className="p-3 text-[10px] font-semibold text-primary uppercase tracking-wider">
                                Branding Config
                            </td>
                        </tr>
                        <DiffRow label="Company Name" valA={configA.branding?.companyName} valB={configB.branding?.companyName} />
                        <DiffRow
                            label="Primary Color"
                            valA={configA.branding?.primaryColor}
                            valB={configB.branding?.primaryColor}
                            formatter={(c) => (
                                <span className="flex items-center gap-2">
                                    <div className="w-3.5 h-3.5 rounded border border-border dark:border-zinc-850" style={{ backgroundColor: c }} />
                                    <code className="font-mono">{c}</code>
                                </span>
                            )}
                        />
                        <DiffRow
                            label="Secondary Color"
                            valA={configA.branding?.secondaryColor}
                            valB={configB.branding?.secondaryColor}
                            formatter={(c) => (
                                <span className="flex items-center gap-2">
                                    <div className="w-3.5 h-3.5 rounded border border-border dark:border-zinc-850" style={{ backgroundColor: c }} />
                                    <code className="font-mono">{c}</code>
                                </span>
                            )}
                        />

                        {/* SECTION: RULES */}
                        <tr className="bg-background dark:bg-zinc-950/40">
                            <td colSpan={3} className="p-3 text-[10px] font-bold text-primary uppercase tracking-wider">
                                Approval Logic Rules
                            </td>
                        </tr>
                        <DiffRow
                            label="Auto Approval Threshold"
                            valA={configA.approvalRules?.autoApproveThreshold}
                            valB={configB.approvalRules?.autoApproveThreshold}
                            formatter={(v) => `$${v.toLocaleString()}`}
                        />
                        <DiffRow label="Approval Tiers count" valA={configA.approvalRules?.tiers?.length} valB={configB.approvalRules?.tiers?.length} />

                        {/* SECTION: CLAIM TYPES */}
                        <tr className="bg-background dark:bg-zinc-950/40">
                            <td colSpan={3} className="p-3 text-[10px] font-bold text-primary uppercase tracking-wider">
                                Claim Types & Docs
                            </td>
                        </tr>
                        {claimTypes.map((type) => {
                            const claimA = configA.claimTypes?.[type]
                            const claimB = configB.claimTypes?.[type]

                            return (
                                <DiffRow
                                    key={type}
                                    label={`${type} Status`}
                                    valA={claimA?.enabled ? "Enabled" : "Disabled"}
                                    valB={claimB?.enabled ? "Enabled" : "Disabled"}
                                    formatter={(v) => (
                                        <Badge
                                            variant={v === "Enabled" ? "secondary" : "destructive"}
                                        >
                                            {v}
                                        </Badge>
                                    )}
                                />
                            )
                        })}

                        {/* SECTION: SLAs */}
                        <tr className="bg-background dark:bg-zinc-950/40">
                            <td colSpan={3} className="p-3 text-[10px] font-bold text-primary uppercase tracking-wider">
                                Service Level Agreements (SLA)
                            </td>
                        </tr>
                        {claimTypes.map((type) => {
                            const slaA = configA.sla?.[type]
                            const slaB = configB.sla?.[type]
                            if (!configA.claimTypes?.[type]?.enabled && !configB.claimTypes?.[type]?.enabled) return null

                            return (
                                <DiffRow
                                    key={type}
                                    label={`${type} SLA Duration`}
                                    valA={slaA?.businessDays ? `${slaA.businessDays} days` : "N/A"}
                                    valB={slaB?.businessDays ? `${slaB.businessDays} days` : "N/A"}
                                />
                            )
                        })}

                        {/* SECTION: CUSTOM FIELDS */}
                        <tr className="bg-background dark:bg-zinc-950/40">
                            <td colSpan={3} className="p-3 text-[10px] font-bold text-primary uppercase tracking-wider">
                                Custom Fields Config
                            </td>
                        </tr>
                        <DiffRow
                            label="Active Custom Fields"
                            valA={configA.customFields?.map((f: any) => `${f.label} (${f.type})`).join(", ") || "None"}
                            valB={configB.customFields?.map((f: any) => `${f.label} (${f.type})`).join(", ") || "None"}
                        />
                    </TableBody>
                </Table>
            </div>
        </Card>
    )
}