import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if accessing admin routes
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      // Allow login page
      return NextResponse.next();
    }

    // For other admin routes, check if session cookie exists
    const sessionToken = request.cookies.get("admin_session")?.value;

    if (!sessionToken) {
      // No token, redirect to login
      console.debug(`[Middleware] No session token for ${pathname}`);
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Cookie exists, allow through. Actual validation will happen in API routes.
    // The Edge Runtime can't access the file system, so we validate in server routes.
    console.debug(`[Middleware] Session token present for ${pathname}`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
