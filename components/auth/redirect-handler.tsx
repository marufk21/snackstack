"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

interface RedirectHandlerProps {
  children: React.ReactNode;
}

export const RedirectHandler = ({ children }: RedirectHandlerProps) => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoaded && user) {
      // Check if we're on a generic dashboard route and redirect to app
      if (pathname === "/dashboard") {
        router.replace("/app");
        return;
      }
      
      // Ensure signed-in users are not accidentally on admin routes unless explicitly navigating there
      // Only allow admin routes if user explicitly navigated there (not from sign-in redirect)
      if (pathname?.startsWith("/admin") && !pathname?.startsWith("/admin/blogs-dashboard")) {
        // If user is on admin login page and is signed in via Clerk, redirect to app
        // Admin panel uses separate authentication (localStorage), not Clerk
        if (pathname === "/admin") {
          router.replace("/app");
          return;
        }
      }
    }
  }, [isLoaded, user, router, pathname]);

  return <>{children}</>;
};
