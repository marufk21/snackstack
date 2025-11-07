import { NextRequest, NextResponse } from "next/server";
import { markExpiredSubscriptionsAsCanceled } from "@/lib/database/subscription";

// Force dynamic rendering to prevent caching issues with cron jobs
export const dynamic = "force-dynamic";

/**
 * Cron job to check and handle expired subscriptions
 * Runs once per day via Vercel Cron (Hobby plan limitation: max once per day)
 *
 * Cron setup in vercel.json:
 * - path: /api/cron/check-subscriptions
 * - schedule: 0 1 * * * (every day at 1 AM)
 *
 * Note: Vercel sends POST requests to cron endpoints with an authorization header
 * matching CRON_SECRET environment variable (if set).
 *
 * Note: On Hobby plan, cron jobs can only run once per day. For more frequent
 * executions, upgrade to Pro plan which allows unlimited cron invocations.
 */
async function handleCronRequest(req: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    // Vercel automatically sends authorization header matching CRON_SECRET
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // If CRON_SECRET is set, verify the authorization header
    if (cronSecret) {
      const expectedAuth = `Bearer ${cronSecret}`;
      if (authHeader !== expectedAuth) {
        console.error(
          "Unauthorized cron request - invalid authorization header"
        );
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
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
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * Vercel sends POST requests to cron endpoints
 */
export async function POST(req: NextRequest) {
  return handleCronRequest(req);
}

/**
 * Also allow GET for manual testing (protected by secret)
 */
export async function GET(req: NextRequest) {
  return handleCronRequest(req);
}





