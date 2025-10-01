"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { useUser } from "@clerk/nextjs";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useUser();

  // Initialize PostHog if not already initialized and key is available
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      process.env.NEXT_PUBLIC_POSTHOG_KEY &&
      !posthog.__loaded
    ) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: "/ingest",
        ui_host: "https://us.posthog.com",
        person_profiles: "identified_only",
        capture_pageview: false, // We'll handle this manually
        capture_pageleave: true,
        capture_exceptions: true,
        debug: false,
        disable_session_recording: true,
        disable_persistence: false,
        loaded: (posthog) => {
          posthog.debug(false);
        },
      });
    }
  }, []);

  useEffect(() => {
    // Track page views only if PostHog is loaded
    if (pathname && posthog.__loaded) {
      let url = window.origin + pathname;
      if (searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      posthog.capture("$pageview", {
        $current_url: url,
      });
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    // Identify user when they sign in, only if PostHog is loaded
    if (user && posthog.__loaded) {
      posthog.identify(user.id, {
        email: user.emailAddresses[0]?.emailAddress,
        name: user.fullName,
        username: user.username,
      });
    }
  }, [user]);

  return <>{children}</>;
}
