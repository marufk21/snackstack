import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Public routes
const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

// Protected routes
const isProtectedRoute = createRouteMatcher(["/app(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const url = req.nextUrl.clone();

  // Protect routes that require authentication
  if (isProtectedRoute(req)) {
    if (!userId) {
      // Redirect to sign-in if not authenticated
      url.pathname = "/sign-in";
      return NextResponse.redirect(url);
    }
  }

  // If user is signed in and trying to access auth routes, redirect to app
  if (
    userId &&
    (req.nextUrl.pathname === "/sign-in" || req.nextUrl.pathname === "/sign-up")
  ) {
    url.pathname = "/app";
    return NextResponse.redirect(url);
  }

  // If user is signed in and on landing page, redirect to app
  if (userId && req.nextUrl.pathname === "/") {
    url.pathname = "/app";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
