import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { stripe } from "@/config/stripe";

export async function POST(req: NextRequest) {
  try {
    console.log("=== Stripe Checkout API Called ===");

    const user = await currentUser();
    console.log("User found:", !!user, user?.id);

    if (!user) {
      console.log("No user found, returning 401");
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { priceId } = await req.json();
    console.log("Received priceId:", priceId);
    console.log("Environment price IDs:");
    console.log("- BASIC:", process.env.STRIPE_PRICE_ID_BASIC);
    console.log("- PRO:", process.env.STRIPE_PRICE_ID_PRO);
    console.log("- ENTERPRISE:", process.env.STRIPE_PRICE_ID_ENTERPRISE);

    if (!priceId) {
      console.log("No priceId provided, returning 400");
      return NextResponse.json(
        { error: "Price ID is required" },
        { status: 400 }
      );
    }

    console.log("Creating Stripe checkout session...");
    console.log(
      "Environment check - STRIPE_SECRET_KEY exists:",
      !!process.env.STRIPE_SECRET_KEY
    );

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      customer_email: user.emailAddresses[0]?.emailAddress,
      client_reference_id: user.id,
      metadata: {
        userId: user.id,
        userEmail: user.emailAddresses[0]?.emailAddress || "",
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

    console.log("Stripe session created successfully:", session.id);
    return NextResponse.json({ sessionId: session.id });
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
