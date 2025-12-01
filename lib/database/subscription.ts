import { db as prisma } from "./client";
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

/**
 * Create a new subscription in the database
 */
export async function createSubscription(data: CreateSubscriptionData) {
  // Create subscription and update user's isSubscribed flag in a transaction
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

    // Update user's subscription status
    const isActive = data.status === "active" || data.status === "trialing";
    await tx.user.update({
      where: { id: data.userId },
      data: { isSubscribed: isActive },
    });

    return subscription;
  });
}

/**
 * Update an existing subscription by Stripe subscription ID
 */
export async function updateSubscriptionByStripeId(
  stripeSubscriptionId: string,
  data: UpdateSubscriptionData
) {
  return await prisma.$transaction(async (tx) => {
    const subscription = await tx.subscription.update({
      where: { stripeSubscriptionId },
      data,
    });

    // If status was updated, sync user's isSubscribed flag
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

/**
 * Get subscription by Stripe subscription ID
 */
export async function getSubscriptionByStripeId(stripeSubscriptionId: string) {
  return await prisma.subscription.findUnique({
    where: { stripeSubscriptionId },
  });
}

/**
 * Get subscription by database user ID
 */
export async function getSubscriptionByUserId(userId: string) {
  return await prisma.subscription.findUnique({
    where: { userId },
  });
}

/**
 * Delete a subscription by Stripe subscription ID
 */
export async function deleteSubscriptionByStripeId(
  stripeSubscriptionId: string
) {
  return await prisma.subscription.delete({
    where: { stripeSubscriptionId },
  });
}

/**
 * Check if a user has an active subscription
 */
export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const subscription = await getSubscriptionByUserId(userId);

  if (!subscription) {
    console.log(
      `🔍 hasActiveSubscription: No subscription found for ${userId}`
    );
    return false;
  }

  // Check if subscription is active and not expired
  const now = new Date();
  const isActive =
    subscription.status === "active" || subscription.status === "trialing";
  const notExpired = subscription.currentPeriodEnd > now;

  console.log("🔍 hasActiveSubscription Debug:", {
    id: subscription.id,
    status: subscription.status,
    isActive,
    currentPeriodEnd: subscription.currentPeriodEnd,
    now,
    notExpired,
    result: isActive && notExpired,
  });

  return isActive && notExpired;
}

/**
 * Get user's subscription tier
 */
export async function getUserSubscriptionTier(
  userId: string
): Promise<PlanType | "free"> {
  const subscription = await getSubscriptionByUserId(userId);

  if (!subscription || !(await hasActiveSubscription(userId))) {
    return "free";
  }

  return subscription.planType as PlanType;
}

/**
 * Map Stripe price ID to plan type
 */
export function getPlanTypeFromPriceId(priceId: string): PlanType {
  const basicPriceId = process.env.STRIPE_PRICE_ID_BASIC;
  const proPriceId = process.env.STRIPE_PRICE_ID_PRO;
  const enterprisePriceId = process.env.STRIPE_PRICE_ID_ENTERPRISE;

  if (priceId === basicPriceId) return "basic";
  if (priceId === proPriceId) return "pro";
  if (priceId === enterprisePriceId) return "enterprise";

  // Default to basic if unknown
  console.warn(`Unknown price ID: ${priceId}, defaulting to basic`);
  return "basic";
}

/**
 * Create or update subscription from Stripe subscription object
 */
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

  // Try to update existing subscription first
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

/**
 * Get all expired subscriptions that are still marked as active
 */
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

/**
 * Mark expired subscriptions as canceled
 */
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

/**
 * Start a free trial for a user
 */
export async function startFreeTrial(userId: string) {
  try {
    const trialDays = 14;
    const freeTrialEndsAt = new Date();
    freeTrialEndsAt.setDate(freeTrialEndsAt.getDate() + trialDays);

    return await prisma.user.update({
      where: { id: userId },
      data: {
        isFreeTrialUser: true,
        freeTrialEndsAt,
      } as any,
    });
  } catch (error) {
    console.error(
      "Failed to start free trial. Database migration may not be complete:",
      error
    );
    throw new Error(
      "Free Trial feature not available yet. Please run database migration."
    );
  }
}

/**
 * Check if a user is on an active free trial
 */
export async function isUserOnFreeTrial(userId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        isFreeTrialUser: true,
        freeTrialEndsAt: true,
      } as any, // Use 'as any' to bypass TypeScript errors until migration
    });

    if (!user || !user.isFreeTrialUser || !user.freeTrialEndsAt) {
      return false;
    }

    const now = new Date();
    return user.freeTrialEndsAt > now;
  } catch (error) {
    // If fields don't exist yet (migration not run), return false
    console.warn(
      "Free Trial fields not available yet. Run database migration."
    );
    return false;
  }
}

