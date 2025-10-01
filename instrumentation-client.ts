import posthog from "posthog-js";

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: "/ingest",
  ui_host: "https://us.posthog.com",
  person_profiles: "identified_only",
  capture_pageview: true,
  capture_pageleave: true,
  capture_exceptions: true, // This enables capturing exceptions using Error Tracking
  debug: false, // Disable debug mode to reduce console logs
  disable_session_recording: true, // Disable session recording to reduce logs
  disable_persistence: false, // Keep persistence enabled
  loaded: (posthog) => {
    // Disable debug mode completely
    posthog.debug(false);
  },
});