import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // TODO: Implement webhook handling logic
    const body = await request.json();

    return NextResponse.json({
      message: "Webhook received",
      received: body,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
