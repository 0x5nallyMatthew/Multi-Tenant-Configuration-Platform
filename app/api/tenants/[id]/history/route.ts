import { db } from "@/lib/db"
import {
  withAuthAndParams,
  findTenantOrError,
  success,
} from "@/lib/api/helpers"

// GET /api/tenants/[id]/history - Get configuration version history
export const GET = withAuthAndParams<{ id: string }>(async (_req, { params, user }) => {
  const access = await findTenantOrError({ id: params.id }, user)
  if (!access.success) return access

  const versions = await db.tenantVersion.findMany({
    where: { tenantId: params.id },
    orderBy: { version: "desc" },
  })

  return success(versions)
})
