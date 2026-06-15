"use client"

import React, { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldAlert,
  FileText,
  Bell,
  UserCheck,
  ChevronRight,
  RefreshCw,
  Sliders
} from "lucide-react"
import { formatDate } from "@/lib/utils"
import { TenantConfig, ClaimType, CustomFieldConfig } from "@/lib/tenant-schema"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CustomFieldValidation {
  field: string
  label: string
  valid: boolean
  message?: string
}

interface ApprovalRouteTier {
  role: string
  minAmount: number
  maxAmount: number | null
}

interface NotificationResult {
  event: string
  channels: string[]
  template?: string
}

interface SimulationResult {
  isValid: boolean
  isAutoApproved: boolean
  amount: number
  claimType: string
  slaBusinessDays: number
  slaDeadline: string
  customFieldValidation: CustomFieldValidation[]
  approvalRoute: ApprovalRouteTier[]
  requiredDocuments: string[]
  optionalDocuments: string[]
  notifications: NotificationResult[]
}

interface Tenant {
  id: string
  name: string
  slug: string
  config: TenantConfig
}

interface PreviewClientProps {
  tenant: Tenant
}

export default function PreviewClient({ tenant }: PreviewClientProps) {
  const router = useRouter()
  const config = tenant.config

  // Input states
  const enabledTypes = useMemo(() => {
    return Object.entries(config.claimTypes)
      .filter(([, value]) => value.enabled)
      .map(([key]) => key)
  }, [config.claimTypes])

  const [claimType, setClaimType] = useState<ClaimType>(enabledTypes[0] as ClaimType || "OUTPATIENT")
  const [amount, setAmount] = useState<number>(2500)
  const [submittedAt, setSubmittedAt] = useState<string>(
    new Date().toISOString().split("T")[0]
  )

  // Initialize custom fields with useMemo to avoid setState in useEffect
  const initialCustomFieldValues = useMemo(() => {
    const initialFields: Record<string, string | number> = {}
    config.customFields.forEach((f: CustomFieldConfig) => {
      initialFields[f.key] = f.type === "number" ? "" : (f.type === "select" ? (f.options?.[0] || "") : "")
    })
    return initialFields
  }, [config.customFields])

  const [customFieldValues, setCustomFieldValues] = useState<Record<string, string | number>>(initialCustomFieldValues)

  // Simulation results
  const [result, setResult] = useState<SimulationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Safe date formatting helper
  const safeFormatDate = (dateString: string) => {
    if (!dateString || isNaN(new Date(dateString).getTime())) {
      return "N/A"
    }
    return formatDate(dateString)
  }

  const handleCustomFieldChange = (key: string, value: string | number) => {
    setCustomFieldValues({
      ...customFieldValues,
      [key]: value
    })
  }

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    // Parse numeric custom fields
    const parsedCustomFields: Record<string, string | number> = {}
    config.customFields.forEach((f: CustomFieldConfig) => {
      const val = customFieldValues[f.key]
      if (f.type === "number" && val !== "") {
        parsedCustomFields[f.key] = Number(val)
      } else {
        parsedCustomFields[f.key] = val
      }
    })

    try {
      const response = await fetch("/api/claims/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId: tenant.id,
          claimData: {
            type: claimType,
            amount: Number(amount),
            submittedAt,
            customFields: parsedCustomFields
          }
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Simulation failed")
      }

      setResult(data)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to process simulation request"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 border-b border-border dark:border-zinc-800 pb-4">
        <button
          type="button"
          onClick={() => router.push("/tenants")}
          className="p-2 bg-card dark:bg-zinc-900 border border-border dark:border-zinc-850 hover:border-border dark:border-zinc-700 text-muted-foreground dark:text-zinc-400 hover:text-foreground rounded-xl transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Claims Rule Simulator</h2>
          <p className="text-xs text-muted-foreground dark:text-zinc-400 mt-0.5">
            Test policy limits, custom validation rules, and approvals for <span className="font-semibold text-primary">{tenant.name}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">

        {/* Left Column: Input Form (5 cols) */}
        <div className="lg:col-span-5 bg-card dark:bg-zinc-900/40 border border-border dark:border-zinc-850 p-4 md:p-6 rounded-2xl h-fit space-y-6 backdrop-blur-sm">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider pb-2 border-b border-border dark:border-zinc-800 flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-primary" />
            Claim Input Details
          </h3>

          <form onSubmit={handleSimulate} className="space-y-5">
            <div>
              <Label className="text-xs font-semibold text-muted-foreground dark:text-zinc-400 uppercase tracking-wider mb-2 block">
                Claim Type
              </Label>
              {enabledTypes.length === 0 ? (
                <div className="text-xs text-red-400 bg-red-950/20 border border-red-900/30 p-3 rounded-xl">
                  No claim types are enabled for this tenant. Enable at least one claim type in configuration first.
                </div>
              ) : (
                <Select value={claimType} onValueChange={(value) => value && setClaimType(value as ClaimType)}>
                  <SelectTrigger className="w-full px-4 py-3 h-auto bg-background dark:bg-zinc-950 border-border dark:border-zinc-800 rounded-xl text-sm">
                    <SelectValue placeholder="Select claim type" />
                  </SelectTrigger>
                  <SelectContent>
                    {enabledTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div>
              <Label className="text-xs font-semibold text-muted-foreground dark:text-zinc-400 uppercase tracking-wider mb-2 block">
                Claim Amount ($)
              </Label>
              <Input type="number" required
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))} className="bg-background dark:bg-zinc-950 border-border dark:border-zinc-800 focus-visible:ring-primary font-mono"
                placeholder="2500"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold text-muted-foreground dark:text-zinc-400 uppercase tracking-wider mb-2 block">
                Submission Date
              </Label>
              <Input type="date" required
                value={submittedAt}
                onChange={(e) => setSubmittedAt(e.target.value)} className="bg-background dark:bg-zinc-950 border-border dark:border-zinc-800 focus-visible:ring-primary font-mono"
              />
            </div>

            {/* Custom fields dynamically loaded from tenant config */}
            {config.customFields.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-border dark:border-zinc-800/80">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground dark:text-zinc-400">Tenant Custom Fields</h4>
                {config.customFields.map((field: CustomFieldConfig) => (
                  <div key={field.key}>
                    <Label className="block text-xs font-semibold text-muted-foreground dark:text-zinc-400 mb-2">
                      {field.label} {field.required && <span className="text-red-400">*</span>}
                    </Label>

                    {field.type === "select" ? (
                      <Select
                        value={customFieldValues[field.key] as string || undefined}
                        onValueChange={(value) => handleCustomFieldChange(field.key, value)}
                      >
                        <SelectTrigger className="w-full px-4 py-3 h-auto bg-background dark:bg-zinc-950 border-border dark:border-zinc-800 rounded-xl text-sm">
                          <SelectValue placeholder="Select option..." />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options?.map((opt: string) => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        type={field.type === "number" ? "number" : "text"}
                        required={field.required}
                        value={customFieldValues[field.key] || ""}
                        onChange={(e) => handleCustomFieldChange(field.key, e.target.value)}
                        className="bg-background dark:bg-zinc-950 border-border dark:border-zinc-800 rounded-xl text-sm text-foreground placeholder-zinc-650 transition-all outline-none"
                        placeholder={`Enter ${field.label}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || enabledTypes.length === 0}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary hover:bg-primary disabled:bg-primary-dark text-primary-foreground font-semibold rounded-xl text-sm transition-all duration-200 cursor-pointer shadow-lg shadow-primary/10 hover:shadow-primary/20"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Simulating...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Simulate Engine
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Results Display (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {error && (
            <div className="p-4 bg-red-950/30 border border-red-900/30 rounded-2xl text-red-400 text-sm">
              {error}
            </div>
          )}

          {!result && !loading && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center border border-border dark:border-zinc-850 bg-card dark:bg-zinc-900/10 rounded-2xl text-center p-8">
              <div className="w-12 h-12 rounded-xl bg-card dark:bg-zinc-900 border border-border dark:border-zinc-800 flex items-center justify-center text-muted-foreground dark:text-zinc-500 mb-3 animate-pulse">
                <Play className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">Ready for Simulation</h4>
              <p className="text-xs text-muted-foreground dark:text-zinc-500 mt-1 max-w-xs leading-relaxed">
                Fill out the claim inputs on the left and run the simulation to check processing logic, SLA timelines, approval routings, and notifications.
              </p>
            </div>
          )}

          {loading && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center border border-border dark:border-zinc-850 bg-card dark:bg-zinc-900/10 rounded-2xl text-center p-8">
              <RefreshCw className="w-8 h-8 text-primary animate-spin mb-3" />
              <h4 className="text-sm font-bold text-foreground">Running claim engine</h4>
              <p className="text-xs text-muted-foreground dark:text-zinc-500 mt-1">Evaluating rules, checking custom schema, and generating routing path...</p>
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-in fade-in duration-300">

              {/* Card 1: Engine Status Badge */}
              <div className="bg-card dark:bg-zinc-900/40 border border-border dark:border-zinc-850 rounded-2xl p-4 md:p-6 backdrop-blur-sm shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground dark:text-zinc-400">Processing Verdict</h4>
                  <div className="flex items-center gap-2 mt-2">
                    {result.isValid ? (
                      result.isAutoApproved ? (
                        <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-900/30 px-3.5 py-1.5 rounded-xl text-sm font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                          Auto Approved
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-amber-400 bg-amber-500/10 border border-amber-900/30 px-3.5 py-1.5 rounded-xl text-sm font-bold">
                          <Clock className="w-4 h-4" />
                          Pending Review
                        </div>
                      )
                    ) : (
                      <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-900/30 px-3.5 py-1.5 rounded-xl text-sm font-bold">
                        <XCircle className="w-4 h-4" />
                        Validation Failed
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground dark:text-zinc-500 uppercase block">Claim SLA Limit</span>
                  <span className="text-sm font-bold text-foreground mt-1 block">
                    {result.slaBusinessDays} Business Days
                  </span>
                  <span className="text-[10px] text-muted-foreground dark:text-zinc-400 font-mono block mt-0.5">
                    Deadline: {safeFormatDate(result.slaDeadline)}
                  </span>
                </div>
              </div>

              {/* Card 2: Custom fields validation */}
              {result.customFieldValidation.length > 0 && (
                <div className="bg-card dark:bg-zinc-900/40 border border-border dark:border-zinc-850 rounded-2xl p-4 md:p-6 backdrop-blur-sm shadow-xl space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground dark:text-zinc-400 border-b border-border dark:border-zinc-800 pb-2 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-primary" />
                    Custom Fields Validation Schema
                  </h4>

                  <div className="space-y-2.5">
                    {result.customFieldValidation.map((field) => (
                      <div key={field.field} className="flex items-center justify-between text-xs p-2.5 bg-background dark:bg-zinc-950/50 border border-border dark:border-zinc-850 rounded-xl">
                        <span className="font-semibold text-foreground dark:text-zinc-300">{field.label} <code className="text-[10px] text-muted-foreground dark:text-zinc-500 font-mono">({field.field})</code></span>
                        {field.valid ? (
                          <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Passed
                          </span>
                        ) : (
                          <span className="text-red-400 font-medium flex items-center gap-1.5" title={field.message}>
                            <XCircle className="w-3.5 h-3.5" /> {field.message || "Failed"}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Card 3: Approval Routing Path */}
              {result.isValid && !result.isAutoApproved && (
                <div className="bg-card dark:bg-zinc-900/40 border border-border dark:border-zinc-850 rounded-2xl p-4 md:p-6 backdrop-blur-sm shadow-xl space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground dark:text-zinc-400 border-b border-border dark:border-zinc-800 pb-2 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-primary" />
                    Sequential Approval Routing Path
                  </h4>

                  {result.approvalRoute.length === 0 ? (
                    <div className="p-4 bg-red-950/20 border border-red-900/30 text-xs text-red-400 rounded-xl flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4" />
                      Warning: No approval tiers match this amount. The claim might stall in routing.
                    </div>
                  ) : (
                    <div className="flex flex-col md:flex-row md:items-center gap-3 py-2 flex-wrap">
                      {result.approvalRoute.map((tier, idx) => (
                        <React.Fragment key={idx}>
                          {idx > 0 && <ChevronRight className="w-4 h-4 text-zinc-600 hidden md:block" />}
                          <div className="flex-1 bg-background dark:bg-zinc-950/50 border border-border dark:border-zinc-800 p-4 rounded-xl flex items-center gap-3">
                            <div className="min-w-6 size-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                              {idx + 1}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-foreground">{tier.role}</p>
                              <p className="text-[10px] text-muted-foreground dark:text-zinc-500">
                                {tier.maxAmount ? `$${tier.minAmount.toLocaleString()} - $${tier.maxAmount.toLocaleString()}` : `>= $${tier.minAmount.toLocaleString()}`}
                              </p>
                            </div>
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Card 4: Required Documents Checklists */}
              {result.isValid && (
                <div className="bg-card dark:bg-zinc-900/40 border border-border dark:border-zinc-850 rounded-2xl p-4 md:p-6 backdrop-blur-sm shadow-xl space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground dark:text-zinc-400 border-b border-border dark:border-zinc-800 pb-2 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-primary" />
                    Required Documents Checklist
                  </h4>

                  {result.requiredDocuments.length === 0 && result.optionalDocuments.length === 0 ? (
                    <p className="text-xs text-muted-foreground dark:text-zinc-500">No documents configured for this claim type.</p>
                  ) : (
                    <div className="space-y-3">
                      {result.requiredDocuments.map((doc) => (
                        <Label key={doc} className="flex items-center gap-3 p-3 bg-background dark:bg-zinc-950/40 border border-border dark:border-zinc-850 hover:border-border dark:border-zinc-800 rounded-xl cursor-pointer text-xs select-none">
                          <input type="checkbox" className="w-4 h-4 text-primary bg-background dark:bg-zinc-950 border-border dark:border-zinc-800 rounded focus:ring-primary cursor-pointer" />
                          <span className="font-medium text-foreground">{doc}</span>
                          <span className="text-[10px] text-red-400 bg-red-950/20 px-2 py-0.5 rounded border border-red-900/25 ml-auto">Required</span>
                        </Label>
                      ))}

                      {result.optionalDocuments.map((doc) => (
                        <Label key={doc} className="flex items-center gap-3 p-3 bg-background dark:bg-zinc-950/40 border border-border dark:border-zinc-850 hover:border-border dark:border-zinc-800 rounded-xl cursor-pointer text-xs select-none">
                          <input type="checkbox" className="w-4 h-4 text-primary bg-background dark:bg-zinc-950 border-border dark:border-zinc-800 rounded focus:ring-primary cursor-pointer" />
                          <span className="font-medium text-foreground dark:text-zinc-300">{doc}</span>
                          <span className="text-[10px] text-muted-foreground dark:text-zinc-500 bg-card dark:bg-zinc-900 px-2 py-0.5 rounded ml-auto">Optional</span>
                        </Label>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Card 5: Triggered Notifications Log */}
              {result.isValid && (
                <div className="bg-card dark:bg-zinc-900/40 border border-border dark:border-zinc-850 rounded-2xl p-4 md:p-6 backdrop-blur-sm shadow-xl space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground dark:text-zinc-400 border-b border-border dark:border-zinc-800 pb-2 flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-primary" />
                    Triggered Notification Events Log
                  </h4>

                  {result.notifications.length === 0 ? (
                    <p className="text-xs text-muted-foreground dark:text-zinc-500">No notification triggers configured for these processing events.</p>
                  ) : (
                    <div className="space-y-3.5">
                      {result.notifications.map((notif) => (
                        <div key={notif.event} className="p-4 bg-background dark:bg-zinc-950/50 border border-border dark:border-zinc-850 rounded-xl space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-foreground capitalize">{notif.event.replace("_", " ")}</span>
                            <div className="flex gap-1.5">
                              {notif.channels.map((chan) => (
                                <span key={chan} className="text-[10px] bg-primary/10 border border-primary/20 text-primary px-2 py-0.5 rounded-full capitalize">
                                  {chan}
                                </span>
                              ))}
                            </div>
                          </div>
                          {notif.template && (
                            <div className="text-[10px] bg-background dark:bg-zinc-950 border border-zinc-900 p-2.5 rounded-lg text-muted-foreground dark:text-zinc-400 font-mono leading-relaxed">
                              {notif.template.replace("{amount}", `$${result.amount.toLocaleString()}`).replace("{claimType}", result.claimType).replace("{date}", safeFormatDate(submittedAt))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  )
}
