# Multi-Tenant Configuration Platform

A Next.js 16 application for managing multi-tenant insurance configuration — branding, claim types, approval rules, notifications, SLAs, and custom fields — with version history, audit trails, and a configuration diff engine.

## Overview

This platform enables insurance organizations to manage configuration for multiple tenants (insurance providers) through a single dashboard. Each tenant gets a rich configuration object that controls how claims are processed, approved, and communicated.

### Core Capabilities

| Feature | Description |
|---|---|
| **Tenant Management** | Create, edit, and view tenants with a multi-step configuration form. |
| **Configuration Version History** | Every save snapshots the entire config; browse the audit log, diff any version against the active config, and rollback with one click. |
| **Configuration Diff Engine** | Side-by-side comparison of two tenants' configs or a historical version vs. the current active config. |
| **Claims Processing Engine** | Pure function that validates a claim against a tenant's configuration — checks enabled types, required docs, auto-approval thresholds, approval routing, SLA deadlines, and custom field validation. |
| **Role-Based Access Control** | Admin users can create/edit tenants; operators can view and manage their assigned tenants. |
| **Landing Page** | SaaS-style marketing homepage. |

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **UI Library** | React 19, shadcn/ui components |
| **Styling** | Tailwind CSS v4, tailwindcss-animate |
| **Animation** | Framer Motion 12 |
| **Auth** | NextAuth v5 (beta.31) — Credentials provider, JWT sessions |
| **Database** | PostgreSQL via Prisma ORM |
| **Validation** | Zod 4 |
| **Password Hashing** | bcryptjs |
| **Icons** | lucide-react |
| **Theming** | next-themes (dark/light/system) |
| **Notifications** | sonner (toast) |

## Architecture

```
/
├── app/
│   ├── (auth)/login          — Login page
│   ├── (auth)/signup         — Registration page
│   ├── (dashboard)/          — Protected dashboard layout
│   │   ├── tenants/          — Tenant list, create, edit, detail, history, preview
│   │   └── compare/          — Configuration diff engine
│   ├── api/
│   │   ├── auth/signup       — Registration endpoint
│   │   ├── tenants/          — CRUD + history + restore endpoints
│   │   └── claims/process    — Claims processing endpoint
│   ├── landing/              — Marketing landing page (static)
│   └── layout.tsx            — Root layout with theme provider & toaster
├── components/
│   ├── ui/                   — shadcn/ui primitives (button, card, dialog, etc.)
│   ├── theme-provider.tsx    — Dark mode provider
│   ├── motion-wrapper.tsx    — Framer Motion animation wrapper
│   └── mobile-nav.tsx        — Mobile navigation drawer
├── lib/
│   ├── db.ts                 — Prisma client singleton
│   ├── auth-helpers.ts       — Auth utility functions
│   ├── tenant-schema.ts      — Zod schemas for all config sections
│   ├── claims-processor.ts   — Pure claim processing logic
│   ├── utils.ts              — Shared utilities (SLA calculation, formatting)
│   ├── api/helpers.ts        — API response helpers
│   └── performance.ts        — Performance optimizations
├── prisma/
│   ├── schema.prisma         — Data model (User, Tenant, TenantVersion)
│   └── seed.js               — Database seeder
├── proxy.ts                  — Next.js middleware for auth routing
└── auth.ts                   — NextAuth v5 config
```

## Data Model

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String   // hashed
  role      String   @default("operator") // "admin" | "operator"
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  tenants   Tenant[]
}

model Tenant {
  id        String          @id @default(cuid())
  name      String
  slug      String          @unique
  config    Json            // Full TenantConfig object
  createdAt DateTime        @default(now())
  updatedAt DateTime        @updatedAt
  ownerId   String
  owner     User            @relation(fields: [ownerId], references: [id])
  versions  TenantVersion[]
}

model TenantVersion {
  id        String   @id @default(cuid())
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  name      String
  slug      String
  config    Json     // Snapshot at save time
  version   Int
  savedAt   DateTime @default(now())
  note      String?
}
```

## Tenant Configuration Schema

Each tenant's `config` JSON field conforms to a strict Zod schema with these sections:

### Branding
Company name, logo URL, primary and secondary hex colors.

### Claim Types
Five insurance claim types — `OUTPATIENT`, `INPATIENT`, `DENTAL`, `MATERNITY`, `OPTICAL` — each can be toggled on/off with required and optional document lists.

### Approval Rules
- `autoApproveThreshold` — claims below this amount are auto-approved.
- Multi-tier approval routing — each tier has a `minAmount`, `maxAmount`, and approver `role`. Claims traverse all tiers whose `minAmount` is ≤ the claim amount.

### Notifications
Per-event (`claim_submitted`, `approved`, `rejected`, `payment_sent`) configuration with enabled/disabled toggle, channel selection (email, SMS, webhook), and custom email templates.

### SLA
Per-claim-type SLA configuration with `businessDays` and an `escalationContact` email.

### Custom Fields
Array of custom form fields with `key`, `label`, `type` (text/number/select), `required` flag, and `options` for select fields.

## Key Features

### Configuration Diff Engine
Compare two tenants' configurations side-by-side, or diff a historical version against the current active config. The comparison table highlights:
- Changed values (old → new)
- Added properties (green)
- Removed properties (red)
- Unchanged values (neutral)

### Version History & Rollback
Every tenant save creates a new `TenantVersion` record. The history page shows an audit log with timestamps, version numbers, and comments. Users can:
- **Diff** any historical version against the active config
- **Rollback** to any previous version (creates a new version with the restored config)

### Claims Processing Engine
The `processClaim()` pure function in `lib/claims-processor.ts` validates claims against tenant configuration:
- Verifies the claim type is enabled
- Returns required and optional document lists
- Determines auto-approval or multi-tier approval routing
- Generates notification triggers
- Calculates SLA deadlines using business days
- Validates custom field values (required checks, type checks, select option validation)

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- PostgreSQL database

### Installation

```bash
# Navigate to the project
cd multi-tenant-configuration-platform

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env   # or edit .env directly
# Edit .env with your DATABASE_URL and NEXTAUTH_SECRET

# Push the schema to your database
npx prisma db push

# Seed the database (creates an admin user)
node prisma/seed.js

# Start the development server
pnpm dev
```

### Environment Variables

```
DATABASE_URL="postgresql://user:password@localhost:5432/multi_tenant_config"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

### Default Credentials

After seeding:
- **Email:** `admin@company.com`
- **Password:** `admin123`
- **Role:** `admin`

## Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `npx prisma studio` | Open Prisma Studio (database GUI) |
| `npx prisma db push` | Push schema changes to database |
| `node prisma/seed.js` | Seed database with sample data |

## Design Decisions

- **Server Components by default** — Pages fetch data on the server, minimizing client-side data fetching. Client Components are isolated to interactive parts (forms, comparison table, history actions).
- **Force-static landing page** — The marketing page uses `export const dynamic = "force-static"` for optimal CDN caching.
- **Force-dynamic compare page** — The diff engine always fetches fresh config data to ensure accurate comparisons.
- **Middleware auth** — Next.js middleware (`proxy.ts`) handles route protection and redirects, keeping page components auth-agnostic.
- **Pure claim processing** — The claims engine is a pure function with no side effects, making it testable and reusable in both API routes and server contexts.
- **Versioning via snapshots** — Full config snapshots (rather than incremental diffs) simplify rollback logic and make the audit trail self-contained.

