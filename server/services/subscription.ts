import { db as prisma } from "@/server/db/client";
import Stripe from "stripe";

export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "incomplete"
  | "incomplete_expired"
  | "past_due"
  | "trialing"
  | "unpaid";

export type PlanType = "basic" | "pro" | "enterprise";

interface CreateSubscriptionData {
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripePriceId: string;
  stripeProductId?: string;
  status: SubscriptionStatus;
  planType: PlanType;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd?: boolean;
  canceledAt?: Date | null;
  trialStart?: Date | null;
  trialEnd?: Date | null;
}

interface UpdateSubscriptionData {
  status?: SubscriptionStatus;
  stripePriceId?: string;
  planType?: PlanType;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
  canceledAt?: Date | null;
  trialStart?: Date | null;
  trialEnd?: Date | null;
}

export async function createSubscription(data: CreateSubscriptionData) {
  return await prisma.$transaction(async (tx) => {
    const subscription = await tx.subscription.create({
      data: {
        userId: data.userId,
        stripeCustomerId: data.stripeCustomerId,
        stripeSubscriptionId: data.stripeSubscriptionId,
        stripePriceId: data.stripePriceId,
        stripeProductId: data.stripeProductId,
        status: data.status,
        planType: data.planType,
        currentPeriodStart: data.currentPeriodStart,
        currentPeriodEnd: data.currentPeriodEnd,
        cancelAtPeriodEnd: data.cancelAtPeriodEnd ?? false,
        canceledAt: data.canceledAt,
        trialStart: data.trialStart,
        trialEnd: data.trialEnd,
      },
      include: {
        user: true,
      },
    });

    const isActive = data.status === "active" || data.status === "trialing";
    await tx.user.update({
      where: { id: data.userId },
      data: { isSubscribed: isActive },
    });

    return subscription;
  });
}

export async function updateSubscriptionByStripeId(
  stripeSubscriptionId: string,
  data: UpdateSubscriptionData
) {
  return await prisma.$transaction(async (tx) => {
    const subscription = await tx.subscription.update({
      where: { stripeSubscriptionId },
      data,
    });

    if (data.status) {
      const isActive = data.status === "active" || data.status === "trialing";
      await tx.user.update({
        where: { id: subscription.userId },
        data: { isSubscribed: isActive },
      });
    }

    return subscription;
  });
}

export async function getSubscriptionByStripeId(stripeSubscriptionId: string) {
  return await prisma.subscription.findUnique({
    where: { stripeSubscriptionId },
  });
}

export async function getSubscriptionByUserId(userId: string) {
  return await prisma.subscription.findUnique({
    where: { userId },
  });
}

export async function deleteSubscriptionByStripeId(
  stripeSubscriptionId: string
) {
  return await prisma.subscription.delete({
    where: { stripeSubscriptionId },
  });
}

export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const subscription = await getSubscriptionByUserId(userId);

  if (!subscription) {
    return false;
  }

  const now = new Date();
  const isActive =
    subscription.status === "active" || subscription.status === "trialing";
  const notExpired = subscription.currentPeriodEnd > now;

  return isActive && notExpired;
}

export async function getUserSubscriptionTier(
  userId: string
): Promise<PlanType | "free"> {
  const subscription = await getSubscriptionByUserId(userId);

  if (!subscription || !(await hasActiveSubscription(userId))) {
    return "free";
  }

  return subscription.planType as PlanType;
}

export function getPlanTypeFromPriceId(priceId: string): PlanType {
  const basicMonthly = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_BASIC_MONTHLY;
  const basicYearly = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_BASIC_YEARLY;
  const proMonthly = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY;
  const proYearly = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEARLY;
  const enterpriseMonthly =
    process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE_MONTHLY;
  const enterpriseYearly =
    process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE_YEARLY;

  if (priceId === basicMonthly || priceId === basicYearly) return "basic";
  if (priceId === proMonthly || priceId === proYearly) return "pro";
  if (priceId === enterpriseMonthly || priceId === enterpriseYearly)
    return "enterprise";

  console.warn(`Unknown price ID: ${priceId}, defaulting to basic`);
  return "basic";
}

