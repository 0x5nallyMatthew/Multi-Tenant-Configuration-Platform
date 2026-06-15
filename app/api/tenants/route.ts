import { db } from "@/lib/db"
import { Prisma } from "@prisma/client"
import { tenantConfigSchema } from "@/lib/tenant-schema"
import { withAuth, success, badRequest, conflict } from "@/lib/api/helpers"

// GET /api/tenants - List all tenants for the logged-in user
export const GET = withAuth(async (_req, { user }) => {
  const tenants =
    user.role === "admin"
      ? await db.tenant.findMany({
          include: { owner: { select: { name: true, email: true } } },
          orderBy: { updatedAt: "desc" },
        })
      : await db.tenant.findMany({
          where: { ownerId: user.id },
          orderBy: { updatedAt: "desc" },
        })

  return success(tenants)
})

// POST /api/tenants - Create a new tenant configuration
export const POST = withAuth(async (req, { user }) => {
  const { name, slug, config } = await req.json()

  if (!name || !slug || !config) {
    return badRequest("Missing required fields")
  }

  const validation = tenantConfigSchema.safeParse(config)
  if (!validation.success) {
    return badRequest(
      validation.error.issues.map((i) => i.message).join(", ")
    )
  }

  const existing = await db.tenant.findUnique({ where: { slug } })
  if (existing) {
    return conflict("Slug must be unique")
  }

  const tenant = await db.$transaction(async (tx: Prisma.TransactionClient) => {
    const created = await tx.tenant.create({
      data: { name, slug, config, ownerId: user.id },
    })

    await tx.tenantVersion.create({
      data: {
        tenantId: created.id,
        name,
        slug,
        config,
        version: 1,
        note: "Initial configuration",
      },
    })

    return created
  })

  return success(tenant, 201)
})
