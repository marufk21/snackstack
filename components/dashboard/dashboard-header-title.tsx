"use client";

import { usePathname } from "next/navigation";

const routeTitles: Record<string, string> = {
  "/app": "My Notes",
  "/app/subscription": "My Subscription",
  "/app/pricing": "Pricing",
};

export function DashboardHeaderTitle() {
  const pathname = usePathname();

  // Find the exact match or a partial match for sub-routes
  let title = "Dashboard";

  if (pathname) {
    // Check for exact matches first
    if (routeTitles[pathname]) {
      title = routeTitles[pathname];
    } else {
      // Check for partial matches (e.g. /app/subscription/success)
      const matchingRoute = Object.keys(routeTitles).find(
        (route) => pathname.startsWith(route) && route !== "/app"
      );

      if (matchingRoute) {
        title = routeTitles[matchingRoute];
      } else if (pathname === "/app" || pathname.startsWith("/app/")) {
        // Default for /app sub-routes not explicitly defined
        title = "My Notes";
      }
    }
  }

  return (
    <h1 className="text-base md:text-lg font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
      {title}
    </h1>
  );
}
