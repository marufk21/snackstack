import { PricingTier } from "@/components/ui/pricing-card";
import { stripePriceIds } from "@/lib/stripe-client";

export const pricingTiers: PricingTier[] = [
  {
    id: "free-trial",
    name: "Free",
    description: "Get started with no time limit",
    price: {
      monthly: 0,
      yearly: 0,
    },
    features: [
      "Up to 5 notes",
      "30 AI suggestions/mo",
      "Image uploads (5MB each)",
      "Basic markdown support",
      "Community support",
    ],
    stripePriceId: null,
    isTrial: true,
  },
  {
    id: "basic",
    name: "Basic",
    description: "Perfect for getting started with SnackStack",
    price: {
      monthly: 749,
      yearly: 5988,
    },
    features: [
      "Up to 50 notes",
      "300 AI suggestions/mo",
      "Image uploads (10MB each)",
      "Basic markdown support",
      "Email support",
    ],
    stripePriceId: stripePriceIds.basic,
  },
  {
    id: "pro",
    name: "Pro",
    description: "Best for power users and professionals",
    price: {
      monthly: 1599,
      yearly: 12792,
    },
    features: [
      "Up to 500 notes",
      "1,500 AI suggestions/mo",
      "Image uploads (20MB each)",
      "Advanced markdown support",
      "Real-time collaboration",
      "Priority support",
      "Export to PDF/Word",
      "Custom themes",
    ],
    popular: true,
    stripePriceId: stripePriceIds.pro,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For teams and organizations",
    price: {
      monthly: 4099,
      yearly: 32792,
    },
    features: [
      "Unlimited notes",
      "Unlimited AI suggestions",
      "Image uploads (100MB each)",
      "Everything in Pro",
      "Team management",
      "Advanced analytics",
      "Custom integrations",
      "SSO authentication",
      "Dedicated support",
      "Custom onboarding",
      "SLA guarantee",
    ],
    stripePriceId: stripePriceIds.enterprise,
  },
];
