import { auth } from "@/server/auth/config";
import {
  hasActiveSubscription,
  getUserSubscriptionTier,
  PlanType,
} from "@/server/services/subscription";

export const PLAN_LIMITS = {
  free: {
    maxNotes: 5,
    canUploadImages: true,
    canUseAI: true,
    maxImageSize: 5 * 1024 * 1024,
    aiSuggestionsPerMonth: 30,
  },
  basic: {
    maxNotes: 50,
    canUploadImages: true,
    canUseAI: true,
    maxImageSize: 10 * 1024 * 1024,
    aiSuggestionsPerMonth: 300,
  },
  pro: {
    maxNotes: 500,
    canUploadImages: true,
    canUseAI: true,
    maxImageSize: 20 * 1024 * 1024,
    aiSuggestionsPerMonth: 1500,
  },
  enterprise: {
    maxNotes: Infinity,
    canUploadImages: true,
    canUseAI: true,
    maxImageSize: 100 * 1024 * 1024,
    aiSuggestionsPerMonth: Infinity,
  },
} as const;

export async function checkUserSubscription() {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      hasSubscription: false,
      tier: "free" as const,
      isActive: false,
    };
  }

  const isActive = await hasActiveSubscription(session.user.id);
  const tier = await getUserSubscriptionTier(session.user.id);

  return {
    hasSubscription: isActive,
    tier,
    isActive,
    limits: PLAN_LIMITS[tier],
  };
}

export async function canAccessFeature(
  feature: keyof typeof PLAN_LIMITS.free
): Promise<boolean> {
  const { tier } = await checkUserSubscription();
  const limits = PLAN_LIMITS[tier];

  return limits[feature] as boolean;
}

export async function hasReachedLimit(
  currentUsage: number,
  limitType: "maxNotes"
): Promise<{ reachedLimit: boolean; limit: number; tier: PlanType | "free" }> {
  const { tier } = await checkUserSubscription();
  const limits = PLAN_LIMITS[tier];
  const limit = limits[limitType];

  return {
    reachedLimit: currentUsage >= limit,
    limit,
    tier,
  };
}

export async function getUserLimits() {
  const { tier } = await checkUserSubscription();
  return PLAN_LIMITS[tier];
}

export async function requireSubscription(minTier?: PlanType) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Authentication required");
  }

  const isActive = await hasActiveSubscription(session.user.id);

  if (!isActive) {
    throw new Error("Active subscription required");
  }

  if (minTier) {
    const tier = await getUserSubscriptionTier(session.user.id);
    const tierOrder = ["free", "basic", "pro", "enterprise"];
    const userTierIndex = tierOrder.indexOf(tier);
    const minTierIndex = tierOrder.indexOf(minTier);

    if (userTierIndex < minTierIndex) {
      throw new Error(`${minTier} subscription or higher required`);
    }
  }

  return true;
}

export function isTierSufficient(
  currentTier: PlanType | "free",
  requiredTier: PlanType | "free"
): boolean {
  const tierOrder = ["free", "basic", "pro", "enterprise"];
  const currentIndex = tierOrder.indexOf(currentTier);
  const requiredIndex = tierOrder.indexOf(requiredTier);

  return currentIndex >= requiredIndex;
}
