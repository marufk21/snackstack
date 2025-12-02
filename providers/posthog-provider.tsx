"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Track page views only if PostHog is loaded
    const trackPageView = async () => {
      if (pathname) {
        const posthog = (await import("posthog-js")).default;
        if (posthog.__loaded) {
          let url = window.origin + pathname;
          if (searchParams.toString()) {
            url = url + `?${searchParams.toString()}`;
          }
          posthog.capture("$pageview", {
            $current_url: url,
          });
        }
      }
    };
    trackPageView();
  }, [pathname, searchParams]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  // Initialize PostHog if not already initialized and key is available
  useEffect(() => {
    const initPostHog = async () => {
      if (
        typeof window !== "undefined" &&
        process.env.NEXT_PUBLIC_POSTHOG_KEY
      ) {
        const posthog = (await import("posthog-js")).default;
        if (!posthog.__loaded) {
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
            opt_in_site_apps: false, // Disable site apps (surveys, etc) by default
            loaded: (posthog) => {
              posthog.debug(false);
            },
          });
        }
      }
    };
    initPostHog();
  }, []);

  useEffect(() => {
    // Identify user when they sign in, only if PostHog is loaded
    const identifyUser = async () => {
      if (session?.user) {
        const posthog = (await import("posthog-js")).default;
        if (posthog.__loaded) {
          posthog.identify(session.user.id, {
            email: session.user.email,
            name: session.user.name,
          });
        }
      }
    };
    identifyUser();
  }, [session]);

  return (
    <>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </>
  );
}
