// Client-side Stripe configuration
// Only contains data that's safe to expose to the browser

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    // In production, missing Stripe price IDs are a hard failure
    if (process.env.NODE_ENV === "production") {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    // In development, return a placeholder that will fail visibly if used
    console.warn(`Missing Stripe env var: ${key} — checkout will fail until set in .env.local`);
    return `missing_${key.toLowerCase()}`;
  }
  return value;
}

export const stripePriceIds = {
  // Free Trial - No Stripe price needed (handled separately)
  freeTrial: null,

  // Basic Plan
  basic: {
    monthly: requireEnv("NEXT_PUBLIC_STRIPE_PRICE_ID_BASIC_MONTHLY"),
    yearly: requireEnv("NEXT_PUBLIC_STRIPE_PRICE_ID_BASIC_YEARLY"),
  },

  // Pro Plan
  pro: {
    monthly: requireEnv("NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY"),
    yearly: requireEnv("NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEARLY"),
  },

  // Enterprise Plan
  enterprise: {
    monthly: requireEnv("NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE_MONTHLY"),
    yearly: requireEnv("NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE_YEARLY"),
  },
} as const;

export const getStripePublishableKey = () => {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!key) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");
    }
    console.warn("Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY — Stripe will not load");
    return "pk_test_missing";
  }
  return key;
};
