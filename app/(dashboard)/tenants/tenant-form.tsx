"use client"

import React, { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Loader2, Settings2 } from "lucide-react"
import { TenantConfig, ClaimType, NotificationEvent, NotificationChannel } from "@/lib/tenant-schema"
import { BrandingStep } from "./components/BrandingStep"
import { ClaimTypesStep } from "./components/ClaimTypesStep"
import { ApprovalRulesStep } from "./components/ApprovalRulesStep"
import { NotificationsStep } from "./components/NotificationsStep"
import { CustomFieldsStep } from "./components/CustomFieldsStep"
import { MotionWrapper } from "@/components/motion-wrapper"
import { DEFAULT_CONFIG } from "./tenant-form-constants"

interface TenantFormData {
  name: string
  slug: string
  config: TenantConfig
}

interface TenantFormProps {
  initialData?: TenantFormData
  onSubmit?: (data: TenantConfig, name: string, slug: string) => Promise<void>
  isSubmitting?: boolean
  isEdit?: boolean
}

export function TenantForm({ initialData, onSubmit, isSubmitting = false, isEdit = false }: TenantFormProps) {
  const [activeTab, setActiveTab] = useState("branding")
  const [config, setConfig] = useState<TenantConfig>(() => {
    if (initialData) return initialData.config
    return DEFAULT_CONFIG
  })

  const [name, setName] = useState(initialData?.name || "")
  const [slug, setSlug] = useState(initialData?.slug || "")

  const handleBrandingUpdate = useCallback((field: string, value: string) => {
    setConfig(prev => ({
      ...prev,
      branding: { ...prev.branding, [field]: value }
    }))
  }, [])

  const handleToggleClaimType = useCallback((type: ClaimType) => {
    setConfig(prev => ({
      ...prev,
      claimTypes: {
        ...prev.claimTypes,
        [type]: { ...prev.claimTypes[type], enabled: !prev.claimTypes[type].enabled }
      }
    }))
  }, [])

  const handleUpdateDocs = useCallback((type: ClaimType, docField: "requiredDocs" | "optionalDocs", value: string) => {
    const docs = value.split(",").map(d => d.trim()).filter(Boolean)
    setConfig(prev => ({
      ...prev,
      claimTypes: {
        ...prev.claimTypes,
        [type]: { ...prev.claimTypes[type], [docField]: docs }
      }
    }))
  }, [])

  const handleUpdateApprovalRule = useCallback((field: string, value: number) => {
    setConfig(prev => ({
      ...prev,
      approvalRules: { ...prev.approvalRules, [field]: value }
    }))
  }, [])

  const handleAddTier = useCallback(() => {
    setConfig(prev => ({
      ...prev,
      approvalRules: {
        ...prev.approvalRules,
        tiers: [...prev.approvalRules.tiers, { role: "", minAmount: 0, maxAmount: null }]
      }
    }))
  }, [])

  const handleRemoveTier = useCallback((index: number) => {
    setConfig(prev => ({
      ...prev,
      approvalRules: {
        ...prev.approvalRules,
        tiers: prev.approvalRules.tiers.filter((_, i) => i !== index)
      }
    }))
  }, [])

  const handleUpdateTier = useCallback((index: number, field: string, value: string) => {
    setConfig(prev => {
      const newTiers = [...prev.approvalRules.tiers]
      const numericValue = (field === "minAmount" || field === "maxAmount") ? Number(value) : value
      newTiers[index] = {
        ...newTiers[index],
        [field]: numericValue
      }
      return {
        ...prev,
        approvalRules: { ...prev.approvalRules, tiers: newTiers }
      }
    })
  }, [])

  const handleUpdateNotification = useCallback((event: NotificationEvent, field: string, value: boolean | string | string[]) => {
    setConfig(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [event]: { ...prev.notifications[event], [field]: value }
      }
    }))
  }, [])

  const handleToggleNotificationChannel = useCallback((event: NotificationEvent, channel: string) => {
    setConfig(prev => {
      const currentChannels = prev.notifications[event].channels
      const newChannels = currentChannels.includes(channel as NotificationChannel)
        ? currentChannels.filter(c => c !== channel as NotificationChannel)
        : [...currentChannels, channel as NotificationChannel]
      return {
        ...prev,
        notifications: {
          ...prev.notifications,
          [event]: { ...prev.notifications[event], channels: newChannels }
        }
      }
    })
  }, [])

  const handleUpdateSla = useCallback((type: ClaimType, field: string, value: string) => {
    const numericValue = field === "businessDays" ? Number(value) : value
    setConfig(prev => ({
      ...prev,
      sla: {
        ...prev.sla,
        [type]: { ...prev.sla[type], [field]: numericValue }
      }
    }))
  }, [])

  const handleAddCustomField = useCallback(() => {
    setConfig(prev => ({
      ...prev,
      customFields: [...prev.customFields, { key: "", label: "", type: "text", required: false, options: [] }]
    }))
  }, [])

  const handleRemoveCustomField = useCallback((index: number) => {
    setConfig(prev => ({
      ...prev,
      customFields: prev.customFields.filter((_, i) => i !== index)
    }))
  }, [])

  const handleUpdateCustomField = useCallback((index: number, field: string, value: string | boolean | string[]) => {
    setConfig(prev => {
      const newFields = [...prev.customFields]
      const finalValue = field === "options" ? (value as string).split(",").map((o: string) => o.trim()).filter(Boolean) : value
      newFields[index] = {
        ...newFields[index],
        [field]: finalValue
      }
      return {
        ...prev,
        customFields: newFields
      }
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (onSubmit) {
      try {
        await onSubmit(config, name, slug)
        toast.success(isEdit ? "Tenant updated successfully" : "Tenant created successfully")
      } catch {
        toast.error("Failed to save tenant configuration")
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <MotionWrapper direction="down" duration={0.5}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
              <Settings2 className="w-8 h-8 text-primary" />
              {isEdit ? "Edit Tenant" : "Create New Tenant"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Configure the operational parameters for this tenant.</p>
          </div>
          <Button type="submit" disabled={isSubmitting ?? false} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg cursor-pointer">
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isEdit ? "Save Changes" : "Create Tenant"}
          </Button>
        </div>
      </MotionWrapper>


      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 flex flex-col">
        <MotionWrapper direction="down" duration={0.5}>
          <TabsList className="grid grid-cols-2 gap-2 md:grid-cols-5 w-full bg-muted/50 p-1 rounded-xl border border-border md:min-h-10 min-h-[150px]">
            <TabsTrigger value="branding" className="rounded-lg cursor-pointer">Branding</TabsTrigger>
            <TabsTrigger value="claims" className="rounded-lg cursor-pointer">Claim Types</TabsTrigger>
            <TabsTrigger value="approval" className="rounded-lg cursor-pointer">Approval</TabsTrigger>
            <TabsTrigger value="notifications" className="rounded-lg cursor-pointer">Notifications</TabsTrigger>
            <TabsTrigger value="fields" className="rounded-lg cursor-pointer">Custom Fields</TabsTrigger>
          </TabsList>
        </MotionWrapper>

        <MotionWrapper direction="up" duration={0.5}>

          <Card className="p-6 bg-background border-border shadow-sm">
            <TabsContent value="branding" className="space-y-6 outline-none">
              <BrandingStep
                name={name}
                slug={slug}
                isEdit={isEdit}
                config={config}
                onNameChange={setName}
                onSlugChange={setSlug}
                onBrandingUpdate={handleBrandingUpdate}
              />
            </TabsContent>

            <TabsContent value="claims" className="outline-none">
              <ClaimTypesStep
                config={config}
                onToggleClaimType={handleToggleClaimType}
                onUpdateDocs={handleUpdateDocs}
              />
            </TabsContent>

            <TabsContent value="approval" className="outline-none">
              <ApprovalRulesStep
                config={config}
                onUpdateApprovalRule={handleUpdateApprovalRule}
                onAddTier={handleAddTier}
                onRemoveTier={handleRemoveTier}
                onUpdateTier={handleUpdateTier}
              />
            </TabsContent>

            <TabsContent value="notifications" className="outline-none">
              <NotificationsStep
                config={config}
                onUpdateNotification={handleUpdateNotification}
                onToggleNotificationChannel={handleToggleNotificationChannel}
                onUpdateSla={handleUpdateSla}
              />
            </TabsContent>

            <TabsContent value="fields" className="outline-none">
              <CustomFieldsStep
                config={config}
                onAddCustomField={handleAddCustomField}
                onRemoveCustomField={handleRemoveCustomField}
                onUpdateCustomField={handleUpdateCustomField}
              />
            </TabsContent>
          </Card>
        </MotionWrapper>
      </Tabs>
    </form >
  )
}