export async function upsertSubscriptionFromStripe(
  stripeSubscription: Stripe.Subscription,
  userId: string
) {
  const priceId = stripeSubscription.items.data[0]?.price.id;
  const productId = stripeSubscription.items.data[0]?.price.product as string;
  const planType = getPlanTypeFromPriceId(priceId);

  console.log(`🔍 upsertSubscriptionFromStripe called`);
  console.log(`   Stripe subscription status: ${stripeSubscription.status}`);
  console.log(`   Subscription ID: ${stripeSubscription.id}`);

  const subscriptionData = {
    userId,
    stripeCustomerId: stripeSubscription.customer as string,
    stripeSubscriptionId: stripeSubscription.id,
    stripePriceId: priceId,
    stripeProductId: productId,
    status: stripeSubscription.status as SubscriptionStatus,
    planType,
    currentPeriodStart: new Date(
      (stripeSubscription as any).current_period_start * 1000
    ),
    currentPeriodEnd: new Date(
      (stripeSubscription as any).current_period_end * 1000
    ),
    cancelAtPeriodEnd: (stripeSubscription as any).cancel_at_period_end,
    canceledAt: (stripeSubscription as any).canceled_at
      ? new Date((stripeSubscription as any).canceled_at * 1000)
      : null,
    trialStart: (stripeSubscription as any).trial_start
      ? new Date((stripeSubscription as any).trial_start * 1000)
      : null,
    trialEnd: (stripeSubscription as any).trial_end
      ? new Date((stripeSubscription as any).trial_end * 1000)
      : null,
  };

  console.log(`   Prepared status for DB: ${subscriptionData.status}`);

  const existing = await getSubscriptionByStripeId(stripeSubscription.id);

  if (existing) {
    console.log(`   Existing subscription found, updating...`);
    const result = await updateSubscriptionByStripeId(stripeSubscription.id, {
      status: subscriptionData.status,
      stripePriceId: subscriptionData.stripePriceId,
      planType: subscriptionData.planType,
      currentPeriodStart: subscriptionData.currentPeriodStart,
      currentPeriodEnd: subscriptionData.currentPeriodEnd,
      cancelAtPeriodEnd: subscriptionData.cancelAtPeriodEnd,
      canceledAt: subscriptionData.canceledAt,
      trialStart: subscriptionData.trialStart,
      trialEnd: subscriptionData.trialEnd,
    });
    console.log(`   ✅ Updated subscription with status: ${result.status}`);
    return result;
  }

  console.log(`   No existing subscription, creating new...`);
  const result = await createSubscription(subscriptionData);
  console.log(`   ✅ Created subscription with status: ${result.status}`);
  return result;
}

export async function getExpiredActiveSubscriptions() {
  const now = new Date();

  return await prisma.subscription.findMany({
    where: {
      OR: [{ status: "active" }, { status: "trialing" }],
      currentPeriodEnd: {
        lt: now,
      },
    },
    include: {
      user: true,
    },
  });
}

export async function markExpiredSubscriptionsAsCanceled() {
  const expiredSubscriptions = await getExpiredActiveSubscriptions();

  const results = await Promise.allSettled(
    expiredSubscriptions.map((subscription) =>
      updateSubscriptionByStripeId(subscription.stripeSubscriptionId, {
        status: "canceled",
        canceledAt: new Date(),
      })
    )
  );

  const successful = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;

  return {
    total: expiredSubscriptions.length,
    successful,
    failed,
    expiredSubscriptions,
  };
}

export async function hasAccess(_userId: string): Promise<boolean> {
  return true;
}

// --- AI suggestion tracking ------------------------------------------------

