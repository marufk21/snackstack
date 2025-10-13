import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/config/stripe";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;

        // TODO: Save subscription data to your database
        // You might want to:
        // 1. Store the subscription in your database
        // 2. Update user's subscription status
        // 3. Send confirmation email
        // 4. Grant access to premium features

        if (session.mode === "subscription") {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );

          // Here you would typically save this to your database
          // Example:
          // await createOrUpdateSubscription({
          //   userId: session.metadata?.userId,
          //   subscriptionId: subscription.id,
          //   customerId: subscription.customer as string,
          //   status: subscription.status,
          //   priceId: subscription.items.data[0]?.price.id,
          //   currentPeriodStart: new Date(subscription.current_period_start * 1000),
          //   currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          // });
        }
        break;

      case "customer.subscription.updated":
        const updatedSubscription = event.data.object as Stripe.Subscription;

        // TODO: Update subscription in your database
        // Handle plan changes, status updates, etc.
        break;

      case "customer.subscription.deleted":
        const deletedSubscription = event.data.object as Stripe.Subscription;

        // TODO: Handle subscription cancellation
        // Update user's access, send cancellation email, etc.
        break;

      case "invoice.payment_succeeded":
        const invoice = event.data.object as Stripe.Invoice;

        // TODO: Handle successful payment
        // Extend subscription, send receipt, etc.
        break;

      case "invoice.payment_failed":
        const failedInvoice = event.data.object as Stripe.Invoice;

        // TODO: Handle failed payment
        // Send dunning emails, update subscription status, etc.
        break;

      default:
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
