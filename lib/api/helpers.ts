import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { canUserAccessTenant } from "@/lib/auth-helpers"
import type { Session } from "next-auth"

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export type SuccessResponse<T> = { success: true; data: T; status: number }
export type ErrorResponse = { success: false; error: string; status: number }
export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorResponse

export function isSuccess<T>(response: ApiResponse<T>): response is SuccessResponse<T> {
  return response.success === true
}

export type AuthenticatedUser = Session["user"] & {
  id: string
  role: string
}

export interface AuthContext {
  user: AuthenticatedUser
}

// ──────────────────────────────────────────────
// Response builders
// ──────────────────────────────────────────────

export function jsonResponse<T>(result: ApiResponse<T>) {
  return NextResponse.json(
    result.success ? result.data : { error: result.error },
    { status: result.status }
  )
}

export function success<T>(data: T, status = 200): ApiResponse<T> {
  return { success: true, data, status }
}

export function error(message: string, status = 500): ApiResponse<never> {
  return { success: false, error: message, status }
}

// Common error responses
export const unauthorized = () => error("Unauthorized", 401)
export const forbidden = () => error("Forbidden", 403)
export const notFound = (msg = "Not found") => error(msg, 404)
export const badRequest = (msg: string) => error(msg, 400)
export const conflict = (msg: string) => error(msg, 409)

// ──────────────────────────────────────────────
// Auth middleware
// ──────────────────────────────────────────────

type AuthenticatedHandler = (
  req: Request,
  ctx: AuthContext
) => Promise<ApiResponse> | ApiResponse

type AuthenticatedHandlerWithParams<T extends Record<string, string>> = (
  req: Request,
  ctx: AuthContext & { params: T }
) => Promise<ApiResponse> | ApiResponse

/**
 * Wraps a handler to require authentication.
 * Returns 401 if no valid session exists.
 */
export function withAuth(handler: AuthenticatedHandler) {
  return async (req: Request): Promise<NextResponse> => {
    const session = await auth()

    if (!session?.user?.id || !session?.user?.role) {
      return jsonResponse(unauthorized())
    }

    const ctx: AuthContext = {
      user: session.user as AuthenticatedUser,
    }

    try {
      const result = await handler(req, ctx)
      return jsonResponse(result)
    } catch (err) {
      console.error("API error:", err)
      return jsonResponse(error("Internal server error"))
    }
  }
}

/**
 * Wraps a handler with auth and route params.
 */
export function withAuthAndParams<T extends Record<string, string>>(
  handler: AuthenticatedHandlerWithParams<T>
) {
  return async (
    req: Request,
    { params }: { params: Promise<T> }
  ): Promise<NextResponse> => {
    const session = await auth()

    if (!session?.user?.id || !session?.user?.role) {
      return jsonResponse(unauthorized())
    }

    const resolvedParams = await params
    const ctx: AuthContext & { params: T } = {
      user: session.user as AuthenticatedUser,
      params: resolvedParams,
    }

    try {
      const result = await handler(req, ctx)
      return jsonResponse(result)
    } catch (err) {
      console.error("API error:", err)
      return jsonResponse(error("Internal server error"))
    }
  }
}

// ──────────────────────────────────────────────
// Tenant helpers
// ──────────────────────────────────────────────

type Tenant = NonNullable<Awaited<ReturnType<typeof db.tenant.findFirst>>>

export async function findTenantOrError(
  identifier: { id?: string; slug?: string },
  user: AuthenticatedUser
): Promise<ApiResponse<Tenant>> {
  const tenant = await db.tenant.findFirst({
    where: {
      OR: [
        identifier.id ? { id: identifier.id } : {},
        identifier.slug ? { slug: identifier.slug } : {},
      ].filter((q) => Object.keys(q).length > 0),
    },
  })

  if (!tenant) {
    return notFound("Tenant not found")
  }

  if (!canUserAccessTenant(user, tenant.ownerId)) {
    return forbidden()
  }

  return success(tenant)
}
