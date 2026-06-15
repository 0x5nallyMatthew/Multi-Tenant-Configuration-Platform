import { auth } from "./auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl
  
  // Define auth pages and public pages (accessible without login)
  const isAuthPage = pathname === "/login" || pathname === "/signup"
  const isPublicPage = pathname === "/" // Landing page
  
  // Allow access to auth pages and public pages
  if (isAuthPage || isPublicPage) {
    // If logged in and on auth page, redirect to tenants
    if (isLoggedIn && isAuthPage) {
      return Response.redirect(new URL("/tenants", req.nextUrl))
    }
    // Allow access to login/signup/landing page
    return
  }

  // If not logged in and trying to access protected page
  if (!isLoggedIn) {
    let callbackUrl = pathname
    if (req.nextUrl.search) {
      callbackUrl += req.nextUrl.search
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl)
    return Response.redirect(new URL(`/login?callbackUrl=${encodedCallbackUrl}`, req.nextUrl))
  }

  // If logged in and on root page, redirect to tenants dashboard
  if (pathname === "/") {
    return Response.redirect(new URL("/tenants", req.nextUrl))
  }
})

export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/tenants/:path*",
    "/compare/:path*"
  ]
}

// Note: bfcache (back/forward cache) issues in development mode are expected.
// The WebSocket and cache-control:no-store headers are from Next.js dev server.
// In production (next start), these issues will not be present as:
// 1. WebSocket connections are only used in development
// 2. Production builds use proper cache headers
// 3. The build optimizations in next.config.ts will apply
