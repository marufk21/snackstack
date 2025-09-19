// Client-side Stripe configuration
// Only contains data that's safe to expose to the browser

export const stripePriceIds = {
  basic: process.env.STRIPE_PRICE_ID_BASIC || "price_basic_fallback",
  pro: process.env.STRIPE_PRICE_ID_PRO || "price_pro_fallback",
  enterprise:
    process.env.STRIPE_PRICE_ID_ENTERPRISE || "price_enterprise_fallback",
} as const;

export const getStripePublishableKey = () => {
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set");
  }
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
};
