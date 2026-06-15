import { processClaim } from "@/lib/claims-processor"
import { type TenantConfig } from "@/lib/tenant-schema"
import {
  withAuth,
  findTenantOrError,
  badRequest,
  success,
  isSuccess,
} from "@/lib/api/helpers"

// POST /api/claims/process - Process a claim against a tenant's config
export const POST = withAuth(async (req, { user }) => {
  const { tenantId, slug, claimData } = await req.json()

  if ((!tenantId && !slug) || !claimData) {
    return badRequest("Missing required fields: tenantId/slug and claimData")
  }

  const tenantResult = await findTenantOrError({ id: tenantId, slug }, user)
  if (!isSuccess(tenantResult)) return tenantResult

  const tenant = tenantResult.data
  const config = tenant.config as TenantConfig
  const result = processClaim(config, claimData, tenant.id)

  return success(result)
})
