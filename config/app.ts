// Environment validation
const validateEnvironment = () => {
  const requiredEnvVars = ["DATABASE_URL", "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"];

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    console.warn(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
  }

  // PostHog is optional
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    console.warn(
      "NEXT_PUBLIC_POSTHOG_KEY is not set. PostHog analytics will be disabled."
    );
  }
};

// Validate environment on import
validateEnvironment();

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
