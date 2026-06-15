import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // Clean existing data
  await prisma.tenantVersion.deleteMany()
  await prisma.tenant.deleteMany()
  await prisma.user.deleteMany()

  // Hash passwords
  const adminPassword = await bcrypt.hash("admin123", 12)
  const operatorPassword = await bcrypt.hash("operator123", 12)

  // 1. Create Users
  const admin = await prisma.user.create({
    data: {
      email: "admin@company.com",
      name: "System Admin",
      password: adminPassword,
      role: "admin",
    }
  })

  const operator = await prisma.user.create({
    data: {
      email: "operator@company.com",
      name: "Claim Operator",
      password: operatorPassword,
      role: "operator",
    }
  })

  console.log("Users created:", { admin: admin.email, operator: operator.email })

  // 2. Tenant 1: SafeGuard
  const safeguardConfig = {
    branding: {
      companyName: "SafeGuard",
      logoUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=100&auto=format&fit=crop",
      primaryColor: "#1e3a8a",
      secondaryColor: "#0d9488"
    },
    claimTypes: {
      OUTPATIENT: { enabled: true, requiredDocs: ["Invoice", "Medical Report"], optionalDocs: ["Prescription"] },
      INPATIENT: { enabled: false, requiredDocs: ["Hospital Bill", "Discharge Summary"], optionalDocs: [] },
      DENTAL: { enabled: true, requiredDocs: ["Dental Invoice", "Dental Record"], optionalDocs: [] },
      MATERNITY: { enabled: false, requiredDocs: ["Birth Certificate", "Hospital Bill"], optionalDocs: [] },
      OPTICAL: { enabled: false, requiredDocs: ["Optical Bill"], optionalDocs: [] }
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
      claim_submitted: { enabled: true, channels: ["email"], emailTemplate: "Dear customer, your claim for {amount} has been received and is being processed by SafeGuard." },
      approved: { enabled: true, channels: ["email"], emailTemplate: "Dear customer, we are pleased to inform you that your claim has been approved." },
      rejected: { enabled: true, channels: ["email"], emailTemplate: "Dear customer, your claim has been declined." },
      payment_sent: { enabled: true, channels: ["email"], emailTemplate: "Dear customer, payment has been issued for your claim." }
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

  const safeguard = await prisma.tenant.create({
    data: {
      name: "SafeGuard",
      slug: "safeguard",
      config: safeguardConfig,
      ownerId: operator.id,
      versions: {
        create: {
          config: safeguardConfig,
          version: 1,
          name: "SafeGuard",
          slug: "safeguard",
          note: "Initial seed configuration for SafeGuard"
        }
      }
    }
  })

  // 3. Tenant 2: HealthFirst
  const healthfirstConfig = {
    branding: {
      companyName: "HealthFirst",
      logoUrl: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=100&auto=format&fit=crop",
      primaryColor: "#059669",
      secondaryColor: "#0284c7"
    },
    claimTypes: {
      OUTPATIENT: { enabled: true, requiredDocs: ["Invoice"], optionalDocs: ["Medical Report"] },
      INPATIENT: { enabled: true, requiredDocs: ["Hospital Bill", "Discharge Summary"], optionalDocs: [] },
      DENTAL: { enabled: false, requiredDocs: ["Dental Bill"], optionalDocs: [] },
      MATERNITY: { enabled: false, requiredDocs: ["Birth Certificate"], optionalDocs: [] },
      OPTICAL: { enabled: true, requiredDocs: ["Optical Bill", "Prescription"], optionalDocs: [] }
    },
    approvalRules: {
      autoApproveThreshold: 5000,
      tiers: [
        { minAmount: 5000, maxAmount: 50000, role: "Assessor" },
        { minAmount: 50000, maxAmount: null, role: "Manager" }
      ]
    },
    notifications: {
      claim_submitted: { enabled: true, channels: ["email"], emailTemplate: "Hello, HealthFirst has received your claim." },
      approved: { enabled: true, channels: ["email"], emailTemplate: "Hello, your claim has been approved." },
      rejected: { enabled: true, channels: ["email"], emailTemplate: "Hello, your claim was not approved." },
      payment_sent: { enabled: true, channels: ["email"], emailTemplate: "Hello, payment has been sent." }
    },
    sla: {
      OUTPATIENT: { businessDays: 3, escalationContact: "manager@healthfirst.com" },
      INPATIENT: { businessDays: 7, escalationContact: "manager@healthfirst.com" },
      DENTAL: { businessDays: 5, escalationContact: "manager@healthfirst.com" },
      MATERNITY: { businessDays: 5, escalationContact: "manager@healthfirst.com" },
      OPTICAL: { businessDays: 5, escalationContact: "manager@healthfirst.com" }
    },
    customFields: [
      { key: "member_tier", label: "Member Tier", type: "select", required: true, options: ["Gold", "Silver", "Bronze"] }
    ]
  }

  const healthfirst = await prisma.tenant.create({
    data: {
      name: "HealthFirst",
      slug: "healthfirst",
      config: healthfirstConfig,
      ownerId: operator.id,
      versions: {
        create: {
          config: healthfirstConfig,
          version: 1,
          name: "HealthFirst",
          slug: "healthfirst",
          note: "Initial seed configuration for HealthFirst"
        }
      }
    }
  })

  // 4. Tenant 3: GovHealth
  const govhealthConfig = {
    branding: {
      companyName: "GovHealth",
      logoUrl: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=100&auto=format&fit=crop",
      primaryColor: "#b91c1c",
      secondaryColor: "#4b5563"
    },
    claimTypes: {
      OUTPATIENT: { enabled: true, requiredDocs: ["Official Receipt", "Medical Certificate"], optionalDocs: [] },
      INPATIENT: { enabled: true, requiredDocs: ["Itemized Hospital Bill", "Discharge Summary"], optionalDocs: [] },
      DENTAL: { enabled: false, requiredDocs: [], optionalDocs: [] },
      MATERNITY: { enabled: true, requiredDocs: ["Birth Certificate", "Official Receipt"], optionalDocs: [] },
      OPTICAL: { enabled: false, requiredDocs: [], optionalDocs: [] }
    },
    approvalRules: {
      autoApproveThreshold: 0, // No auto approval
      tiers: [
        { minAmount: 0, maxAmount: null, role: "Committee Board" }
      ]
    },
    notifications: {
      claim_submitted: { enabled: true, channels: ["email"], emailTemplate: "Notification: Government Claim submitted successfully." },
      approved: { enabled: true, channels: ["email"], emailTemplate: "Notification: Government Claim approved." },
      rejected: { enabled: true, channels: ["email"], emailTemplate: "Notification: Government Claim rejected." },
      payment_sent: { enabled: true, channels: ["email"], emailTemplate: "Notification: Government Payment disbursed." }
    },
    sla: {
      OUTPATIENT: { businessDays: 15, escalationContact: "board@govhealth.gov" },
      INPATIENT: { businessDays: 30, escalationContact: "board@govhealth.gov" },
      DENTAL: { businessDays: 20, escalationContact: "board@govhealth.gov" },
      MATERNITY: { businessDays: 20, escalationContact: "board@govhealth.gov" },
      OPTICAL: { businessDays: 20, escalationContact: "board@govhealth.gov" }
    },
    customFields: [
      { key: "social_security_number", label: "Social Security Number", type: "text", required: true }
    ]
  }

  const govhealth = await prisma.tenant.create({
    data: {
      name: "GovHealth",
      slug: "govhealth",
      config: govhealthConfig,
      ownerId: admin.id, // Owned by admin
      versions: {
        create: {
          config: govhealthConfig,
          version: 1,
          name: "GovHealth",
          slug: "govhealth",
          note: "Initial seed configuration for GovHealth"
        }
      }
    }
  })

  console.log("Database seeded successfully with 3 tenants!")
}

main()
  .catch((e) => {
    console.error("Error during seed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
