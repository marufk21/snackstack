"use client";

import React, { useState } from "react";
import { PricingCard, PricingTier } from "@/components/ui/pricing-card";
import { PricingToggle } from "@/components/ui/pricing-toggle";
import { useStripeCheckout } from "@/hooks/use-stripe-checkout";
import { stripePriceIds } from "@/config/stripe-client";
import { useSubscription } from "@/hooks/use-subscription";

const pricingTiers: PricingTier[] = [
  {
    id: "free-trial",
    name: "Free Trial",
    description: "Try SnackStack free for 14 days",
    price: {
      monthly: 0,
      yearly: 0,
    },
    features: [
      "14-day free trial",
      "Up to 10 notes",
      "Basic AI suggestions",
      "Image uploads (5MB total)",
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
      "Basic AI suggestions",
      "Image uploads (10MB/month)",
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
      "Unlimited notes",
      "Advanced AI suggestions",
      "Unlimited image uploads",
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

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const { redirectToCheckout, loading, error } = useStripeCheckout();
  const { subscription } = useSubscription();

  const handleSelectPlan = async (
    priceId: string | null,
    planName: string,
    isTrial?: boolean
  ) => {
    if (isTrial) {
      window.location.href = "/app?trial=true";
      return;
    }

    if (!priceId) {
      console.error("No price ID provided for paid plan");
      return;
    }

    await redirectToCheckout(priceId);
  };

  const currentPlanId =
    subscription?.subscription?.planType ||
    (subscription?.onFreeTrial ? "free-trial" : null);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Choose Your <span className="text-primary">SnackStack</span> Plan
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Unlock the full potential of AI-powered note-taking. Choose a plan
          that fits your needs and start creating amazing content today.
        </p>

        {/* Billing Toggle - Commented out for now, only monthly available */}
        {/* <div className="flex justify-center mb-8">
          <PricingToggle isYearly={isYearly} onToggle={setIsYearly} />
        </div> */}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
          <p>Error: {error}</p>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
        {pricingTiers.map((tier) => (
          <PricingCard
            key={tier.id}
            tier={tier}
            isYearly={isYearly}
            onSelectPlan={handleSelectPlan}
            loading={loading}
            currentPlanId={currentPlanId}
          />
        ))}
      </div>

      {/* FAQ Section */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">
                Can I change my plan later?
              </h3>
              <p className="text-muted-foreground">
                Yes! You can upgrade or downgrade your plan at any time. Changes
                will be prorated and reflected in your next billing cycle.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-muted-foreground">
                We accept all major credit cards (Visa, MasterCard, American
                Express) and bank transfers for Enterprise plans.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Is there a free trial?</h3>
              <p className="text-muted-foreground">
                Yes! All paid plans come with a 14-day free trial. No credit
                card required to start.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
              <p className="text-muted-foreground">
                Absolutely! You can cancel your subscription at any time. Your
                access will continue until the end of your current billing
                period.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Need a custom solution?</h2>
        <p className="text-muted-foreground mb-6">
          Our Enterprise plan can be customized to fit your organization's
          specific needs.
        </p>
        <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          Contact Sales
        </button>
      </div>
    </div>
  );
}
