import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/config/auth";
import { stripe } from "@/config/stripe";
import { getSubscriptionByUserId } from "@/lib/database/subscription";

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
        { error: "No subscription found" },
        { status: 404 }
      );
    }

    // Reactivate subscription using Stripe API
    const updatedSubscription = await stripe.subscriptions.update(
      subscription.stripeSubscriptionId,
      {
        cancel_at_period_end: false,
      }
    );

    return NextResponse.json({
      success: true,
      message: "Subscription has been reactivated",
      subscription: {
        id: updatedSubscription.id,
        cancelAtPeriodEnd: updatedSubscription.cancel_at_period_end,
        currentPeriodEnd: new Date(
          updatedSubscription.current_period_end * 1000
        ).toISOString(),
      },
    });
  } catch (error) {
    console.error("Error reactivating subscription:", error);
    return NextResponse.json(
      {
        error: "Failed to reactivate subscription",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
