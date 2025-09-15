// Application constants
export const APP_CONFIG = {
  DEFAULT_TIMEOUT: 30000,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp", "image/gif"],
} as const;

export const ROUTES = {
  HOME: "/",
  APP: "/app",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  API: {
    NOTES: "/api/notes",
    UPLOAD: "/api/upload",
    AI_SUGGESTION: "/api/ai-suggestion",
  },
} as const;

export const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
} as const;
