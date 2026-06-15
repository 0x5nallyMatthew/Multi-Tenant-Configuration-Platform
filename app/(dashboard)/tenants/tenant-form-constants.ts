import { TenantConfig } from "@/lib/tenant-schema"

export const DEFAULT_CONFIG: TenantConfig = {
    branding: {
        companyName: "",
        logoUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=100&auto=format&fit=crop",
        primaryColor: "#6d28d9",
        secondaryColor: "#4f46e5"
    },
    claimTypes: {
        OUTPATIENT: { enabled: true, requiredDocs: ["Invoice", "Medical Report"], optionalDocs: ["Prescription"] },
        INPATIENT: { enabled: false, requiredDocs: ["Hospital Bill", "Discharge Summary"], optionalDocs: [] },
        DENTAL: { enabled: false, requiredDocs: ["Invoice", "Dental Form"], optionalDocs: [] },
        MATERNITY: { enabled: false, requiredDocs: ["Birth Certificate", "Hospital Bill"], optionalDocs: [] },
        OPTICAL: { enabled: false, requiredDocs: ["Invoice", "Prescription"], optionalDocs: [] }
    },
    approvalRules: {
        autoApproveThreshold: 20000,
        tiers: [
            { minAmount: 20000, maxAmount: 100000, role: "Assessor" },
            { minAmount: 100000, maxAmount: 500000, role: "Team Lead" },
            { minAmount: 500000, maxAmount: null, role: "Director" }
        ]
    },
    notifications: {
        claim_submitted: { enabled: true, channels: ["email"], emailTemplate: "Dear customer, your claim for {amount} has been received." },
        approved: { enabled: true, channels: ["email"], emailTemplate: "Dear customer, your claim has been approved." },
        rejected: { enabled: true, channels: ["email"], emailTemplate: "Dear customer, your claim has been rejected." },
        payment_sent: { enabled: true, channels: ["email"], emailTemplate: "Dear customer, payment has been issued." }
    },
    sla: {
        OUTPATIENT: { businessDays: 5, escalationContact: "ops@safeguard.com" },
        INPATIENT: { businessDays: 10, escalationContact: "ops@safeguard.com" },
        DENTAL: { businessDays: 7, escalationContact: "ops@safeguard.com" },
        MATERNITY: { businessDays: 7, escalationContact: "ops@safeguard.com" },
        OPTICAL: { businessDays: 7, escalationContact: "ops@safeguard.com" }
    },
    customFields: [
        { key: "employee_id", label: "Employee ID", type: "text", required: true }
    ]
}

export const FORM_STEPS = [
    { id: "branding", name: "Branding" },
    { id: "claims", name: "Claim Types" },
    { id: "approvals", name: "Approval Rules" },
    { id: "notifications", name: "Notifications & SLA" },
    { id: "fields", name: "Custom Fields" }
] as const

export const NOTIFICATION_CHANNELS = ["email", "sms", "webhook"] as const

export type TenantFormValues = { id: string; name: string; slug: string; config: TenantConfig; createdAt: Date; updatedAt: Date; ownerId: string; owner: { name: string; email: string } | undefined }