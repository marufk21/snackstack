import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/config/auth";
import { stripe } from "@/config/stripe";
import { db as prisma } from "@/lib/database/client";

export async function POST(req: NextRequest) {
  console.log("🔄 Direct SQL Sync API called");
  
  try {
    // 1. Check authentication
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { 
          error: "Unauthorized",
          details: "Please log in to sync your subscription"
        }, 
        { status: 401 }
      );
    }

    const userEmail = session.user.email;
    console.log(`✅ User authenticated: ${userEmail}`);

    // 2. Get user ID using raw SQL to avoid noteCount issue
    const userResult = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT id FROM "User" WHERE email = ${userEmail} LIMIT 1
    `;

    if (!userResult || userResult.length === 0) {
      return NextResponse.json(
        { 
          error: "User not found",
          details: "Your account was not found in the database"
        },
        { status: 404 }
      );
    }

    const userId = userResult[0].id;
    console.log(`✅ User ID: ${userId}`);

    // 3. Find Stripe customer
    const customers = await stripe.customers.list({
      email: userEmail,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return NextResponse.json(
        { 
          error: "No Stripe customer found",
          details: "You don't have a Stripe account yet."
        },
        { status: 404 }
      );
    }

    const customer = customers.data[0];
    console.log(`✅ Found Stripe customer: ${customer.id}`);

    // 4. Find subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: "all",
      limit: 10,
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json(
        { 
          error: "No subscriptions found",
          details: "You don't have any subscriptions yet."
        },
        { status: 404 }
      );
    }

    // 5. Get active subscription
    const activeSubId = subscriptions.data.find(
      sub => sub.status === "active" || sub.status === "trialing"
    )?.id || subscriptions.data[0].id;

    const activeSubscription = await stripe.subscriptions.retrieve(activeSubId);
    console.log(`📊 Subscription: ${activeSubscription.id} - ${activeSubscription.status}`);

    // 6. Extract data
    const sub = activeSubscription as any;
    const firstItem = sub.items?.data?.[0];
    
    if (!firstItem) {
      throw new Error("No subscription items found");
    }

    const priceId = firstItem.price.id;
    const productId = firstItem.price.product;
    
    let planType = "basic";
    if (priceId === process.env.STRIPE_PRICE_ID_PRO) {
      planType = "pro";
    } else if (priceId === process.env.STRIPE_PRICE_ID_ENTERPRISE) {
      planType = "enterprise";
    }

    const periodStart = firstItem.current_period_start;
    const periodEnd = firstItem.current_period_end;
    
    if (!periodStart || !periodEnd) {
      throw new Error("Missing period timestamps");
    }

    const currentPeriodStart = new Date(periodStart * 1000);
    const currentPeriodEnd = new Date(periodEnd * 1000);
    const cancelAtPeriodEnd = sub.cancel_at_period_end ?? false;
    const canceledAt = sub.canceled_at ? new Date(sub.canceled_at * 1000) : null;
    const trialStart = sub.trial_start ? new Date(sub.trial_start * 1000) : null;
    const trialEnd = sub.trial_end ? new Date(sub.trial_end * 1000) : null;

    console.log(`✅ Plan: ${planType}, Status: ${activeSubscription.status}`);
    console.log(`✅ Period: ${currentPeriodStart.toISOString()} to ${currentPeriodEnd.toISOString()}`);

    // 7. Update or create subscription using raw SQL
    const existingCheck = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT id FROM "Subscription" WHERE "userId" = ${userId} LIMIT 1
    `;

    if (existingCheck && existingCheck.length > 0) {
      // Update existing
      console.log(`   Updating existing subscription...`);
      await prisma.$executeRaw`
        UPDATE "Subscription"
        SET 
          "stripeCustomerId" = ${customer.id},
          "stripeSubscriptionId" = ${activeSubscription.id},
          "stripePriceId" = ${priceId},
          "stripeProductId" = ${productId},
          "status" = ${activeSubscription.status},
          "planType" = ${planType},
          "currentPeriodStart" = ${currentPeriodStart},
          "currentPeriodEnd" = ${currentPeriodEnd},
          "cancelAtPeriodEnd" = ${cancelAtPeriodEnd},
          "canceledAt" = ${canceledAt},
          "trialStart" = ${trialStart},
          "trialEnd" = ${trialEnd},
          "updatedAt" = NOW()
        WHERE "userId" = ${userId}
      `;
      console.log(`   ✅ Subscription updated`);
    } else {
      // Create new
      console.log(`   Creating new subscription...`);
      await prisma.$executeRaw`
        INSERT INTO "Subscription" (
          id, "userId", "stripeCustomerId", "stripeSubscriptionId",
          "stripePriceId", "stripeProductId", status, "planType",
          "currentPeriodStart", "currentPeriodEnd", "cancelAtPeriodEnd",
          "canceledAt", "trialStart", "trialEnd",
          "notesCreatedThisMonth", "lastResetDate", "createdAt", "updatedAt"
        ) VALUES (
          gen_random_uuid(), ${userId}, ${customer.id}, ${activeSubscription.id},
          ${priceId}, ${productId}, ${activeSubscription.status}, ${planType},
          ${currentPeriodStart}, ${currentPeriodEnd}, ${cancelAtPeriodEnd},
          ${canceledAt}, ${trialStart}, ${trialEnd},
          0, NOW(), NOW(), NOW()
        )
      `;
      console.log(`   ✅ Subscription created`);
    }

    // 8. Update user's isSubscribed flag using raw SQL
    const isActive = 
      activeSubscription.status === "active" || 
      activeSubscription.status === "trialing";

    await prisma.$executeRaw`
      UPDATE "User"
      SET "isSubscribed" = ${isActive}
      WHERE id = ${userId}
    `;

    console.log(`✅ User status updated: ${isActive ? "subscribed" : "not subscribed"}`);

    return NextResponse.json({
      success: true,
      message: "Subscription synced successfully",
      active: isActive,
      subscription: {
        id: activeSubscription.id,
        status: activeSubscription.status,
        planType,
      },
    });
  } catch (error) {
    console.error("\n❌ Error syncing subscription:", error);
    
    return NextResponse.json(
      {
        error: "Failed to sync subscription",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
