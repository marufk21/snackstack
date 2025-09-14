"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface RedirectHandlerProps {
  children: React.ReactNode;
}

export const RedirectHandler = ({ children }: RedirectHandlerProps) => {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user) {
      // Check if we're on a generic dashboard route and redirect to user-specific one
      if (window.location.pathname === "/dashboard") {
        router.replace(`/dashboard/${user.id}`);
      }
    }
  }, [isLoaded, user, router]);

  return <>{children}</>;
};
