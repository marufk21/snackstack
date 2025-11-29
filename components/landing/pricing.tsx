"use client";

import React, { useState, useRef } from "react";
import { PricingCard, PricingTier } from "@/components/ui/pricing-card";
import { PricingToggle } from "@/components/ui/pricing-toggle";
import { useStripeCheckout } from "@/hooks/use-stripe-checkout";
import { stripePriceIds } from "@/config/stripe-client";
import { DollarSign } from "lucide-react";
import Link from "next/link";
import { useGSAP } from "@/hooks/use-gsap";
import gsap from "gsap";
import PageWrapper from "./page-wrapper";

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
    stripePriceId: null, // Free trial doesn't use Stripe
    isTrial: true,
  },
  {
    id: "basic",
    name: "Basic",
    description: "Perfect for getting started with SnackStack",
    price: {
      monthly: 749, // ₹749 (approx $9 × 83)
      yearly: 5988, // ₹5,988 (20% discount)
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
      monthly: 1599, // ₹1,599 (approx $19 × 83)
      yearly: 12792, // ₹12,792 (20% discount)
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
      monthly: 4099, // ₹4,099 (approx $49 × 83)
      yearly: 32792, // ₹32,792 (20% discount)
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

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);
  const { redirectToCheckout, loading, error } = useStripeCheckout();

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Header animation
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // Pricing cards stagger animation
    if (cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll(".pricing-card-wrapper");

      gsap.fromTo(
        cards,
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // FAQ animation
    if (faqRef.current) {
      const faqItems = faqRef.current.querySelectorAll(".faq-item");

      gsap.fromTo(
        faqItems,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          scrollTrigger: {
            trigger: faqRef.current,
            start: "top 80%",
          },
        }
      );
    }
  }, []);

  const handleSelectPlan = async (priceId: string | null, planName: string, isTrial?: boolean) => {
    if (isTrial) {
      // For Free Trial, redirect to signup/dashboard without Stripe
      // TODO: Implement Free Trial signup flow
      window.location.href = '/sign-in?trial=true';
      return;
    }
    
    if (!priceId) {
      console.error('No price ID provided for paid plan');
      return;
    }
    
    await redirectToCheckout(priceId);
  };

  return (
    <PageWrapper ref={sectionRef} id="pricing">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-8 md:mb-12 lg:mb-14">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6">
            <DollarSign className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-purple-600 dark:text-purple-400 text-sm font-medium">
              Pricing
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-3 md:mb-4 lg:mb-6 tracking-tight">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Perfect Plan
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Unlock the full potential of AI-powered note-taking. Choose a plan
            that fits your needs and start creating amazing content today.
          </p>

          {/* Billing Toggle */}
          <div className="flex justify-center mt-6 md:mt-8">
            <PricingToggle isYearly={isYearly} onToggle={setIsYearly} />
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-center max-w-2xl mx-auto">
            <p>Error: {error}</p>
          </div>
        )}

        {/* Pricing Cards */}
        <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5 mb-8 md:mb-12 lg:mb-14">
          {pricingTiers.map((tier, index) => (
            <div key={tier.id} className="pricing-card-wrapper w-full">
              <PricingCard
                tier={tier}
                isYearly={isYearly}
                onSelectPlan={handleSelectPlan}
                loading={loading}
              />
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div ref={faqRef} className="mt-8 md:mt-12 lg:mt-16">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 lg:mb-10">
            Frequently Asked Questions
          </h3>
          <div className="grid md:grid-cols-2 gap-3 md:gap-4 lg:gap-5 max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="faq-item p-8 bg-white/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 rounded-2xl hover:border-violet-500/30 transition-all duration-300 backdrop-blur-sm">
                <h4 className="font-bold text-lg mb-3 text-foreground">
                  Can I change my plan later?
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  Yes! You can upgrade or downgrade your plan at any time.
                  Changes will be prorated and reflected in your next billing
                  cycle.
                </p>
              </div>
              <div className="faq-item p-8 bg-white/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 rounded-2xl hover:border-violet-500/30 transition-all duration-300 backdrop-blur-sm">
                <h4 className="font-bold text-lg mb-3 text-foreground">
                  What payment methods do you accept?
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  We accept all major credit cards (Visa, MasterCard, American
                  Express) and bank transfers for Enterprise plans.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="faq-item p-8 bg-white/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 rounded-2xl hover:border-violet-500/30 transition-all duration-300 backdrop-blur-sm">
                <h4 className="font-bold text-lg mb-3 text-foreground">
                  Is there a free trial?
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  Yes! All paid plans come with a 14-day free trial. No credit
                  card required to start.
                </p>
              </div>
              <div className="faq-item p-8 bg-white/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 rounded-2xl hover:border-violet-500/30 transition-all duration-300 backdrop-blur-sm">
                <h4 className="font-bold text-lg mb-3 text-foreground">
                  Can I cancel anytime?
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  Absolutely! You can cancel your subscription at any time. Your
                  access will continue until the end of your current billing
                  period.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Pricing;
