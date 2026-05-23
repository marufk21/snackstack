"use client";

import React, { useState, useRef } from "react";
import { PricingCard } from "@/components/ui/pricing-card";
import { PricingToggle } from "@/components/ui/pricing-toggle";
import { useStripeCheckout } from "@/hooks/use-stripe-checkout";
import { pricingTiers } from "@/lib/pricing";
import { useGSAP } from "@/hooks/use-gsap";
import gsap from "gsap";
import PageWrapper from "./page-wrapper";
import { useSession } from "next-auth/react";


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

  const { data: session } = useSession();

  const handleSelectPlan = async (priceId: string | null, planName: string, isTrial?: boolean) => {
    if (!session) {
      const params = new URLSearchParams();
      if (priceId) params.append("priceId", priceId);
      if (planName) params.append("planName", planName);
      if (isTrial) params.append("trial", "true");
      
      window.location.href = `/sign-in?${params.toString()}`;
      return;
    }

    if (isTrial) {
      window.location.href = "/sign-in";
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
        <div ref={headerRef} className="text-center mb-4 sm:mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 mb-4 sm:mb-6 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
            <span className="text-cyan-600 dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider">
              Pricing Plans
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-2 sm:mb-4 lg:mb-6 tracking-tight">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
              Perfect Plan
            </span>
          </h2>
          <p className="text-sm sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Unlock the full potential of AI-powered note-taking. Choose a plan
            that fits your needs and start creating amazing content today.
          </p>

          {/* Billing Toggle */}
          <div className="flex justify-center mt-4 sm:mt-6 md:mt-8">
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
        <div
          ref={cardsRef}
          className="flex overflow-x-auto snap-x snap-mandatory lg:grid lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5 mb-6 sm:mb-10 md:mb-14 px-4 sm:px-0 -mx-4 sm:mx-0 pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {pricingTiers.map((tier, index) => (
            <div
              key={tier.id}
              className="pricing-card-wrapper min-w-[85vw] sm:min-w-[340px] lg:min-w-0 snap-center shrink-0"
            >
              <PricingCard
                tier={tier}
                isYearly={isYearly}
                onSelectPlan={handleSelectPlan}
                loading={loading}
              />
            </div>
          ))}
        </div>

     
      </div>
    </PageWrapper>
  );
};

export default Pricing;
