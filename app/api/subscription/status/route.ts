import { NextResponse } from "next/server";
import { auth } from "@/server/auth/config";
import { PLAN_LIMITS } from "@/server/utils/subscription-check";
import { db as prisma } from "@/server/db/client";
import {
  getSubscriptionByUserId,
  hasActiveSubscription,
  getUserSubscriptionTier,
  getUserNoteCount,
  getSubscriptionLimits,
  getAISuggestionsRemaining,
} from "@/server/services/subscription";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Resolve the database user ID from email. The JWT callback stores email
  // as token.sub for Edge compatibility, so session.user.id may be an email.
  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!dbUser) {
    // User hasn't been created in the database yet — return defaults
    return NextResponse.json({
      hasSubscription: false,
      tier: "free",
      isActive: false,
      limits: PLAN_LIMITS.free,
      noteCount: 0,
      noteLimit: PLAN_LIMITS.free.maxNotes,
      remainingNotes: PLAN_LIMITS.free.maxNotes,
      aiSuggestionsRemaining: PLAN_LIMITS.free.aiSuggestionsPerMonth,
      aiSuggestionsLimit: PLAN_LIMITS.free.aiSuggestionsPerMonth,
      subscription: null,
    });
  }

  const userId = dbUser.id;

  try {
    const [subscription, isActive, tier, noteCount, limits] =
      await Promise.all([
        getSubscriptionByUserId(userId),
        hasActiveSubscription(userId),
        getUserSubscriptionTier(userId),
        getUserNoteCount(userId),
        getSubscriptionLimits(userId),
      ]);

    // JSON cannot serialize Infinity → use safe sentinel
    const s = (n: number) => (n === Infinity ? 999999 : n);

    // Fetch user's actual usage counts (for "used / limit" display)
    const userStats = await prisma.user.findUnique({
      where: { id: userId },
      select: { aiSuggestionsCount: true, agentRunsCount: true },
    });

    const aiSuggestionsUsed = userStats?.aiSuggestionsCount ?? 0;
    const aiSuggestionsRemaining = await getAISuggestionsRemaining(
      userId,
      tier
    );

    const planLimits = {
      ...PLAN_LIMITS[tier],
      maxNotes: limits.maxNotes,
    };

    const remainingNotes = Math.max(0, limits.maxNotes - noteCount);

    return NextResponse.json({
      hasSubscription: isActive,
      tier,
      isActive,
      limits: planLimits,
      noteCount,
      noteLimit: s(limits.maxNotes),
      remainingNotes: s(remainingNotes),
      aiSuggestionsUsed,
      aiSuggestionsRemaining: s(aiSuggestionsRemaining),
      aiSuggestionsLimit: s(PLAN_LIMITS[tier].aiSuggestionsPerMonth),
      subscription: subscription
        ? {
            status: subscription.status,
            planType: subscription.planType,
            currentPeriodEnd: subscription.currentPeriodEnd.toISOString(),
            currentPeriodStart: subscription.currentPeriodStart.toISOString(),
            cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
            stripeCustomerId: subscription.stripeCustomerId,
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
