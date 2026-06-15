import { db } from "@/lib/db"
import { Prisma } from "@prisma/client"
import { tenantConfigSchema } from "@/lib/tenant-schema"
import {
  withAuthAndParams,
  findTenantOrError,
  isSuccess,
  success,
  badRequest,
  conflict,
} from "@/lib/api/helpers"

// GET /api/tenants/[id] - Fetch a specific tenant
export const GET = withAuthAndParams<{ id: string }>(async (_req, { params, user }) => {
  const access = await findTenantOrError({ id: params.id }, user)
  if (!isSuccess(access)) return access

  return success(access.data)
})

// PUT /api/tenants/[id] - Update tenant configuration
export const PUT = withAuthAndParams<{ id: string }>(async (req, { params, user }) => {
  const access = await findTenantOrError({ id: params.id }, user)
  if (!isSuccess(access)) return access

  const tenant = access.data
  const { name, slug, config, note } = await req.json()

  if (!config) {
    return badRequest("Missing config object")
  }

  const validation = tenantConfigSchema.safeParse(config)
  if (!validation.success) {
    return badRequest(
      validation.error.issues.map((i) => i.message).join(", ")
    )
  }

  if (slug && slug !== tenant.slug) {
    const existing = await db.tenant.findUnique({ where: { slug } })
    if (existing && existing.id !== params.id) {
      return conflict("Slug is already in use by another tenant")
    }
  }

  const resolvedName = name || tenant.name
  const resolvedSlug = slug || tenant.slug

  const updated = await db.$transaction(async (tx: Prisma.TransactionClient) => {
    const lastVersion = await tx.tenantVersion.findFirst({
      where: { tenantId: params.id },
      orderBy: { version: "desc" },
      select: { version: true },
    })

    const newVersionNum = (lastVersion?.version || 0) + 1

    const updated = await tx.tenant.update({
      where: { id: params.id },
      data: { name: resolvedName, slug: resolvedSlug, config },
    })

    await tx.tenantVersion.create({
      data: {
        tenantId: params.id,
        name: resolvedName,
        slug: resolvedSlug,
        config,
        version: newVersionNum,
        note: note || `Updated configuration (Version ${newVersionNum})`,
      },
    })

    return updated
  })

  return success(updated)
})

// DELETE /api/tenants/[id] - Delete a tenant
export const DELETE = withAuthAndParams<{ id: string }>(async (_req, { params, user }) => {
  const access = await findTenantOrError({ id: params.id }, user)
  if (!isSuccess(access)) return access

  await db.tenant.delete({ where: { id: params.id } })

  return success({ message: "Tenant deleted successfully" })
})
