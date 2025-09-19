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
      className={`relative w-full max-w-sm ${
        tier.popular ? "ring-2 ring-primary shadow-lg" : ""
      }`}
    >
      {tier.popular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
          Most Popular
        </Badge>
      )}

      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {tier.description}
        </CardDescription>
        <div className="mt-4">
          <div className="flex items-baseline justify-center">
            <span className="text-4xl font-bold">${price}</span>
            <span className="text-muted-foreground ml-1">
              /{isYearly ? "year" : "month"}
            </span>
          </div>
          {isYearly && yearlyDiscount > 0 && (
            <div className="mt-2">
              <Badge variant="secondary" className="text-xs">
                Save {yearlyDiscount}% yearly
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <ul className="space-y-3">
          {tier.features.map((feature, index) => (
            <li key={index} className="flex items-start space-x-3">
              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
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
