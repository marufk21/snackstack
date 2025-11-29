import { NextResponse } from "next/server";
import { auth } from "@/config/auth";
import {
  getSubscriptionByUserId,
  hasActiveSubscription,
  getUserSubscriptionTier,
  isUserOnFreeTrial,
  getRemainingTrialDays,
} from "@/lib/database/subscription";
import { PLAN_LIMITS } from "@/lib/utils/subscription-check";
import { db as prisma } from "@/lib/database/client";

export const dynamic = "force-dynamic";

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

    // Check Free Trial status (gracefully handle if migration not run)
    let onFreeTrial = false;
    let remainingTrialDays = 0;
    let freeTrialEndsAt = null;

    try {
      onFreeTrial = await isUserOnFreeTrial(session.user.id);
      remainingTrialDays = onFreeTrial
        ? await getRemainingTrialDays(session.user.id)
        : 0;

      // Get trial end date if applicable
      if (onFreeTrial) {
        const user = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { freeTrialEndsAt: true } as any,
        });
        freeTrialEndsAt = user?.freeTrialEndsAt?.toISOString() || null;
      }
    } catch (trialError) {
      // Free Trial feature not available yet (migration not run)
      console.warn('Free Trial check failed:', trialError);
    }

    return NextResponse.json({
      hasSubscription: isActive,
      tier,
      isActive,
      limits,
      onFreeTrial,
      remainingTrialDays,
      freeTrialEndsAt,
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
