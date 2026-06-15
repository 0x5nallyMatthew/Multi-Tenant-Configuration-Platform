import { auth } from "./auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl
  
  // Public pages accessible without login
  const publicPages = ["/", "/login", "/signup", "/landing"]
  const isPublicPage = publicPages.includes(pathname)
  
  // Allow access to public pages
  if (isPublicPage) {
    // If logged in and on auth page, redirect to tenants
    if (isLoggedIn && (pathname === "/login" || pathname === "/signup")) {
      return Response.redirect(new URL("/tenants", req.nextUrl))
    }
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

  // If logged in, allow access to protected pages
  return
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ]
}
