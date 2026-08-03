import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Crown, Sparkles } from "lucide-react";

export interface PricingTier {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: string[];
  popular?: boolean;
  stripePriceId: { monthly: string | null; yearly: string | null } | null;
  isTrial?: boolean;
}

interface PricingCardProps {
  tier: PricingTier;
  isYearly: boolean;
  onSelectPlan: (
    priceId: string | null,
    planName: string,
    isTrial?: boolean
  ) => void;
  loading?: boolean;
  currentPlanId?: string | null;
}

const tierIcons: Record<string, React.ReactNode> = {
  "free-trial": <Zap className="h-5 w-5" />,
  basic: <Sparkles className="h-5 w-5" />,
  pro: <Crown className="h-5 w-5" />,
  enterprise: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
};

export function PricingCard({
  tier,
  isYearly,
  onSelectPlan,
  loading,
  currentPlanId,
}: PricingCardProps) {
  const price = isYearly ? tier.price.yearly : tier.price.monthly;
  const yearlyDiscount = isYearly && !tier.isTrial
    ? Math.round((1 - tier.price.yearly / (tier.price.monthly * 12)) * 100)
    : 0;

  const isCurrentPlan = currentPlanId === tier.id;

  const planOrder = ["free-trial", "basic", "pro", "enterprise"];
  const currentPlanIndex = planOrder.indexOf(currentPlanId || "free-trial");
  const thisPlanIndex = planOrder.indexOf(tier.id);

  let buttonText = tier.isTrial ? "Get Started" : `Choose ${tier.name}`;
  if (isCurrentPlan) {
    buttonText = "Current Plan";
  } else if (currentPlanId && thisPlanIndex > currentPlanIndex) {
    buttonText = `Upgrade to ${tier.name}`;
  } else if (currentPlanId && thisPlanIndex < currentPlanIndex) {
    buttonText = `Downgrade to ${tier.name}`;
  }

  const formatFeature = (feature: string): string => {
    if (!isYearly || tier.isTrial) return feature;
    return feature.replace(
      /(\d[\d,]*) AI suggestions\/mo/,
      (_: string, num: string) => `${(parseInt(num.replace(/,/g, ""), 10) * 12).toLocaleString("en-IN")} AI suggestions/yr`
    );
  };

  return (
    <Card
      className={`relative w-full h-full flex flex-col bg-white dark:bg-zinc-900/80 border transition-all duration-300 hover:shadow-2xl rounded-2xl overflow-hidden group ${
        tier.popular
          ? "border-cyan-500/50 shadow-xl shadow-cyan-500/10 ring-1 ring-cyan-500/20 z-10 scale-[1.02]"
          : "border-zinc-200/60 dark:border-zinc-800/60 hover:border-cyan-500/20 hover:-translate-y-1"
      }`}
    >
      {tier.popular && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-teal-500" />
      )}

      {tier.popular && (
        <Badge className="absolute top-4 right-4 bg-gradient-to-r from-cyan-600 to-teal-600 text-white px-3 py-1 rounded-full shadow-lg border-0 text-xs font-semibold tracking-wide">
          Most Popular
        </Badge>
      )}

      <CardHeader className="text-left pt-8 pb-4 px-6">
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              tier.popular
                ? "bg-gradient-to-br from-cyan-500/20 to-teal-500/20 text-cyan-600 dark:text-cyan-400"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
            }`}
          >
            {tierIcons[tier.id] || tierIcons.basic}
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              {tier.name}
            </CardTitle>
            <CardDescription className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
              {tier.description}
            </CardDescription>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-baseline">
            {tier.isTrial ? (
              <>
                <span className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
                  Free
                </span>
                <span className="text-zinc-500 dark:text-zinc-400 ml-2 font-medium text-sm">
                  forever
                </span>
              </>
            ) : (
              <>
                <span className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
                  ₹{price.toLocaleString("en-IN")}
                </span>
                <span className="text-zinc-500 dark:text-zinc-400 ml-1.5 font-medium text-sm">
                  /{isYearly ? "year" : "month"}
                </span>
              </>
            )}
          </div>
          {yearlyDiscount > 0 && (
            <Badge
              variant="secondary"
              className="mt-2 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800"
            >
              Save {yearlyDiscount}%
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-5 flex-grow px-6 pt-2">
        <div className="border-t border-zinc-100 dark:border-zinc-800 pt-5">
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
            What&apos;s included
          </p>
          <ul className="space-y-3">
            {tier.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center mt-0.5">
                  <Check className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                </div>
                <span className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {formatFeature(feature)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>

      <CardFooter className="px-6 pb-8 pt-2">
        <Button
          className={`w-full rounded-xl py-5 text-sm font-semibold transition-all duration-300 ${
            tier.popular
              ? "bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 border-0"
          }`}
          variant={tier.popular ? "default" : "outline"}
          onClick={() => {
            const priceId = tier.stripePriceId
              ? isYearly
                ? tier.stripePriceId.yearly
                : tier.stripePriceId.monthly
              : null;
            onSelectPlan(priceId, tier.name, tier.isTrial);
          }}
          disabled={loading || isCurrentPlan}
        >
          {loading ? "Processing..." : buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}
