import { TenantConfig, ClaimType } from "./tenant-schema"
import { calculateSlaDeadline } from "./utils"

export interface ClaimData {
  type: ClaimType
  amount: number
  submittedAt: Date | string
  customFields: Record<string, any>
}

export interface CustomFieldValidationResult {
  field: string
  label: string
  valid: boolean
  message?: string
}

export interface ClaimProcessingResult {
  success: boolean
  error?: string
  tenantId?: string
  claimType: ClaimType
  amount: number
  requiredDocuments: string[]
  optionalDocuments: string[]
  isAutoApproved: boolean
  approvalRoute: Array<{
    role: string
    minAmount: number
    maxAmount: number | null
  }>
  notifications: Array<{
    event: string
    channels: string[]
    template?: string
  }>
  slaBusinessDays: number
  slaDeadline: string
  slaEscalationContact: string
  customFieldValidation: CustomFieldValidationResult[]
  missingRequiredFields: string[]
  isValid: boolean
}

/**
 * Pure function to process a claim against a tenant configuration.
 */
export function processClaim(
  config: TenantConfig,
  claimData: ClaimData,
  tenantId?: string
): ClaimProcessingResult {
  const submittedAtDate = new Date(claimData.submittedAt)
  const claimType = claimData.type

  // 1. Verify if claim type is enabled
  const typeConfig = config.claimTypes[claimType]
  if (!typeConfig || !typeConfig.enabled) {
    return {
      success: false,
      error: `Claim type ${claimType} is not enabled for this tenant.`,
      claimType,
      amount: claimData.amount,
      requiredDocuments: [],
      optionalDocuments: [],
      isAutoApproved: false,
      approvalRoute: [],
      notifications: [],
      slaBusinessDays: 0,
      slaDeadline: submittedAtDate.toISOString(),
      slaEscalationContact: "",
      customFieldValidation: [],
      missingRequiredFields: [],
      isValid: false,
    }
  }

  // 2. Documents
  const requiredDocuments = typeConfig.requiredDocs
  const optionalDocuments = typeConfig.optionalDocs

  // 3. Auto-approval & Approval Route
  const threshold = config.approvalRules.autoApproveThreshold
  const isAutoApproved = claimData.amount < threshold

  let approvalRoute: Array<{ role: string; minAmount: number; maxAmount: number | null }> = []
  if (!isAutoApproved) {
    // Determine which tiers are traversed. Sort tiers by minAmount.
    const sortedTiers = [...config.approvalRules.tiers].sort((a, b) => a.minAmount - b.minAmount)

    // Find all tiers that apply to this amount sequentially
    // e.g. if amount is 150k, and tiers are: assessor (10k-100k), team lead (100k-500k), director (500k+)
    // We include assessor and team lead in the approval route because the claim must go through them.
    for (const tier of sortedTiers) {
      if (claimData.amount >= tier.minAmount) {
        approvalRoute.push(tier)
      }
    }
  }

  // 4. Notifications
  const notifications: Array<{ event: string; channels: string[]; template?: string }> = []

  // claim_submitted is always triggered
  const submitNotify = config.notifications.claim_submitted
  if (submitNotify && submitNotify.enabled) {
    notifications.push({
      event: "claim_submitted",
      channels: submitNotify.channels,
      template: submitNotify.emailTemplate,
    })
  }

  if (isAutoApproved) {
    // If auto-approved, triggers approved and payment_sent automatically
    const approvedNotify = config.notifications.approved
    if (approvedNotify && approvedNotify.enabled) {
      notifications.push({
        event: "approved",
        channels: approvedNotify.channels,
        template: approvedNotify.emailTemplate,
      })
    }
    const paymentNotify = config.notifications.payment_sent
    if (paymentNotify && paymentNotify.enabled) {
      notifications.push({
        event: "payment_sent",
        channels: paymentNotify.channels,
        template: paymentNotify.emailTemplate,
      })
    }
  }

  // 5. SLA
  const slaConfig = config.sla[claimType]
  const slaBusinessDays = slaConfig ? slaConfig.businessDays : 5 // Default fallback
  const slaEscalationContact = slaConfig ? slaConfig.escalationContact : ""
  const slaDeadline = calculateSlaDeadline(submittedAtDate.toISOString(), slaBusinessDays)

  // 6. Custom Fields Validation
  const customFieldValidation: CustomFieldValidationResult[] = []
  const missingRequiredFields: string[] = []
  let customFieldsValid = true

  for (const field of config.customFields) {
    const value = claimData.customFields?.[field.key]
    const hasValue = value !== undefined && value !== null && value !== ""

    if (field.required && !hasValue) {
      missingRequiredFields.push(field.key)
      customFieldValidation.push({
        field: field.key,
        label: field.label,
        valid: false,
        message: `${field.label} is required.`,
      })
      customFieldsValid = false
      continue
    }

    if (hasValue) {
      if (field.type === "number") {
        const numVal = Number(value)
        if (isNaN(numVal)) {
          customFieldValidation.push({
            field: field.key,
            label: field.label,
            valid: false,
            message: `${field.label} must be a number.`,
          })
          customFieldsValid = false
          continue
        }
      }

      if (field.type === "select" && field.options) {
        if (!field.options.includes(String(value))) {
          customFieldValidation.push({
            field: field.key,
            label: field.label,
            valid: false,
            message: `${field.label} must be one of the selected options: ${field.options.join(", ")}.`,
          })
          customFieldsValid = false
          continue
        }
      }

      // If it passes validation
      customFieldValidation.push({
        field: field.key,
        label: field.label,
        valid: true,
      })
    }
  }

  const isValid = customFieldsValid && missingRequiredFields.length === 0

  return {
    success: true,
    tenantId,
    claimType,
    amount: claimData.amount,
    requiredDocuments,
    optionalDocuments,
    isAutoApproved,
    approvalRoute,
    notifications,
    slaBusinessDays,
    slaDeadline,
    slaEscalationContact,
    customFieldValidation,
    missingRequiredFields,
    isValid,
  }
}
