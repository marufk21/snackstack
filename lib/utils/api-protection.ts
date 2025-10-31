import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  hasActiveSubscription,
  getUserSubscriptionTier,
  PlanType,
} from "@/lib/database/subscription";

/**
 * Protect API route - requires authentication
 */
export async function protectApiRoute() {
  const user = await currentUser();

  if (!user) {
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
    user,
  };
}

/**
 * Protect API route with subscription requirement
 */
export async function protectSubscriptionRoute(minTier?: PlanType) {
  const user = await currentUser();

  if (!user) {
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
    const isActive = await hasActiveSubscription(user.id);

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
        user,
        subscription: null,
      };
    }

    if (minTier) {
      const tier = await getUserSubscriptionTier(user.id);
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
          user,
          subscription: { tier, isActive },
        };
      }
    }

    const tier = await getUserSubscriptionTier(user.id);

    return {
      error: null,
      user,
      subscription: { tier, isActive },
    };
  } catch (error) {
    console.error("Error checking subscription in API route:", error);

    // In development, allow access if there's a database error
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "⚠️ Database error in protectSubscriptionRoute - allowing access in development mode"
      );
      return {
        error: null,
        user,
        subscription: { tier: "free" as const, isActive: true },
      };
    }

    // In production, return error
    return {
      error: NextResponse.json(
        {
          error: "Service unavailable",
          message:
            "Unable to verify subscription status. Please try again later.",
        },
        { status: 503 }
      ),
      user,
      subscription: null,
    };
  }
}

/**
 * Usage example:
 *
 * export async function POST(req: NextRequest) {
 *   const { error, user, subscription } = await protectSubscriptionRoute("pro");
 *   if (error) return error;
 *
 *   // Your protected route logic here
 * }
 */
