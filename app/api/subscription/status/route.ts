import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  getSubscriptionByUserId,
  hasActiveSubscription,
  getUserSubscriptionTier,
} from "@/lib/database/subscription";
import { PLAN_LIMITS } from "@/lib/utils/subscription-check";

/**
 * Get current user's subscription status and limits
 */
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const isActive = await hasActiveSubscription(session.user.id);
    const tier = await getUserSubscriptionTier(session.user.id);
    const limits = PLAN_LIMITS[tier];

    const subscriptionData = await getSubscriptionByUserId(session.user.id);

    return NextResponse.json({
      hasSubscription: isActive,
      tier,
      isActive,
      limits,
      subscription: subscriptionData
        ? {
            status: subscriptionData.status,
            planType: subscriptionData.planType,
            currentPeriodEnd: subscriptionData.currentPeriodEnd.toISOString(),
            currentPeriodStart:
              subscriptionData.currentPeriodStart.toISOString(),
            cancelAtPeriodEnd: subscriptionData.cancelAtPeriodEnd,
            stripeCustomerId: subscriptionData.stripeCustomerId,
          }
        : null,
    });
  } catch (error) {
    console.error("Error fetching subscription status:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription status" },
      { status: 500 }
    );
  }
}
