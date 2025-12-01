import { NextResponse } from "next/server";
import { auth } from "@/config/auth";
import { PLAN_LIMITS } from "@/lib/utils/subscription-check";
import { db as prisma } from "@/lib/database/client";

export const dynamic = "force-dynamic";

/**
 * Get current user's subscription status and limits
 */
export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get user ID using raw SQL
    const userResult = await prisma.$queryRaw<
      Array<{ id: string; isSubscribed: boolean }>
    >`
      SELECT id, "isSubscribed" FROM "User" WHERE email = ${session.user.email} LIMIT 1
    `;

    if (!userResult || userResult.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = userResult[0].id;
    const isSubscribed = userResult[0].isSubscribed;

    // Get subscription data using raw SQL
    const subscriptionResult = await prisma.$queryRaw<
      Array<{
        status: string;
        planType: string;
        currentPeriodEnd: Date;
        currentPeriodStart: Date;
        cancelAtPeriodEnd: boolean;
        stripeCustomerId: string;
      }>
    >`
      SELECT status, "planType", "currentPeriodEnd", "currentPeriodStart", 
             "cancelAtPeriodEnd", "stripeCustomerId"
      FROM "Subscription"
      WHERE "userId" = ${userId}
      LIMIT 1
    `;

    const subscriptionData =
      subscriptionResult && subscriptionResult.length > 0
        ? subscriptionResult[0]
        : null;

    // Determine if subscription is active
    const now = new Date();
    const isActive = subscriptionData
      ? (subscriptionData.status === "active" ||
          subscriptionData.status === "trialing") &&
        subscriptionData.currentPeriodEnd > now
      : false;

    // Determine tier
    let tier: "free" | "basic" | "pro" | "enterprise" = "free";
    if (subscriptionData && isActive) {
      tier = subscriptionData.planType as any;
    }

    const limits = PLAN_LIMITS[tier];

    return NextResponse.json({
      hasSubscription: isActive,
      tier,
      isActive,
      limits,
      onFreeTrial: false, // We'll implement this later if needed
      remainingTrialDays: 0,
      freeTrialEndsAt: null,
      noteCount: 0, // We'll implement this later if needed
      noteLimit: limits.maxNotes,
      remainingNotes: limits.maxNotes,
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
