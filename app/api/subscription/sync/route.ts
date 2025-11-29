import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/config/auth";
import { stripe } from "@/config/stripe";
import { db as prisma } from "@/lib/database/client";
import { upsertSubscriptionFromStripe } from "@/lib/database/subscription";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;
    console.log(`🔄 Syncing subscription for ${userEmail}...`);

    // 1. Find Stripe customer by email
    const customers = await stripe.customers.list({
      email: userEmail,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return NextResponse.json({ message: "No Stripe customer found" });
    }

    const customer = customers.data[0];
    console.log(`✅ Found Stripe customer: ${customer.id}`);

    // 2. Find active subscriptions for this customer
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: "all", // Fetch all to handle canceled/past_due too
      expand: ["data.default_payment_method"],
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json({ message: "No subscriptions found" });
    }

    // 3. Sync each subscription to database
    let activeSubscriptionFound = false;

    for (const subscription of subscriptions.data) {
      console.log(`Processing subscription: ${subscription.id} (${subscription.status})`);
      
      await upsertSubscriptionFromStripe(subscription, session.user.id!);

      if (subscription.status === "active" || subscription.status === "trialing") {
        activeSubscriptionFound = true;
      }
    }

    // 4. Update user status
    await prisma.user.update({
      where: { email: userEmail },
      data: {
        isSubscribed: activeSubscriptionFound,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Subscription synced successfully",
      active: activeSubscriptionFound,
    });
  } catch (error) {
    console.error("Error syncing subscription:", error);
    return NextResponse.json(
      { 
        error: "Failed to sync subscription", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}
