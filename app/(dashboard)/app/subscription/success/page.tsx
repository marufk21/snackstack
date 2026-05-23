"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
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
  CheckCircle,
  Loader2,
  ArrowRight,
  Sparkles,
  Calendar,
  CreditCard,
  Zap,
  FileText,
  ImageIcon,
  AlertTriangle,
} from "lucide-react";
import { pricingTiers } from "@/lib/pricing";

function SubscriptionSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [planData, setPlanData] = useState<{
    planType: string;
    status: string;
    currentPeriodStart?: string;
    currentPeriodEnd?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifySubscription = async () => {
      if (!sessionId) {
        setError("No session ID provided");
        setLoading(false);
        return;
      }

      try {
        const syncRes = await fetch("/api/subscription/sync", {
          method: "POST",
        });
        const syncData = await syncRes.json();

        if (!syncData.success && syncData.error) {
          setError(syncData.details || syncData.error);
          setLoading(false);
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, 1500));

        const statusRes = await fetch("/api/subscription/status");
        const statusData = await statusRes.json();

        setPlanData({
          planType:
            statusData.subscription?.planType ||
            syncData.subscription?.planType ||
            "pro",
          status: statusData.subscription?.status || "active",
          currentPeriodStart: statusData.subscription?.currentPeriodStart,
          currentPeriodEnd: statusData.subscription?.currentPeriodEnd,
        });
      } catch (err) {
        console.error("Failed to verify subscription:", err);
      } finally {
        setLoading(false);
      }
    };

    verifySubscription();
  }, [sessionId]);

  const tier =
    pricingTiers.find((t) => t.id === planData?.planType) ||
    pricingTiers.find((t) => t.id === "pro")!;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <Card className="text-center border-0 shadow-xl">
          <CardContent className="py-20">
            <div className="relative mx-auto w-20 h-20 mb-6">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 animate-pulse" />
              <div className="absolute inset-2 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-cyan-500" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-3">
              Activating your subscription...
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              We're confirming your payment and setting up your account. This
              will only take a moment.
            </p>
            <div className="mt-8 flex justify-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <Card className="text-center border-red-200 dark:border-red-800 shadow-xl">
          <CardContent className="py-16">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-red-700 dark:text-red-400">
              Something went wrong
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {error}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/app/subscription">
                <Button variant="outline">Check Subscription</Button>
              </Link>
              <Link href="/app/pricing">
                <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700">
                  Back to Pricing
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const planPrice = tier.price.monthly;
  const isPaid = planPrice > 0;

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-6 animate-in zoom-in-50 duration-500">
          <CheckCircle className="h-10 w-10 text-green-500" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Welcome to{" "}
          <span className="gradient-text">SnackStack {tier.name}</span>!
        </h1>
        <p className="text-muted-foreground text-lg">
          Your subscription has been activated successfully
        </p>
      </div>

      {/* Plan Summary Card */}
      <Card className="border-0 shadow-xl mb-6 overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-cyan-500 to-blue-600" />
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl capitalize">
                  {tier.name} Plan
                </CardTitle>
                <CardDescription>{tier.description}</CardDescription>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-sm px-3 py-1">
              Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Price & Billing */}
          <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-5 space-y-3">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">
                {isPaid ? `₹${planPrice.toLocaleString("en-IN")}` : "Free"}
              </span>
              {isPaid && (
                <span className="text-muted-foreground text-sm">/month</span>
              )}
            </div>
            {planData?.currentPeriodStart && planData?.currentPeriodEnd && (
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-cyan-500" />
                  <span>
                    Billing period: {formatDate(planData.currentPeriodStart)} —{" "}
                    {formatDate(planData.currentPeriodEnd)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-cyan-500" />
                  <span>
                    Next billing date: {formatDate(planData.currentPeriodEnd)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">
              What's included
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {tier.features.map((feature, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 bg-white/60 dark:bg-white/5 rounded-lg p-3 border"
                >
                  <Zap className="h-4 w-4 text-cyan-500 mt-0.5 shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="border-0 shadow-xl mb-8">
        <CardContent className="py-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-lg font-bold">
                  {tier.id === "free-trial"
                    ? "5"
                    : tier.id === "basic"
                    ? "50"
                    : tier.id === "pro"
                    ? "500"
                    : "Unlimited"}
                </p>
                <p className="text-xs text-muted-foreground">Notes</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <ImageIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-lg font-bold">
                  {tier.id === "free-trial"
                    ? "5MB"
                    : tier.id === "basic"
                    ? "10MB"
                    : tier.id === "pro"
                    ? "20MB"
                    : "100MB"}
                </p>
                <p className="text-xs text-muted-foreground">Image uploads</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/app" className="flex-1">
          <Button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 h-12">
            Start Creating Notes
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
        <Link href="/app/subscription" className="flex-1">
          <Button variant="outline" className="w-full h-12">
            Manage Subscription
          </Button>
        </Link>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-6">
        Need help? Contact us at{" "}
        <a
          href="mailto:support@snackstack.com"
          className="text-cyan-600 dark:text-cyan-400 hover:underline"
        >
          support@snackstack.com
        </a>
      </p>
    </div>
  );
}

export default function SubscriptionSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-16 max-w-2xl">
          <Card className="text-center border-0 shadow-xl">
            <CardContent className="py-20">
              <div className="relative mx-auto w-20 h-20 mb-6">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 animate-pulse" />
                <div className="absolute inset-2 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                  <Loader2 className="h-10 w-10 animate-spin text-cyan-500" />
                </div>
              </div>
              <h2 className="text-2xl font-bold">Loading...</h2>
            </CardContent>
          </Card>
        </div>
      }
    >
      <SubscriptionSuccessContent />
    </Suspense>
  );
}
