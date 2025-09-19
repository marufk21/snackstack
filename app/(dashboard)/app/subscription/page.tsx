"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import Link from "next/link";

// Mock subscription data - in a real app, this would come from your database
const mockSubscription = {
  id: "sub_1234567890",
  status: "active",
  plan: {
    name: "Pro",
    price: 19,
    interval: "month",
  },
  currentPeriodStart: new Date("2024-01-15"),
  currentPeriodEnd: new Date("2024-02-15"),
  cancelAtPeriodEnd: false,
};

export default function SubscriptionPage() {
  const [subscription] = useState(mockSubscription);
  const [loading, setLoading] = useState(false);

  const handleCancelSubscription = async () => {
    setLoading(true);
    // In a real app, you would make an API call to cancel the subscription
    try {
      console.log("Canceling subscription...");
      // await cancelSubscription();
      // Update UI accordingly
    } catch (error) {
      console.error("Error canceling subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReactivateSubscription = async () => {
    setLoading(true);
    try {
      console.log("Reactivating subscription...");
      // await reactivateSubscription();
    } catch (error) {
      console.error("Error reactivating subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "canceled":
        return <Badge variant="destructive">Canceled</Badge>;
      case "past_due":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Past Due</Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

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
                <CardDescription>
                  Your active subscription details
                </CardDescription>
              </div>
              {getStatusBadge(subscription.status)}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  {subscription.plan.name} Plan
                </h3>
                <p className="text-2xl font-bold">
                  ${subscription.plan.price}
                  <span className="text-sm font-normal text-muted-foreground">
                    /{subscription.plan.interval}
                  </span>
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Billing period:{" "}
                    {formatDate(subscription.currentPeriodStart)} -{" "}
                    {formatDate(subscription.currentPeriodEnd)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Settings className="h-4 w-4" />
                  <span>
                    Next billing date:{" "}
                    {formatDate(subscription.currentPeriodEnd)}
                  </span>
                </div>
              </div>
            </div>

            {subscription.cancelAtPeriodEnd && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800">
                      Subscription scheduled for cancellation
                    </p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Your subscription will end on{" "}
                      {formatDate(subscription.currentPeriodEnd)}. You'll still
                      have access to Pro features until then.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Plan Features */}
        <Card>
          <CardHeader>
            <CardTitle>Your Pro Features</CardTitle>
            <CardDescription>
              What's included in your current plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Core Features</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✅ Unlimited notes</li>
                  <li>✅ Advanced AI suggestions</li>
                  <li>✅ Unlimited image uploads</li>
                  <li>✅ Advanced markdown support</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">Premium Benefits</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✅ Real-time collaboration</li>
                  <li>✅ Priority support</li>
                  <li>✅ Export to PDF/Word</li>
                  <li>✅ Custom themes</li>
                </ul>
              </div>
            </div>
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

              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download Invoice
              </Button>

              {subscription.status === "active" &&
              !subscription.cancelAtPeriodEnd ? (
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleCancelSubscription}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Cancel Subscription"}
                </Button>
              ) : subscription.cancelAtPeriodEnd ? (
                <Button
                  className="w-full"
                  onClick={handleReactivateSubscription}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Reactivate"}
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
