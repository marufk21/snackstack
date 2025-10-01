import Stripe from "stripe";

// Lazy initialization to avoid build-time errors
let stripeInstance: Stripe | null = null;

export const stripe = new Proxy({} as Stripe, {
  get(target, prop) {
    if (!stripeInstance) {
      if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error("STRIPE_SECRET_KEY is not set");
      }
      stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2025-08-27.basil",
        typescript: true,
      });
    }
    return stripeInstance[prop as keyof Stripe];
  },
});

export const getStripePublishableKey = () => {
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set");
  }
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
};

export const stripePriceIds = {
  basic: process.env.STRIPE_PRICE_ID_BASIC || "price_basic_fallback",
  pro: process.env.STRIPE_PRICE_ID_PRO || "price_pro_fallback",
  enterprise:
    process.env.STRIPE_PRICE_ID_ENTERPRISE || "price_enterprise_fallback",
} as const;