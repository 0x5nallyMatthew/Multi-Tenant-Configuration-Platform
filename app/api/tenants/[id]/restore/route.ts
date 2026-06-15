import { db } from "@/lib/db"
import { Prisma } from "@prisma/client"
import {
  withAuthAndParams,
  findTenantOrError,
  isSuccess,
  success,
  badRequest,
  notFound,
} from "@/lib/api/helpers"

// POST /api/tenants/[id]/restore - Restore to a specific version
export const POST = withAuthAndParams<{ id: string }>(async (req, { params, user }) => {
  const access = await findTenantOrError({ id: params.id }, user)
  if (!isSuccess(access)) return access

  const { versionId } = await req.json()

  if (!versionId) {
    return badRequest("Missing versionId")
  }

  const targetVersion = await db.tenantVersion.findUnique({
    where: { id: versionId },
  })

  if (!targetVersion || targetVersion.tenantId !== params.id) {
    return notFound("Version not found")
  }

  const updated = await db.$transaction(async (tx: Prisma.TransactionClient) => {
    const lastVersion = await tx.tenantVersion.findFirst({
      where: { tenantId: params.id },
      orderBy: { version: "desc" },
      select: { version: true },
    })

    const newVersionNum = (lastVersion?.version || 0) + 1

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const config = targetVersion.config as any

    const updated = await tx.tenant.update({
      where: { id: params.id },
      data: {
        name: targetVersion.name,
        slug: targetVersion.slug,
        config,
      },
    })

    await tx.tenantVersion.create({
      data: {
        tenantId: params.id,
        name: targetVersion.name,
        slug: targetVersion.slug,
        config,
        version: newVersionNum,
        note: `Rolled back to Version ${targetVersion.version}`,
      },
    })

    return updated
  })

  return success(updated)
})
