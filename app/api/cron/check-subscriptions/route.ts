import { NextRequest, NextResponse } from "next/server";
import { markExpiredSubscriptionsAsCanceled } from "@/lib/database/subscription";

/**
 * Cron job to check and handle expired subscriptions
 * This should be called periodically (e.g., daily via Vercel Cron or similar)
 * 
 * Example cron setup in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/check-subscriptions",
 *     "schedule": "0 0 * * *"
 *   }]
 * }
 */
export async function GET(req: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("Starting subscription expiration check...");
    
    const result = await markExpiredSubscriptionsAsCanceled();

    console.log(
      `Subscription expiration check completed: ${result.successful} successful, ${result.failed} failed out of ${result.total} expired subscriptions`
    );

    return NextResponse.json({
      success: true,
      message: "Subscription expiration check completed",
      stats: {
        total: result.total,
        successful: result.successful,
        failed: result.failed,
      },
      expiredSubscriptions: result.expiredSubscriptions.map((sub) => ({
        id: sub.id,
        userId: sub.userId,
        clerkUserId: sub.clerkUserId,
        status: sub.status,
        planType: sub.planType,
        currentPeriodEnd: sub.currentPeriodEnd,
      })),
    });
  } catch (error) {
    console.error("Error checking expired subscriptions:", error);
    return NextResponse.json(
      { 
        error: "Failed to check expired subscriptions",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

/**
 * Also allow POST for manual triggering (protected by secret)
 */
export async function POST(req: NextRequest) {
  return GET(req);
}

