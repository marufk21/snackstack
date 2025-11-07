import { NextResponse } from "next/server";
import { protectApiRoute } from "@/lib/utils/api-protection";
import { 
  getSubscriptionByClerkUserId,
  hasActiveSubscription,
  getUserSubscriptionTier 
} from "@/lib/database/subscription";
import { PLAN_LIMITS } from "@/lib/utils/subscription-check";

/**
 * Get current user's subscription status and limits
 */
export async function GET() {
  const { error, user } = await protectApiRoute();
  if (error) return error;

  try {
    const isActive = await hasActiveSubscription(user.id);
    const tier = await getUserSubscriptionTier(user.id);
    const limits = PLAN_LIMITS[tier];

    const subscriptionData = await getSubscriptionByClerkUserId(user.id);

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
            currentPeriodStart: subscriptionData.currentPeriodStart.toISOString(),
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






