// Client-side Stripe configuration
// Only contains data that's safe to expose to the browser

function getEnv(key: string): string | null {
  const value = process.env[key];
  if (!value) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`Missing Stripe env var: ${key} — checkout will fail until set in .env.local`);
    }
    return null;
  }
  return value;
}

export const stripePriceIds = {
  // Free Trial - No Stripe price needed (handled separately)
  freeTrial: null,

  // Basic Plan
  basic: {
    monthly: getEnv("NEXT_PUBLIC_STRIPE_PRICE_ID_BASIC_MONTHLY"),
    yearly: getEnv("NEXT_PUBLIC_STRIPE_PRICE_ID_BASIC_YEARLY"),
  },

  // Pro Plan
  pro: {
    monthly: getEnv("NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY"),
    yearly: getEnv("NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEARLY"),
  },

  // Enterprise Plan
  enterprise: {
    monthly: getEnv("NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE_MONTHLY"),
    yearly: getEnv("NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE_YEARLY"),
  },
};

export const getStripePublishableKey = () => {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!key) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY — Stripe will not load");
    }
    return null;
  }
  return key;
};
