import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/auth/config";
import { stripe } from "@/server/integrations/stripe/config";
import { getSubscriptionByUserId } from "@/server/services/subscription";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get user's subscription
    const subscription = await getSubscriptionByUserId(user.id);

    if (!subscription) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 }
      );
    }

    // Cancel subscription at period end using Stripe API
    const updatedSubscription = await stripe.subscriptions.update(
      subscription.stripeSubscriptionId,
      {
        cancel_at_period_end: true,
      }
    );

    return NextResponse.json({
      success: true,
      message: "Subscription will be canceled at the end of the billing period",
      subscription: {
        id: updatedSubscription.id,
        cancelAtPeriodEnd: updatedSubscription.cancel_at_period_end,
        currentPeriodEnd: new Date(
          (updatedSubscription as any).current_period_end * 1000
        ).toISOString(),
      },
    });
  } catch (error) {
    console.error("Error canceling subscription:", error);
    return NextResponse.json(
      {
        error: "Failed to cancel subscription",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
