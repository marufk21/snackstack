import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/auth/config";

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

    return NextResponse.json({
      success: true,
      message: "Free plan is active. No trial needed — enjoy unlimited access.",
    });
  } catch (error) {
    console.error("Error starting free plan:", error);
    return NextResponse.json(
      {
        error: "Failed to activate free plan",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
