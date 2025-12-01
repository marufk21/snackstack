import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/config/auth";
import { stripe } from "@/config/stripe";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;

    // Find Stripe customer
    const customers = await stripe.customers.list({
      email: userEmail,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return NextResponse.json(
        { error: "No Stripe customer found" },
        { status: 404 }
      );
    }

    const customer = customers.data[0];

    // Find subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: "all",
      limit: 10,
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json(
        { error: "No subscriptions found" },
        { status: 404 }
      );
    }

    // Get first subscription
    const sub = subscriptions.data[0];

    // Retrieve full details
    const fullSub = await stripe.subscriptions.retrieve(sub.id);

    return NextResponse.json({
      listSubscription: {
        id: sub.id,
        status: sub.status,
        billing_cycle_anchor: (sub as any).billing_cycle_anchor,
        start_date: (sub as any).start_date,
        created: (sub as any).created,
        plan: (sub as any).plan,
        items: (sub as any).items,
        current_period_start: (sub as any).current_period_start,
        current_period_end: (sub as any).current_period_end,
        allKeys: Object.keys(sub),
      },
      retrievedSubscription: {
        id: fullSub.id,
        status: fullSub.status,
        billing_cycle_anchor: (fullSub as any).billing_cycle_anchor,
        start_date: (fullSub as any).start_date,
        created: (fullSub as any).created,
        plan: (fullSub as any).plan,
        items: (fullSub as any).items,
        current_period_start: (fullSub as any).current_period_start,
        current_period_end: (fullSub as any).current_period_end,
        allKeys: Object.keys(fullSub),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Debug failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
