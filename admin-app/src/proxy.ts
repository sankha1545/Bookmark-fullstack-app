import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const secret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET!)

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value

  const isAuthPage = req.nextUrl.pathname.startsWith("/login")
  const isProtectedRoute =
    req.nextUrl.pathname.startsWith("/dashboard") ||
    req.nextUrl.pathname.startsWith("/users") ||
    req.nextUrl.pathname.startsWith("/contacts") ||
    req.nextUrl.pathname.startsWith("/analytics")

  // If accessing protected route
  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    try {
      await jwtVerify(token, secret)
      return NextResponse.next()
    } catch {
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }

  // If logged in and trying to access login page
  if (isAuthPage && token) {
    try {
      await jwtVerify(token, secret)
      return NextResponse.redirect(new URL("/dashboard", req.url))
    } catch {
      return NextResponse.next()
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/users/:path*", "/contacts/:path*", "/analytics/:path*"],
}
