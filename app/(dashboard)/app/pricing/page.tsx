"use client";

import React, { useState } from "react";
import { PricingCard } from "@/components/ui/pricing-card";
import { PricingToggle } from "@/components/ui/pricing-toggle";
import { useStripeCheckout } from "@/hooks/use-stripe-checkout";
import { pricingTiers } from "@/lib/pricing";
import { useSubscription } from "@/hooks/use-subscription";
import { Sparkles } from "lucide-react";


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

  const currentPlanId = subscription?.subscription?.planType || "free-trial";

  return (
    <div className="relative container mx-auto px-4 py-8 md:py-12 max-w-7xl">
      {/* Header with animations */}
      <div className="text-center mb-12 md:mb-16 animate-fade-in-up">
        <div className="flex items-center justify-center gap-2 mb-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Choose Your <span className="gradient-text">SnackStack</span> Plan
          </h1>
          <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-cyan-500 animate-pulse-glow" />
        </div>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          Unlock the full potential of AI-powered note-taking. Choose a plan
          that fits your needs and start creating amazing content today.
        </p>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-8">
          <PricingToggle isYearly={isYearly} onToggle={setIsYearly} />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-center animate-fade-in-up">
          <p>Error: {error}</p>
        </div>
      )}

      {/* Pricing Cards with staggered animation */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 justify-items-center mb-16 md:mb-20">
        {pricingTiers.map((tier, index) => (
          <div
            key={tier.id}
            className="animate-fade-in-up w-full"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <PricingCard
              tier={tier}
              isYearly={isYearly}
              onSelectPlan={handleSelectPlan}
              loading={loading}
              currentPlanId={currentPlanId}
            />
          </div>
        ))}
      </div>

      {/* Contact Section with enhanced styling */}
      <div className="mt-16 md:mt-20 text-center animate-fade-in-up animate-delay-400">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Need a custom solution?
          </h2>
          <p className="text-muted-foreground mb-6 md:mb-8 text-sm md:text-base leading-relaxed">
            Our Enterprise plan can be customized to fit your organization's
            specific needs.
          </p>
          <button className="px-6 md:px-8 py-3 md:py-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full transition-all duration-300 hover:scale-105 font-medium">
            Contact Sales
          </button>
        </div>
      </div>
    </div>
  );
}
