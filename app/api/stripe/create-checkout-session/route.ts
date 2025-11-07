import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { stripe } from "@/config/stripe";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user?.id || !user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { priceId } = await req.json();

    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID is required" },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      customer_email: user.email,
      client_reference_id: user.id,
      metadata: {
        userId: user.id,
        userEmail: user.email,
      },
      success_url: `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/app/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/app/pricing`,
      allow_promotion_codes: true,
      billing_address_collection: "required",
      subscription_data: {
        metadata: {
          userId: user.id,
        },
      },
    });

    return NextResponse.json({ sessionId: checkoutSession.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : "No stack trace",
    });
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