export async function getAISuggestionsRemaining(
  userId: string,
  tier: PlanType | "free"
): Promise<number> {
  const { PLAN_LIMITS } = await import("@/server/utils/subscription-check");
  const limit = PLAN_LIMITS[tier].aiSuggestionsPerMonth;

  if (limit === Infinity) return Infinity;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { aiSuggestionsCount: true, aiSuggestionsResetAt: true },
  });

  const now = new Date();
  const used = user?.aiSuggestionsCount ?? 0;
  const resetAt = user?.aiSuggestionsResetAt;

  if (resetAt && now >= resetAt) {
    return limit;
  }

  return Math.max(0, limit - used);
}

export async function incrementAISuggestionsCount(
  userId: string,
  tier: PlanType | "free"
): Promise<number> {
  const now = new Date();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { aiSuggestionsResetAt: true },
  });

  const shouldReset = user?.aiSuggestionsResetAt && now >= user.aiSuggestionsResetAt;
  const nextReset = new Date();
  nextReset.setMonth(nextReset.getMonth() + 1);

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      aiSuggestionsCount: shouldReset ? 1 : { increment: 1 } as any,
      aiSuggestionsResetAt: shouldReset ? nextReset : (user?.aiSuggestionsResetAt ?? nextReset),
    } as any,
    select: { aiSuggestionsCount: true },
  });

  const { PLAN_LIMITS } = await import("@/server/utils/subscription-check");
  return PLAN_LIMITS[tier].aiSuggestionsPerMonth - (updated as any).aiSuggestionsCount;
}

export async function getUserNoteCount(userId: string): Promise<number> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { noteCount: true },
    });

    return (user as any)?.noteCount || 0;
  } catch (error) {
    console.warn("noteCount field not available, returning 0");
    return 0;
  }
}

export async function getSubscriptionLimits(userId: string): Promise<{
  maxNotes: number;
  tier: PlanType | "free";
}> {
  const { PLAN_LIMITS } = await import("@/server/utils/subscription-check");
  const tier = await getUserSubscriptionTier(userId);

  return {
    maxNotes: PLAN_LIMITS[tier].maxNotes,
    tier,
  };
}

export async function canCreateNote(userId: string): Promise<{
  canCreate: boolean;
  reason?: string;
  currentCount: number;
  maxNotes: number;
  tier: PlanType | "free";
}> {
  const [hasUserAccess, noteCount, limits] = await Promise.all([
    hasAccess(userId),
    getUserNoteCount(userId),
    getSubscriptionLimits(userId),
  ]);

  console.log("🔍 canCreateNote Debug:", {
    userId,
    hasUserAccess,
    noteCount,
    limits,
  });

  if (!hasUserAccess) {
    return {
      canCreate: false,
      reason: `You've reached your ${limits.tier} plan limit of ${limits.maxNotes} notes. Upgrade to create more.`,
      currentCount: noteCount,
      maxNotes: limits.maxNotes,
      tier: limits.tier,
    };
  }

  if (noteCount >= limits.maxNotes) {
    return {
      canCreate: false,
      reason: `You've reached your ${limits.tier} plan limit of ${limits.maxNotes} notes. Upgrade to create more.`,
      currentCount: noteCount,
      maxNotes: limits.maxNotes,
      tier: limits.tier,
    };
  }

  return {
    canCreate: true,
    currentCount: noteCount,
    maxNotes: limits.maxNotes,
    tier: limits.tier,
  };
}

export async function incrementNoteCount(userId: string): Promise<number> {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        noteCount: {
          increment: 1,
        },
      } as any,
      select: { noteCount: true },
    });

    return (user as any).noteCount || 0;
  } catch (error) {
    console.warn("noteCount field not available, returning 0");
    return 0;
  }
}

export async function decrementNoteCount(userId: string): Promise<number> {
  try {
    const currentCount = await getUserNoteCount(userId);
    if (currentCount <= 0) {
      return 0;
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        noteCount: {
          decrement: 1,
        },
      } as any,
      select: { noteCount: true },
    });

    return (user as any).noteCount || 0;
  } catch (error) {
    console.warn("noteCount field not available, returning 0");
    return 0;
  }
}
