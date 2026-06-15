import { z } from "zod"

export const CLAIM_TYPES = ["OUTPATIENT", "INPATIENT", "DENTAL", "MATERNITY", "OPTICAL"] as const
export type ClaimType = (typeof CLAIM_TYPES)[number]

export const NOTIFICATION_EVENTS = ["claim_submitted", "approved", "rejected", "payment_sent"] as const
export type NotificationEvent = (typeof NOTIFICATION_EVENTS)[number]

export const NOTIFICATION_CHANNELS = ["email", "sms", "webhook"] as const
export type NotificationChannel = (typeof NOTIFICATION_CHANNELS)[number]

// Schema for Branding configuration
export const brandingSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  logoUrl: z.string().url("Must be a valid logo URL").or(z.string().startsWith("/").min(1, "Logo path is required")),
  primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Primary color must be a valid hex color"),
  secondaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Secondary color must be a valid hex color"),
})

export type BrandingConfig = z.infer<typeof brandingSchema>

// Schema for Claim Type settings
export const claimTypeSettingSchema = z.object({
  enabled: z.boolean(),
  requiredDocs: z.array(z.string()),
  optionalDocs: z.array(z.string()),
})

export type ClaimTypeSetting = z.infer<typeof claimTypeSettingSchema>

// Schema for Approval Rules
export const approvalTierSchema = z.object({
  minAmount: z.number().min(0, "Minimum amount must be >= 0"),
  maxAmount: z.number().nullable(),
  role: z.string().min(1, "Role/Committee name is required"),
})

export type ApprovalTier = z.infer<typeof approvalTierSchema>

export const approvalRulesSchema = z.object({
  autoApproveThreshold: z.number().min(0, "Auto-approval threshold must be >= 0"),
  tiers: z.array(approvalTierSchema),
})

export type ApprovalRulesConfig = z.infer<typeof approvalRulesSchema>

// Schema for Notifications
export const notificationSettingSchema = z.object({
  enabled: z.boolean(),
  channels: z.array(z.enum(NOTIFICATION_CHANNELS)),
  emailTemplate: z.string().optional(),
})

export type NotificationSetting = z.infer<typeof notificationSettingSchema>

// Schema for SLA
export const slaSettingSchema = z.object({
  businessDays: z.number().int().positive("SLA must be a positive integer"),
  escalationContact: z.string().email("Must be a valid escalation contact email"),
})

export type SlaSetting = z.infer<typeof slaSettingSchema>

// Schema for Custom Fields
export const customFieldSchema = z.object({
  key: z.string().regex(/^[a-z0-9_]+$/, "Field key must be alphanumeric and lowercase (e.g. employee_id)"),
  label: z.string().min(1, "Field label is required"),
  type: z.enum(["text", "number", "select"]),
  required: z.boolean(),
  options: z.array(z.string()).optional(), // only applicable for 'select'
})

export type CustomFieldConfig = z.infer<typeof customFieldSchema>

// Root Tenant Config Schema
export const tenantConfigSchema = z.object({
  branding: brandingSchema,
  claimTypes: z.record(z.enum(CLAIM_TYPES), claimTypeSettingSchema),
  approvalRules: approvalRulesSchema,
  notifications: z.record(z.enum(NOTIFICATION_EVENTS), notificationSettingSchema),
  sla: z.record(z.enum(CLAIM_TYPES), slaSettingSchema),
  customFields: z.array(customFieldSchema),
}).refine(
  (data) => {
    // Check if at least one claim type is enabled
    return Object.values(data.claimTypes).some((type) => type.enabled)
  },
  {
    message: "At least one claim type must be enabled",
    path: ["claimTypes"],
  }
).refine(
  (data) => {
    // Check if all custom fields of type 'select' have options
    return data.customFields.every((field) => {
      if (field.type === "select") {
        return field.options && field.options.length > 0
      }
      return true
    })
  },
  {
    message: "Custom fields of type 'select' must have at least one option",
    path: ["customFields"],
  }
)

export type TenantConfig = z.infer<typeof tenantConfigSchema>