/**
 * Get remaining trial days for a user
 */
export async function getRemainingTrialDays(userId: string): Promise<number> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        isFreeTrialUser: true,
        freeTrialEndsAt: true,
      } as any,
    });

    if (!user || !user.isFreeTrialUser || !user.freeTrialEndsAt) {
      return 0;
    }

    const now = new Date();
    const diffTime = user.freeTrialEndsAt.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(0, diffDays);
  } catch (error) {
    console.warn(
      "Free Trial fields not available yet. Run database migration."
    );
    return 0;
  }
}

/**
 * End a user's free trial
 */
export async function endFreeTrial(userId: string) {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      isFreeTrialUser: false,
      freeTrialEndsAt: null,
    },
  });
}

/**
 * Check if user has access (either subscribed or on free trial)
 */
export async function hasAccess(userId: string): Promise<boolean> {
  const [hasSubscription, onFreeTrial] = await Promise.all([
    hasActiveSubscription(userId),
    isUserOnFreeTrial(userId),
  ]);

  return hasSubscription || onFreeTrial;
}

/**
 * Get all expired free trials
 */
export async function getExpiredFreeTrials() {
  const now = new Date();

  return await prisma.user.findMany({
    where: {
      isFreeTrialUser: true,
      freeTrialEndsAt: {
        lt: now,
      },
    },
  });
}

/**
 * Mark expired free trials as ended
 */
export async function markExpiredFreeTrialsAsEnded() {
  const expiredTrials = await getExpiredFreeTrials();

  const results = await Promise.allSettled(
    expiredTrials.map((user) => endFreeTrial(user.id))
  );

  const successful = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;

  return {
    total: expiredTrials.length,
    successful,
    failed,
    expiredTrials,
  };
}

/**
 * Get user's current note count
 */
export async function getUserNoteCount(userId: string): Promise<number> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { noteCount: true } as any,
    });

    return user?.noteCount || 0;
  } catch (error) {
    // If noteCount field doesn't exist yet, return 0
    console.warn("noteCount field not available, returning 0");
    return 0;
  }
}

/**
 * Get subscription limits for a user
 */
export async function getSubscriptionLimits(userId: string): Promise<{
  maxNotes: number;
  tier: PlanType | "free";
  onFreeTrial: boolean;
}> {
  const [tier, onFreeTrial] = await Promise.all([
    getUserSubscriptionTier(userId),
    isUserOnFreeTrial(userId),
  ]);

  // Define limits based on tier
  const limits: Record<PlanType | "free", number> = {
    free: onFreeTrial ? 5 : 0, // Free trial gets 5 notes, otherwise 0
    basic: 50,
    pro: 500,
    enterprise: Infinity,
  };

  return {
    maxNotes: limits[tier],
    tier,
    onFreeTrial,
  };
}

/**
 * Check if user can create a note
 */
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

  // Check if user has access (subscription or trial)
  if (!hasUserAccess) {
    return {
      canCreate: false,
      reason: "You need an active subscription or free trial to create notes.",
      currentCount: noteCount,
      maxNotes: limits.maxNotes,
      tier: limits.tier,
    };
  }

  // Check if user has reached their limit
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

/**
 * Increment user's note count
 */
export async function incrementNoteCount(userId: string): Promise<number> {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        noteCount: {
          increment: 1,
        },
      } as any,
      select: { noteCount: true } as any,
    });

    return user.noteCount || 0;
  } catch (error) {
    console.warn("noteCount field not available, returning 0");
    return 0;
  }
}

/**
 * Decrement user's note count (when deleting a note)
 */
export async function decrementNoteCount(userId: string): Promise<number> {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        noteCount: {
          decrement: 1,
        },
      } as any,
      select: { noteCount: true } as any,
    });

    return user.noteCount || 0;
  } catch (error) {
    console.warn("noteCount field not available, returning 0");
    return 0;
  }
}
