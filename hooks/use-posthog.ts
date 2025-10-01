"use client";

import { useCallback } from "react";
import posthog from "posthog-js";

export function usePostHog() {
  const capture = useCallback(
    (event: string, properties?: Record<string, any>) => {
      if (typeof window !== "undefined" && posthog.__loaded) {
        posthog.capture(event, properties);
      }
    },
    []
  );

  const identify = useCallback(
    (userId: string, properties?: Record<string, any>) => {
      if (typeof window !== "undefined" && posthog.__loaded) {
        posthog.identify(userId, properties);
      }
    },
    []
  );

  const reset = useCallback(() => {
    if (typeof window !== "undefined" && posthog.__loaded) {
      posthog.reset();
    }
  }, []);

  return { capture, identify, reset };
}
