"use client";

import React, { useEffect, useState } from "react";
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
import { CheckCircle, Loader2 } from "lucide-react";

export default function SubscriptionSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) {
      // You can verify the session with Stripe here
      // For now, we'll just simulate a successful verification
      setTimeout(() => {
        setSessionData({
          id: sessionId,
          status: "complete",
        });
        setLoading(false);
      }, 2000);
    } else {
      setError("No session ID provided");
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <Card className="text-center">
          <CardContent className="py-16">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-semibold mb-2">
              Processing your subscription...
            </h2>
            <p className="text-muted-foreground">
              Please wait while we confirm your payment and set up your account.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <Card className="text-center border-red-200">
          <CardContent className="py-16">
            <div className="text-red-500 mb-4">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-600 text-2xl">×</span>
              </div>
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-red-700">
              Something went wrong
            </h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Link href="/app/pricing">
              <Button variant="outline">Back to Pricing</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <Card className="text-center border-green-200">
        <CardHeader>
          <div className="mx-auto mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-3xl font-bold text-green-700">
            Welcome to SnackStack Pro! 🎉
          </CardTitle>
          <CardDescription className="text-lg">
            Your subscription has been successfully activated
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">What's next?</h3>
            <ul className="text-sm text-green-700 space-y-2 text-left">
              <li>✅ Your account has been upgraded to Pro</li>
              <li>✅ You now have access to all premium features</li>
              <li>✅ A confirmation email has been sent to your inbox</li>
              <li>
                ✅ You can manage your subscription in your account settings
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Your new Pro features include:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="text-left">
                <h4 className="font-medium mb-2">Enhanced Capabilities</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Unlimited notes</li>
                  <li>• Advanced AI suggestions</li>
                  <li>• Unlimited image uploads</li>
                  <li>• Real-time collaboration</li>
                </ul>
              </div>
              <div className="text-left">
                <h4 className="font-medium mb-2">Premium Support</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Priority customer support</li>
                  <li>• Export to PDF/Word</li>
                  <li>• Custom themes</li>
                  <li>• Advanced markdown</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/app">
              <Button className="w-full sm:w-auto">Start Creating Notes</Button>
            </Link>
            <Link href="/app/subscription">
              <Button variant="outline" className="w-full sm:w-auto">
                Manage Subscription
              </Button>
            </Link>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>
              Need help getting started? Contact our support team at{" "}
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
  );
}
