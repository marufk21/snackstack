import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/server/integrations/stripe/config";
import Stripe from "stripe";
import {
  upsertSubscriptionFromStripe,
  updateSubscriptionByStripeId,
  getSubscriptionByStripeId,
} from "@/server/services/subscription";
import { getOrCreateUserByEmail } from "@/server/services/user";
import { db as prisma } from "@/server/db/client";

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
    console.error("❌ Webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log(`📥 Received webhook event: ${event.type}`);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("✅ Checkout session completed:", session.id);

        if (session.mode === "subscription") {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );

          console.log("📊 Subscription details from Stripe:");
          console.log("   ID:", subscription.id);
          console.log("   Status:", subscription.status);
          console.log("   Customer:", subscription.customer);

          const userId = session.metadata?.userId;
          const userEmail =
            session.metadata?.userEmail || session.customer_email;

          if (!userId || !userEmail) {
            console.error("❌ Missing user information in session metadata");
            break;
          }

          // Get or create user in database
          const user = await getOrCreateUserByEmail(
            userEmail,
            session.customer_details?.name || "User"
          );

          // Create or update subscription
          console.log(
            `💾 Upserting subscription with status: ${subscription.status}`
          );
          const savedSubscription = await upsertSubscriptionFromStripe(
            subscription,
            user.id
          );
          console.log(
            `💾 Saved subscription status in DB: ${savedSubscription.status}`
          );

          // Update user's isSubscribed flag
          await prisma.user.update({
            where: { id: user.id },
            data: {
              isSubscribed: true,
            },
          });

          console.log(
            `✅ Subscription created/updated for user ${user.email}: ${subscription.id}`
          );
          console.log(`✅ User ${user.email} marked as subscribed`);
          console.log(`✅ Free trial ended for user ${user.email}`);
        }
        break;
      }

      case "customer.subscription.updated": {
        const updatedSubscription = event.data.object as Stripe.Subscription;
        console.log("🔄 Subscription updated:", updatedSubscription.id);
        console.log("   Status from Stripe:", updatedSubscription.status);

        const existingSubscription = await getSubscriptionByStripeId(
          updatedSubscription.id
        );

        if (existingSubscription) {
          console.log("   Current status in DB:", existingSubscription.status);
          console.log(`💾 Updating subscription with new status: ${updatedSubscription.status}`);
          
          const updated = await upsertSubscriptionFromStripe(
            updatedSubscription,
            existingSubscription.userId
          );
          
          console.log(`💾 Updated subscription status in DB: ${updated.status}`);

          // Update user's isSubscribed flag based on status
          const isActive =
            updatedSubscription.status === "active" ||
            updatedSubscription.status === "trialing";

          await prisma.user.update({
            where: { id: existingSubscription.userId },
            data: { isSubscribed: isActive },
          });

          console.log(
            `✅ Subscription ${updatedSubscription.id} updated in database`
          );
          console.log(
            `✅ User subscription status updated: ${
              isActive ? "active" : "inactive"
            }`
          );
        } else {
          console.warn(
            `⚠️ Subscription ${updatedSubscription.id} not found in database for update`
          );
        }
        break;
      }

      case "customer.subscription.deleted": {
        const deletedSubscription = event.data.object as Stripe.Subscription;
        console.log("🗑️ Subscription deleted:", deletedSubscription.id);

        const existingSubscription = await getSubscriptionByStripeId(
          deletedSubscription.id
        );

        if (existingSubscription) {
          // Mark as canceled instead of deleting
          await updateSubscriptionByStripeId(deletedSubscription.id, {
            status: "canceled",
            canceledAt: new Date(),
          });

          // Update user's isSubscribed flag
          await prisma.user.update({
            where: { id: existingSubscription.userId },
            data: { isSubscribed: false },
          });

          console.log(
            `✅ Subscription ${deletedSubscription.id} marked as canceled in database`
          );
          console.log(`✅ User marked as unsubscribed`);
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log("💰 Payment succeeded for invoice:", invoice.id);

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
              existingSubscription.userId
            );

            // Ensure user is marked as subscribed
            await prisma.user.update({
              where: { id: existingSubscription.userId },
              data: { isSubscribed: true },
            });

            console.log(
              `✅ Subscription ${subscription.id} renewed after successful payment`
            );
            console.log(`✅ User marked as subscribed`);
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const failedInvoice = event.data.object as Stripe.Invoice;
        console.log("❌ Payment failed for invoice:", failedInvoice.id);

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

            // Update user's isSubscribed flag based on status
            const isActive =
              subscription.status === "active" ||
              subscription.status === "trialing";

            await prisma.user.update({
              where: { id: existingSubscription.userId },
              data: { isSubscribed: isActive },
            });

            console.log(
              `✅ Subscription ${subscription.id} status updated after payment failure: ${subscription.status}`
            );
            console.log(
              `✅ User subscription status updated: ${
                isActive ? "active" : "inactive"
              }`
            );
          }
        }
        break;
      }

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ Webhook handler error:", error);
    console.error("   Event type:", event.type);
    console.error(
      "   Error details:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
