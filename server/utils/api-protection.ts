import { auth } from "@/server/auth/config";
import { NextResponse } from "next/server";
import {
  hasActiveSubscription,
  getUserSubscriptionTier,
  PlanType,
} from "@/server/services/subscription";

export async function protectApiRoute() {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      ),
      user: null,
    };
  }

  return {
    error: null,
    user: session.user,
  };
}

export async function protectSubscriptionRoute(minTier?: PlanType) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      ),
      user: null,
      subscription: null,
    };
  }

  try {
    const isActive = await hasActiveSubscription(session.user.id);

    if (!isActive) {
      return {
        error: NextResponse.json(
          {
            error: "Subscription required",
            message:
              "This feature requires an active subscription. Please upgrade your plan.",
            upgradeUrl: "/app/pricing",
          },
          { status: 403 }
        ),
        user: session.user,
        subscription: null,
      };
    }

    const tier = await getUserSubscriptionTier(session.user.id);

    if (minTier) {
      const tierOrder = ["free", "basic", "pro", "enterprise"];
      const userTierIndex = tierOrder.indexOf(tier);
      const minTierIndex = tierOrder.indexOf(minTier);

      if (userTierIndex < minTierIndex) {
        return {
          error: NextResponse.json(
            {
              error: "Insufficient subscription tier",
              message: `This feature requires ${minTier} subscription or higher.`,
              currentTier: tier,
              requiredTier: minTier,
              upgradeUrl: "/app/pricing",
            },
            { status: 403 }
          ),
          user: session.user,
          subscription: { tier, isActive },
        };
      }
    }

    return {
      error: null,
      user: session.user,
      subscription: { tier, isActive },
    };
  } catch (error) {
    console.error("Error checking subscription in API route:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const errorDetails =
      process.env.NODE_ENV === "development" ? errorMessage : undefined;

    if (process.env.NODE_ENV === "development") {
      console.warn(
        `⚠️ Database error in protectSubscriptionRoute - allowing access in development mode: ${errorMessage}`
      );
      return {
        error: null,
        user: session.user,
        subscription: { tier: "free" as const, isActive: true },
      };
    }

    return {
      error: NextResponse.json(
        {
          error: "Service unavailable",
          message:
            "Unable to verify subscription status. Please try again later.",
          ...(errorDetails && { details: errorDetails }),
        },
        { status: 503 }
      ),
      user: session.user,
      subscription: null,
    };
  }
}
