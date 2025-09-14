import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Public routes
const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

// Protected routes
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // Protect routes that require authentication
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  // If user is signed in and trying to access public routes, redirect to their dashboard
  if (isPublicRoute(req) && (auth as any).userId) {
    const dashboardUrl = new URL(`/dashboard/${(auth as any).userId}`, req.url);
    return Response.redirect(dashboardUrl);
  }

  // If user is signed in and trying to access generic dashboard, redirect to their specific dashboard
  if (req.nextUrl.pathname === "/dashboard" && (auth as any).userId) {
    const dashboardUrl = new URL(`/dashboard/${(auth as any).userId}`, req.url);
    return Response.redirect(dashboardUrl);
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
