// Client-side Stripe configuration
// Only contains data that's safe to expose to the browser

export const stripePriceIds = {
  // Free Trial - No Stripe price needed (handled separately)
  freeTrial: null,

  // Basic Plan
  basic: {
    monthly:
      process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_BASIC_MONTHLY ||
      "price_basic_monthly_fallback",
    yearly:
      process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_BASIC_YEARLY ||
      "price_basic_yearly_fallback",
  },

  // Pro Plan
  pro: {
    monthly:
      process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY ||
      "price_pro_monthly_fallback",
    yearly:
      process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEARLY ||
      "price_pro_yearly_fallback",
  },

  // Enterprise Plan
  enterprise: {
    monthly:
      process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE_MONTHLY ||
      "price_enterprise_monthly_fallback",
    yearly:
      process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE_YEARLY ||
      "price_enterprise_yearly_fallback",
  },
} as const;

export const getStripePublishableKey = () => {
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    // Return a fallback for build time, will be validated at runtime
    return "pk_test_fallback";
  }
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
};
