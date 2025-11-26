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
import { Check } from "lucide-react";

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
  stripePriceId: string;
}

interface PricingCardProps {
  tier: PricingTier;
  isYearly: boolean;
  onSelectPlan: (priceId: string, planName: string) => void;
  loading?: boolean;
}

export function PricingCard({
  tier,
  isYearly,
  onSelectPlan,
  loading,
}: PricingCardProps) {
  const price = isYearly ? tier.price.yearly : tier.price.monthly;
  const yearlyDiscount = isYearly
    ? Math.round((1 - tier.price.yearly / (tier.price.monthly * 12)) * 100)
    : 0;

  return (
    <Card
      className={`relative w-full h-full flex flex-col bg-white/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 backdrop-blur-sm transition-all duration-300 hover:border-violet-500/30 hover:shadow-xl rounded-3xl ${tier.popular ? "ring-2 ring-violet-500 shadow-lg scale-105 z-10" : "hover:-translate-y-1"
        }`}
    >
      {tier.popular && (
        <Badge className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-1 rounded-full shadow-lg border-0 text-sm font-semibold">
          Most Popular
        </Badge>
      )}

      <CardHeader className="text-center pt-8 pb-6">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">{tier.name}</CardTitle>
        <CardDescription className="text-base text-muted-foreground mt-2">
          {tier.description}
        </CardDescription>
        <div className="mt-6">
          <div className="flex items-baseline justify-center">
            <span className="text-5xl font-extrabold tracking-tight text-foreground">${price}</span>
            <span className="text-muted-foreground ml-2 font-medium">
              /{isYearly ? "year" : "month"}
            </span>
          </div>
          {isYearly && yearlyDiscount > 0 && (
            <div className="mt-3">
              <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
                Save {yearlyDiscount}% yearly
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6 flex-grow">
        <ul className="space-y-4">
          {tier.features.map((feature, index) => (
            <li key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-500/10 flex items-center justify-center mt-0.5">
                <Check className="h-4 w-4 text-violet-600 dark:text-violet-400" />
              </div>
              <span className="text-sm text-muted-foreground font-medium">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="pb-8 pt-4">
        <Button
          className={`w-full rounded-full py-6 text-lg font-semibold transition-all duration-300 ${tier.popular 
            ? "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-indigo-500/25" 
            : "bg-white dark:bg-white/5 border-2 border-gray-200 dark:border-white/10 hover:border-violet-500/50 hover:bg-violet-50 dark:hover:bg-white/10 text-foreground"
          }`}
          variant={tier.popular ? "default" : "outline"}
          onClick={() => onSelectPlan(tier.stripePriceId, tier.name)}
          disabled={loading}
        >
          {loading ? "Processing..." : `Choose ${tier.name}`}
        </Button>
      </CardFooter>
    </Card>
  );
}
