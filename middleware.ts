import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected routes that require authentication
const protectedRoutes = ["/app"];

// Auth routes that should redirect to /app if already authenticated
const authRoutes = ["/sign-in", "/sign-up"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const protectedRoutes = ["/app"];
  const authRoutes = ["/sign-in", "/sign-up"];

  // Check if current path is protected or auth route
  // We also check root and admin to be safe, though matcher handles most
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isRoot = pathname === "/";
  const isAdmin = pathname === "/admin";

  // Only load auth if we need to check authentication
  if (isProtectedRoute || isAuthRoute || isRoot || isAdmin) {
    const { auth } = await import("@/server/auth/config");
    return auth((req) => {
      const session = req.auth;
      const { pathname } = req.nextUrl;
      const isAuthenticated = !!session?.user?.id;

      // Check if current path is protected
      const isProtectedRoute = protectedRoutes.some((route) =>
        pathname.startsWith(route)
      );

      // Check if current path is an auth route
      const isAuthRoute = authRoutes.some((route) =>
        pathname.startsWith(route)
      );

      // Protect routes that require authentication
      if (isProtectedRoute && !isAuthenticated) {
        const url = req.nextUrl.clone();
        url.pathname = "/sign-in";
        return NextResponse.redirect(url);
      }

      // If user is authenticated and trying to access auth routes, redirect to app
      if (isAuthenticated && isAuthRoute) {
        const url = req.nextUrl.clone();
        url.pathname = "/app";
        return NextResponse.redirect(url);
      }

      // If user is authenticated and on landing page, redirect to app
      if (isAuthenticated && pathname === "/") {
        const url = req.nextUrl.clone();
        url.pathname = "/app";
        return NextResponse.redirect(url);
      }

      // Prevent authenticated users from accessing admin panel
      if (isAuthenticated && pathname === "/admin") {
        const url = req.nextUrl.clone();
        url.pathname = "/app";
        return NextResponse.redirect(url);
      }

      return NextResponse.next();
    })(req, { params: Promise.resolve({}) });
  }

  return NextResponse.next();
}

// Reduce matcher scope to only necessary routes
export const config = {
  matcher: ["/", "/app/:path*", "/sign-in", "/sign-up", "/admin"],
};
