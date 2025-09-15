// Application-wide configuration
export const appConfig = {
  name: "SnackStack",
  description: "A modern full-stack web application starter",
  version: "0.1.0",
  environment: process.env.NODE_ENV || "development",
  isDevelopment: process.env.NODE_ENV !== "production",
  isProduction: process.env.NODE_ENV === "production",

  // API configuration
  api: {
    baseUrl: "/api",
    timeout: 30000,
    retryAttempts: 3,
  },

  // UI configuration
  ui: {
    theme: {
      default: "system",
      storageKey: "snackstack-theme",
    },
    notifications: {
      autoHideDuration: 5000,
      maxNotifications: 5,
    },
  },

  // Feature flags
  features: {
    aiSuggestions: true,
    imageUpload: true,
    darkMode: true,
  },
} as const;

export type AppConfig = typeof appConfig;
