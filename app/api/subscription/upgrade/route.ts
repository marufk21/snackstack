import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/auth/config";
import { stripe } from "@/server/integrations/stripe/config";
import { db as prisma } from "@/server/db/client";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { priceId, planType } = body;

    if (!priceId || !planType) {
      return NextResponse.json({ error: "Missing priceId or planType" }, { status: 400 });
    }

    // Resolve the database user ID from email. The JWT callback may store
    // the email as token.sub for Edge compatibility on older sessions.
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { subscription: true },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = dbUser.id;

    let customerId = dbUser.subscription?.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        name: session.user.name || undefined,
        metadata: { userId },
      });
      customerId = customer.id;
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${request.nextUrl.origin}/app/subscription?success=true`,
      cancel_url: `${request.nextUrl.origin}/app/subscription?canceled=true`,
      metadata: { userId, userEmail: session.user.email, planType },
    });

    return NextResponse.json({ url: checkoutSession.url, sessionId: checkoutSession.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
