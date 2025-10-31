"use client";

import React, { useState } from "react";
import { PricingCard, PricingTier } from "@/components/ui/pricing-card";
import { PricingToggle } from "@/components/ui/pricing-toggle";
import { useStripeCheckout } from "@/hooks/use-stripe-checkout";
import { stripePriceIds } from "@/config/stripe-client";
import { Navbar, Footer } from "@/components/landing";
import { motion } from "framer-motion";

const pricingTiers: PricingTier[] = [
  {
    id: "basic",
    name: "Basic",
    description: "Perfect for getting started with SnackStack",
    price: {
      monthly: 9,
      yearly: 72, // 20% discount
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
      monthly: 19,
      yearly: 152, // 20% discount
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
      monthly: 49,
      yearly: 392, // 20% discount
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

  const handleSelectPlan = async (priceId: string, planName: string) => {
    await redirectToCheckout(priceId);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-16 max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Choose Your Plan
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Unlock the full potential of AI-powered note-taking. Choose a plan
              that fits your needs and start creating amazing content today.
            </p>

            {/* Billing Toggle */}
            <div className="flex justify-center mb-8">
              <PricingToggle isYearly={isYearly} onToggle={setIsYearly} />
            </div>
          </motion.div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-center max-w-2xl mx-auto"
            >
              <p>Error: {error}</p>
            </motion.div>
          )}

          {/* Pricing Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center mb-16"
          >
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="w-full"
              >
                <PricingCard
                  tier={tier}
                  isYearly={isYearly}
                  onSelectPlan={handleSelectPlan}
                  loading={loading}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-24 mb-16"
          >
            <h2 className="text-4xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="space-y-6"
              >
                <div className="p-6 bg-card border border-border rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">
                    Can I change my plan later?
                  </h3>
                  <p className="text-muted-foreground">
                    Yes! You can upgrade or downgrade your plan at any time.
                    Changes will be prorated and reflected in your next billing
                    cycle.
                  </p>
                </div>
                <div className="p-6 bg-card border border-border rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">
                    What payment methods do you accept?
                  </h3>
                  <p className="text-muted-foreground">
                    We accept all major credit cards (Visa, MasterCard, American
                    Express) and bank transfers for Enterprise plans.
                  </p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="space-y-6"
              >
                <div className="p-6 bg-card border border-border rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">
                    Is there a free trial?
                  </h3>
                  <p className="text-muted-foreground">
                    Yes! All paid plans come with a 14-day free trial. No credit
                    card required to start.
                  </p>
                </div>
                <div className="p-6 bg-card border border-border rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">
                    Can I cancel anytime?
                  </h3>
                  <p className="text-muted-foreground">
                    Absolutely! You can cancel your subscription at any time. Your
                    access will continue until the end of your current billing
                    period.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-16 text-center"
          >
            <div className="p-8 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">
                Need a custom solution?
              </h2>
              <p className="text-muted-foreground mb-6">
                Our Enterprise plan can be customized to fit your organization's
                specific needs. Contact us to discuss your requirements.
              </p>
              <a
                href="mailto:hello@snackstack.com"
                className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Contact Sales
              </a>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}

