"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  CreditCard,
  Settings,
  Download,
  AlertTriangle,
  Loader2,
  Sparkles,
  ImageIcon,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { useSubscription } from "@/hooks/use-subscription";

export const dynamic = "force-dynamic";

export default function SubscriptionPage() {
  const {
    subscription: subscriptionData,
    isLoading: loading,
    noteCount,
    noteLimit,
    hasSubscription,
    aiSuggestionsRemaining,
    aiSuggestionsLimit,
    aiSuggestionsUsed,
    tier,
    limits,
  } = useSubscription();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getPlanPrice = (planType: string) => {
    const prices: Record<string, { monthly: number; yearly: number }> = {
      basic: { monthly: 749, yearly: 5988 },
      pro: { monthly: 1599, yearly: 12792 },
      enterprise: { monthly: 4099, yearly: 32792 },
    };
    return prices[planType] || { monthly: 0, yearly: 0 };
  };

  if (loading || !subscriptionData) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
          <span className="text-lg font-medium">Loading subscription...</span>
        </div>
      </div>
    );
  }

  const subscription = subscriptionData.subscription;
  const planName = hasSubscription && subscription
    ? subscription.planType
    : "free";
  const planPrice = getPlanPrice(planName);
  const isFree = !hasSubscription;

  const fmt = (n: number) => (n >= 999999 ? "∞" : n.toLocaleString("en-IN"));
  const lim = (n: number) => n >= 999999;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 gradient-text">
          Subscription
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Manage your SnackStack plan and billing information.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Usage Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Overview</CardTitle>
            <CardDescription>Your current usage across all features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-white/60 dark:bg-white/5 rounded-xl p-4 border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <FileText className="h-4 w-4" /> Notes
                </div>
                <p className="text-2xl font-bold">
                  {fmt(noteCount)}
                  <span className="text-sm font-normal text-muted-foreground">
                    /{fmt(noteLimit)}
                  </span>
                </p>
                {!lim(noteLimit) && (
                  <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-cyan-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${Math.min(100, ((noteCount || 0) / (noteLimit || 1)) * 100)}%` }}
                    />
                  </div>
                )}
              </div>
              <div className="bg-white/60 dark:bg-white/5 rounded-xl p-4 border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Sparkles className="h-4 w-4" /> AI Suggestions
                </div>
                <p className="text-2xl font-bold">
                  {fmt(aiSuggestionsUsed ?? 0)}
                  <span className="text-sm font-normal text-muted-foreground">
                    /{fmt(aiSuggestionsLimit)}
                  </span>
                </p>
                {!lim(aiSuggestionsLimit) && (
                  <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-purple-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${Math.min(100, (((aiSuggestionsUsed ?? 0) / (aiSuggestionsLimit || 1)) * 100))}%` }}
                    />
                  </div>
                )}
              </div>
              <div className="bg-white/60 dark:bg-white/5 rounded-xl p-4 border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <ImageIcon className="h-4 w-4" /> Image Uploads
                </div>
                <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                  Enabled
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Up to {((limits?.maxImageSize ?? 5 * 1024 * 1024) / (1024 * 1024)).toFixed(0)}MB each
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Plan */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Current Plan
                </CardTitle>
                <CardDescription>
                  {isFree ? "No time limit — use as long as you like" : "Your active subscription details"}
                </CardDescription>
              </div>
              <Badge className="bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400">
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2 capitalize">
                  {planName} Plan
                </h3>
                <p className="text-2xl font-bold">
                  {isFree ? "Free" : `₹${planPrice.monthly.toLocaleString("en-IN")}`}
                  <span className="text-sm font-normal text-muted-foreground">
                    {isFree ? "" : "/month"}
                  </span>
                </p>
              </div>
              {!isFree && subscription && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Billing period: {formatDate(subscription.currentPeriodStart)} —{" "}
                      {formatDate(subscription.currentPeriodEnd)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Settings className="h-4 w-4" />
                    <span>Next billing: {formatDate(subscription.currentPeriodEnd)}</span>
                  </div>
                </div>
              )}
            </div>

            {!isFree && subscription?.cancelAtPeriodEnd && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800 dark:text-yellow-400">
                      Subscription scheduled for cancellation
                    </p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-500 mt-1">
                      Your subscription will end on {formatDate(subscription.currentPeriodEnd)}.
                      You'll still have access to premium features until then.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Manage Subscription</CardTitle>
            <CardDescription>
              {isFree ? "Upgrade to unlock more features" : "Update your plan or payment method"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/app/pricing">
                <Button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300">
                  {isFree ? "Upgrade to Premium" : "Change Plan"}
                </Button>
              </Link>

              <Button variant="outline" className="w-full" disabled>
                <Download className="h-4 w-4 mr-2" />
                Download Invoice
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
