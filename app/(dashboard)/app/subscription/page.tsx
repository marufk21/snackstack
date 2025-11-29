"use client";

import React, { useState, useEffect } from "react";
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
  Clock,
} from "lucide-react";
import Link from "next/link";
import { SubscriptionEndedDialog } from "@/components/subscription/subscription-ended-dialog";

// Disable static generation for this page
export const dynamic = "force-dynamic";

interface SubscriptionData {
  hasSubscription: boolean;
  onFreeTrial: boolean;
  remainingTrialDays?: number;
  freeTrialEndsAt?: string;
  subscription?: {
    status: string;
    planType: string;
    currentPeriodEnd: string;
    currentPeriodStart: string;
    cancelAtPeriodEnd: boolean;
  };
}

export default function SubscriptionPage() {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showEndedDialog, setShowEndedDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

  const fetchSubscriptionStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/subscription/status");
      if (!response.ok) throw new Error("Failed to fetch subscription");
      const data = await response.json();
      setSubscriptionData(data);

      // Show dialog if trial is ending soon or subscription is ending
      if (data.onFreeTrial && data.remainingTrialDays && data.remainingTrialDays <= 3) {
        setShowEndedDialog(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm("Are you sure you want to cancel your subscription? You'll still have access until the end of your billing period.")) {
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch("/api/subscription/cancel", {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to cancel subscription");

      await fetchSubscriptionStatus();
      alert("Subscription will be canceled at the end of the billing period");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to cancel subscription");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReactivateSubscription = async () => {
    setActionLoading(true);
    try {
      const response = await fetch("/api/subscription/reactivate", {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to reactivate subscription");

      await fetchSubscriptionStatus();
      alert("Subscription has been reactivated");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to reactivate subscription");
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">Active</Badge>;
      case "canceled":
        return <Badge variant="destructive">Canceled</Badge>;
      case "past_due":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">Past Due</Badge>
        );
      case "trialing":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">Trialing</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPlanPrice = (planType: string) => {
    const prices: Record<string, { monthly: number; yearly: number }> = {
      basic: { monthly: 749, yearly: 5988 },
      pro: { monthly: 1599, yearly: 12792 },
      enterprise: { monthly: 4099, yearly: 32792 },
    };
    return prices[planType] || { monthly: 0, yearly: 0 };
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <p className="text-red-600 dark:text-red-400">Error: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSyncSubscription = async () => {
    setActionLoading(true);
    try {
      const response = await fetch("/api/subscription/sync", {
        method: "POST",
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Failed to sync subscription");
      }
      
      const data = await response.json();
      await fetchSubscriptionStatus();
      
      if (data.active) {
        alert("Subscription found and synced successfully!");
      } else {
        alert("No active subscription found on Stripe.");
      }
    } catch (err) {
      alert(`Sync failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Free Trial User
  if (subscriptionData?.onFreeTrial) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Free Trial</h1>
          <p className="text-muted-foreground">
            You're currently on a 14-day free trial of SnackStack.
          </p>
        </div>

        <div className="grid gap-6">
          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Free Trial Status
                  </CardTitle>
                  <CardDescription>Your trial details</CardDescription>
                </div>
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                  {subscriptionData.remainingTrialDays} days remaining
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-2">Trial ends on:</p>
                <p className="text-lg font-semibold">
                  {subscriptionData.freeTrialEndsAt && formatDate(subscriptionData.freeTrialEndsAt)}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">What's included in your trial:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Up to 10 notes</li>
                  <li>• Basic AI suggestions</li>
                  <li>• Image uploads (5MB total)</li>
                  <li>• Basic markdown support</li>
                </ul>
              </div>

              <Link href="/app/pricing" className="block">
                <Button className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
                  Upgrade to Premium
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <SubscriptionEndedDialog
          open={showEndedDialog}
          onOpenChange={setShowEndedDialog}
          isTrial={true}
          remainingDays={subscriptionData.remainingTrialDays || 0}
          expiryDate={subscriptionData.freeTrialEndsAt ? new Date(subscriptionData.freeTrialEndsAt) : undefined}
        />
      </div>
    );
  }

  // No Subscription (Free Plan)
  if (!subscriptionData?.hasSubscription) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Subscription</h1>
          <p className="text-muted-foreground">
            Manage your SnackStack subscription and billing information.
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Current Plan
                  </CardTitle>
                  <CardDescription>Your active subscription details</CardDescription>
                </div>
                <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                  Free Plan
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Free Plan</h3>
                  <p className="text-2xl font-bold">
                    ₹0
                    <span className="text-sm font-normal text-muted-foreground">
                      /month
                    </span>
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Limited features access</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Settings className="h-4 w-4" />
                    <span>Upgrade to unlock all features</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-100 dark:border-gray-800">
                <h4 className="font-medium mb-2">Free Plan Limits:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Read-only access to notes</li>
                  <li>• No AI suggestions</li>
                  <li>• No image uploads</li>
                  <li>• Community support only</li>
                </ul>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <Link href="/app/pricing" className="flex-1">
                    <Button className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
                      Upgrade to Premium
                    </Button>
                  </Link>
                  <Link href="/app/pricing?trial=true" className="flex-1">
                    <Button variant="outline" className="w-full">
                      Start Free Trial
                    </Button>
                  </Link>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSyncSubscription}
                  disabled={actionLoading}
                  className="text-muted-foreground hover:text-primary"
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Checking Stripe...
                    </>
                  ) : (
                    "Already paid? Check Status"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Active Subscription
  const subscription = subscriptionData.subscription;

  if (!subscription) {
    console.error("Subscription data missing despite hasSubscription=true", subscriptionData);
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <p className="text-red-600">
              Error: Subscription details not found. Please contact support.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const planPrice = getPlanPrice(subscription.planType);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Subscription Management</h1>
        <p className="text-muted-foreground">
          Manage your SnackStack subscription and billing information.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Current Plan */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Current Plan
                </CardTitle>
                <CardDescription>Your active subscription details</CardDescription>
              </div>
              {getStatusBadge(subscription.status)}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2 capitalize">
                  {subscription.planType} Plan
                </h3>
                <p className="text-2xl font-bold">
                  ₹{planPrice.monthly.toLocaleString('en-IN')}
                  <span className="text-sm font-normal text-muted-foreground">
                    /month
                  </span>
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Billing period: {formatDate(subscription.currentPeriodStart)} -{" "}
                    {formatDate(subscription.currentPeriodEnd)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Settings className="h-4 w-4" />
                  <span>
                    Next billing date: {formatDate(subscription.currentPeriodEnd)}
                  </span>
                </div>
              </div>
            </div>

            {subscription.cancelAtPeriodEnd && (
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
              Update your plan, payment method, or cancel your subscription
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/app/pricing">
                <Button variant="outline" className="w-full">
                  Change Plan
                </Button>
              </Link>

              <Button variant="outline" className="w-full" disabled>
                <Download className="h-4 w-4 mr-2" />
                Download Invoice
              </Button>

              {subscription.status === "active" && !subscription.cancelAtPeriodEnd ? (
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleCancelSubscription}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Processing..." : "Cancel Subscription"}
                </Button>
              ) : subscription.cancelAtPeriodEnd ? (
                <Button
                  className="w-full"
                  onClick={handleReactivateSubscription}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Processing..." : "Reactivate"}
                </Button>
              ) : null}
            </div>

            <div className="text-xs text-muted-foreground">
              <p>
                Need help? Contact support at{" "}
                <a
                  href="mailto:support@snackstack.com"
                  className="text-primary hover:underline"
                >
                  support@snackstack.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
