"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function AuthCheck() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    // Add a timeout to prevent infinite redirect loops
    if (isLoaded && isSignedIn && !hasRedirected) {
      setHasRedirected(true);
      // Use replace instead of push to avoid back button issues
      router.replace("/app");
    }
  }, [isLoaded, isSignedIn, router, hasRedirected]);

  // Show loading spinner while checking authentication
  if (!isLoaded) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="text-muted-foreground">
            Checking authentication...
          </span>
        </div>
      </div>
    );
  }

  // Don't render anything if user is signed in (they'll be redirected)
  if (isSignedIn) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="text-muted-foreground">
            Redirecting to dashboard...
          </span>
        </div>
      </div>
    );
  }

  return null;
}
