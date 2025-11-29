"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

interface UpgradePromptProps {
  feature: string;
  currentPlan?: "free-trial" | "basic" | "pro" | "enterprise";
  requiredPlan?: "basic" | "pro" | "enterprise";
  variant?: "inline" | "card" | "banner";
  className?: string;
}

export function UpgradePrompt({
  feature,
  currentPlan = "free-trial",
  requiredPlan = "pro",
  variant = "card",
  className = "",
}: UpgradePromptProps) {
  const planNames = {
    "free-trial": "Free Trial",
    basic: "Basic",
    pro: "Pro",
    enterprise: "Enterprise",
  };

  if (variant === "inline") {
    return (
      <div className={`flex items-center gap-2 text-sm ${className}`}>
        <Sparkles className="h-4 w-4 text-violet-600 dark:text-violet-400" />
        <span className="text-muted-foreground">
          {feature} is available on the {planNames[requiredPlan]} plan.
        </span>
        <Link href="/app/pricing">
          <Button size="sm" variant="link" className="h-auto p-0">
            Upgrade <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </Link>
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <div
        className={`bg-gradient-to-r from-violet-500/10 to-indigo-500/10 border border-violet-500/20 rounded-lg p-4 ${className}`}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">
                Unlock {feature}
              </h4>
              <p className="text-sm text-muted-foreground">
                Upgrade to {planNames[requiredPlan]} to access this premium feature
              </p>
            </div>
          </div>
          <Link href="/app/pricing">
            <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 flex-shrink-0">
              Upgrade Now
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Default: card variant
  return (
    <Card className={`border-violet-500/20 ${className}`}>
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Badge className="bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20">
            {planNames[requiredPlan]} Feature
          </Badge>
        </div>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-violet-600 dark:text-violet-400" />
          Unlock {feature}
        </CardTitle>
        <CardDescription>
          This feature is available on the {planNames[requiredPlan]} plan and above.
          {currentPlan && ` You're currently on the ${planNames[currentPlan]} plan.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium mb-2 text-sm">What you'll get:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {requiredPlan === "pro" && (
                <>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                    Unlimited notes and storage
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                    Advanced AI suggestions
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                    Real-time collaboration
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                    Priority support
                  </li>
                </>
              )}
              {requiredPlan === "basic" && (
                <>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                    Up to 50 notes
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                    Basic AI suggestions
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                    Email support
                  </li>
                </>
              )}
            </ul>
          </div>
          <Link href="/app/pricing" className="block">
            <Button className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
              View Plans & Upgrade
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
