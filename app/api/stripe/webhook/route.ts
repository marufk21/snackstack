import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/config/stripe";
import Stripe from "stripe";
import {
  upsertSubscriptionFromStripe,
  deleteSubscriptionByStripeId,
  updateSubscriptionByStripeId,
  getSubscriptionByStripeId,
} from "@/lib/database/subscription";
import { getOrCreateUserByEmail } from "@/lib/database/user";

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
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("Checkout session completed:", session.id);

        if (session.mode === "subscription") {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );

          const clerkUserId = session.metadata?.userId;
          const userEmail =
            session.metadata?.userEmail || session.customer_email;

          if (!clerkUserId || !userEmail) {
            console.error("Missing user information in session metadata");
            break;
          }

          // Get or create user in database
          const user = await getOrCreateUserByEmail(
            userEmail,
            session.customer_details?.name || "User"
          );

          // Create or update subscription
          await upsertSubscriptionFromStripe(
            subscription,
            user.id,
            clerkUserId
          );

          console.log(
            `Subscription created/updated for user ${user.email}: ${subscription.id}`
          );
        }
        break;
      }

      case "customer.subscription.updated": {
        const updatedSubscription = event.data.object as Stripe.Subscription;
        console.log("Subscription updated:", updatedSubscription.id);

        const existingSubscription = await getSubscriptionByStripeId(
          updatedSubscription.id
        );

        if (existingSubscription) {
          await upsertSubscriptionFromStripe(
            updatedSubscription,
            existingSubscription.userId,
            existingSubscription.clerkUserId
          );
          console.log(
            `Subscription ${updatedSubscription.id} updated in database`
          );
        } else {
          console.warn(
            `Subscription ${updatedSubscription.id} not found in database for update`
          );
        }
        break;
      }

      case "customer.subscription.deleted": {
        const deletedSubscription = event.data.object as Stripe.Subscription;
        console.log("Subscription deleted:", deletedSubscription.id);

        const existingSubscription = await getSubscriptionByStripeId(
          deletedSubscription.id
        );

        if (existingSubscription) {
          // Mark as canceled instead of deleting
          await updateSubscriptionByStripeId(deletedSubscription.id, {
            status: "canceled",
            canceledAt: new Date(),
          });
          console.log(
            `Subscription ${deletedSubscription.id} marked as canceled in database`
          );
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log("Payment succeeded for invoice:", invoice.id);

        // Invoice.subscription can be a string (ID) or a Subscription object
        const subscriptionId =
          typeof (invoice as any).subscription === "string"
            ? (invoice as any).subscription
            : (invoice as any).subscription?.id;

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(
            subscriptionId
          );

          const existingSubscription = await getSubscriptionByStripeId(
            subscription.id
          );

          if (existingSubscription) {
            // Update subscription period and status
            await upsertSubscriptionFromStripe(
              subscription,
              existingSubscription.userId,
              existingSubscription.clerkUserId
            );
            console.log(
              `Subscription ${subscription.id} renewed after successful payment`
            );
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const failedInvoice = event.data.object as Stripe.Invoice;
        console.log("Payment failed for invoice:", failedInvoice.id);

        // Invoice.subscription can be a string (ID) or a Subscription object
        const subscriptionId =
          typeof (failedInvoice as any).subscription === "string"
            ? (failedInvoice as any).subscription
            : (failedInvoice as any).subscription?.id;

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(
            subscriptionId
          );

          const existingSubscription = await getSubscriptionByStripeId(
            subscription.id
          );

          if (existingSubscription) {
            // Update subscription status to reflect payment failure
            await updateSubscriptionByStripeId(subscription.id, {
              status: subscription.status as any,
            });
            console.log(
              `Subscription ${subscription.id} status updated after payment failure`
            );
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
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
