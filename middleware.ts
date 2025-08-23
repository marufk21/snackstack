import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { redirectToSignIn } from "@clerk/nextjs/server";

// Public routes
const isPublicRoute = createRouteMatcher(["/"]);
// Protected routes
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
  
  // If user is signed in and trying to access home page, redirect to dashboard
  if (isPublicRoute(req) && auth.userId) {
    const dashboardUrl = new URL("/dashboard", req.url);
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
