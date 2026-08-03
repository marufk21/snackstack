"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

interface RedirectHandlerProps {
  children: React.ReactNode;
}

export const RedirectHandler = ({ children }: RedirectHandlerProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isLoaded = status !== "loading";
  const user = session?.user;

  useEffect(() => {
    if (isLoaded && user) {
      // Check if we're on a generic dashboard route and redirect to app
      if (pathname === "/dashboard") {
        router.replace("/app");
        return;
      }
    }
  }, [isLoaded, user, router, pathname]);

  return <>{children}</>;
};
