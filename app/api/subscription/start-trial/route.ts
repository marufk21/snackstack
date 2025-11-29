import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/config/auth";
import {
  startFreeTrial,
  isUserOnFreeTrial,
  hasActiveSubscription,
} from "@/lib/database/subscription";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if user already has a subscription or is on trial
    const [hasSubscription, onTrial] = await Promise.all([
      hasActiveSubscription(user.id),
      isUserOnFreeTrial(user.id),
    ]);

    if (hasSubscription) {
      return NextResponse.json(
        { error: "User already has an active subscription" },
        { status: 400 }
      );
    }

    if (onTrial) {
      return NextResponse.json(
        { error: "User is already on a free trial" },
        { status: 400 }
      );
    }

    // Start free trial
    const updatedUser = await startFreeTrial(user.id);

    return NextResponse.json({
      success: true,
      message: "Free trial started successfully",
      freeTrialEndsAt: updatedUser.freeTrialEndsAt?.toISOString(),
    });
  } catch (error) {
    console.error("Error starting free trial:", error);
    return NextResponse.json(
      {
        error: "Failed to start free trial",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
