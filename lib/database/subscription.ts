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
  userId: number;
  clerkUserId: string;
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
        clerkUserId: data.clerkUserId,
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
    include: {
      user: true,
    },
  });
}

/**
 * Get subscription by Clerk user ID
 */
export async function getSubscriptionByClerkUserId(clerkUserId: string) {
  return await prisma.subscription.findUnique({
    where: { clerkUserId },
    include: {
      user: true,
    },
  });
}

/**
 * Get subscription by database user ID
 */
export async function getSubscriptionByUserId(userId: number) {
  return await prisma.subscription.findUnique({
    where: { userId },
    include: {
      user: true,
    },
  });
}

/**
 * Delete a subscription by Stripe subscription ID
 */
export async function deleteSubscriptionByStripeId(stripeSubscriptionId: string) {
  return await prisma.subscription.delete({
    where: { stripeSubscriptionId },
  });
}

/**
 * Check if a user has an active subscription
 */
export async function hasActiveSubscription(clerkUserId: string): Promise<boolean> {
  const subscription = await getSubscriptionByClerkUserId(clerkUserId);
  
  if (!subscription) {
    return false;
  }
  
  // Check if subscription is active and not expired
  const now = new Date();
  const isActive = subscription.status === "active" || subscription.status === "trialing";
  const notExpired = subscription.currentPeriodEnd > now;
  
  return isActive && notExpired;
}

/**
 * Get user's subscription tier
 */
export async function getUserSubscriptionTier(clerkUserId: string): Promise<PlanType | "free"> {
  const subscription = await getSubscriptionByClerkUserId(clerkUserId);
  
  if (!subscription || !(await hasActiveSubscription(clerkUserId))) {
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
  userId: number,
  clerkUserId: string
) {
  const priceId = stripeSubscription.items.data[0]?.price.id;
  const productId = stripeSubscription.items.data[0]?.price.product as string;
  const planType = getPlanTypeFromPriceId(priceId);

  const subscriptionData = {
    userId,
    clerkUserId,
    stripeCustomerId: stripeSubscription.customer as string,
    stripeSubscriptionId: stripeSubscription.id,
    stripePriceId: priceId,
    stripeProductId: productId,
    status: stripeSubscription.status as SubscriptionStatus,
    planType,
    currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
    currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
    cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
    canceledAt: stripeSubscription.canceled_at 
      ? new Date(stripeSubscription.canceled_at * 1000) 
      : null,
    trialStart: stripeSubscription.trial_start 
      ? new Date(stripeSubscription.trial_start * 1000) 
      : null,
    trialEnd: stripeSubscription.trial_end 
      ? new Date(stripeSubscription.trial_end * 1000) 
      : null,
  };

  // Try to update existing subscription first
  const existing = await getSubscriptionByStripeId(stripeSubscription.id);
  
  if (existing) {
    return await updateSubscriptionByStripeId(stripeSubscription.id, {
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
  }

  return await createSubscription(subscriptionData);
}

/**
 * Get all expired subscriptions that are still marked as active
 */
export async function getExpiredActiveSubscriptions() {
  const now = new Date();
  
  return await prisma.subscription.findMany({
    where: {
      OR: [
        { status: "active" },
        { status: "trialing" },
      ],
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

