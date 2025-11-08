import { NextResponse } from "next/server";
import { db } from "@/lib/database/client";

// Explicitly use Node.js runtime for database operations
export const runtime = "nodejs";

export async function POST() {
  try {
    console.log("🔄 Resetting database...");

    // Drop all tables (in correct order to handle foreign keys)
    const tables = ['Subscription', 'Note', 'Account', 'Session', 'VerificationToken', 'User'];
    
    for (const table of tables) {
      try {
        await db.$executeRawUnsafe(`DROP TABLE IF EXISTS "public"."${table}" CASCADE;`);
        console.log(`✅ Dropped table: ${table}`);
      } catch (error: any) {
        console.log(`⚠️  Could not drop ${table}:`, error.message);
      }
    }

    // Recreate tables using Prisma migrations
    // First, let's create the User table with all required columns
    await db.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "public"."User" (
        "id" TEXT NOT NULL,
        "name" TEXT,
        "email" TEXT NOT NULL,
        "emailVerified" TIMESTAMP(3),
        "image" TEXT,
        "isSubscribed" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "User_pkey" PRIMARY KEY ("id")
      );
    `);

    await db.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "public"."User"("email");`);
    await db.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "User_email_idx" ON "public"."User"("email");`);
    await db.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "User_isSubscribed_idx" ON "public"."User"("isSubscribed");`);
    await db.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "User_lastActiveAt_idx" ON "public"."User"("lastActiveAt");`);

    // Create Account table
    await db.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "public"."Account" (
        "userId" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "provider" TEXT NOT NULL,
        "providerAccountId" TEXT NOT NULL,
        "refresh_token" TEXT,
        "access_token" TEXT,
        "expires_at" INTEGER,
        "token_type" TEXT,
        "scope" TEXT,
        "id_token" TEXT,
        "session_state" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Account_pkey" PRIMARY KEY ("provider", "providerAccountId")
      );
    `);

    await db.$executeRawUnsafe(`
      ALTER TABLE "public"."Account" 
      ADD CONSTRAINT "Account_userId_fkey" 
      FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `);

    // Create Session table
    await db.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "public"."Session" (
        "sessionToken" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "expires" TIMESTAMP(3) NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Session_pkey" PRIMARY KEY ("sessionToken")
      );
    `);

    await db.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "Session_sessionToken_key" ON "public"."Session"("sessionToken");`);
    
    await db.$executeRawUnsafe(`
      ALTER TABLE "public"."Session" 
      ADD CONSTRAINT "Session_userId_fkey" 
      FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `);

    // Create VerificationToken table
    await db.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "public"."VerificationToken" (
        "identifier" TEXT NOT NULL,
        "token" TEXT NOT NULL,
        "expires" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("identifier", "token")
      );
    `);

    // Create Note table
    await db.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "public"."Note" (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "slug" TEXT NOT NULL,
        "imageUrl" TEXT,
        "userId" TEXT NOT NULL,
        "isPublic" BOOLEAN NOT NULL DEFAULT false,
        "views" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
      );
    `);

    await db.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "Note_slug_key" ON "public"."Note"("slug");`);
    await db.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Note_userId_idx" ON "public"."Note"("userId");`);
    await db.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Note_slug_idx" ON "public"."Note"("slug");`);
    await db.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Note_userId_createdAt_idx" ON "public"."Note"("userId", "createdAt" DESC);`);
    await db.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Note_isPublic_idx" ON "public"."Note"("isPublic");`);
    await db.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Note_createdAt_idx" ON "public"."Note"("createdAt" DESC);`);

    await db.$executeRawUnsafe(`
      ALTER TABLE "public"."Note" 
      ADD CONSTRAINT "Note_userId_fkey" 
      FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `);

    // Create Subscription table
    await db.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "public"."Subscription" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "stripeCustomerId" TEXT NOT NULL,
        "stripeSubscriptionId" TEXT NOT NULL,
        "stripePriceId" TEXT NOT NULL,
        "stripeProductId" TEXT,
        "status" TEXT NOT NULL,
        "planType" TEXT NOT NULL,
        "currentPeriodStart" TIMESTAMP(3) NOT NULL,
        "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
        "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
        "canceledAt" TIMESTAMP(3),
        "trialStart" TIMESTAMP(3),
        "trialEnd" TIMESTAMP(3),
        "notesCreatedThisMonth" INTEGER NOT NULL DEFAULT 0,
        "lastResetDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
      );
    `);

    await db.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "Subscription_userId_key" ON "public"."Subscription"("userId");`);
    await db.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "Subscription_stripeCustomerId_key" ON "public"."Subscription"("stripeCustomerId");`);
    await db.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "Subscription_stripeSubscriptionId_key" ON "public"."Subscription"("stripeSubscriptionId");`);
    await db.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Subscription_stripeCustomerId_idx" ON "public"."Subscription"("stripeCustomerId");`);
    await db.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Subscription_stripeSubscriptionId_idx" ON "public"."Subscription"("stripeSubscriptionId");`);
    await db.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Subscription_status_idx" ON "public"."Subscription"("status");`);
    await db.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Subscription_userId_status_idx" ON "public"."Subscription"("userId", "status");`);
    await db.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Subscription_currentPeriodEnd_idx" ON "public"."Subscription"("currentPeriodEnd");`);
    await db.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "Subscription_status_currentPeriodEnd_idx" ON "public"."Subscription"("status", "currentPeriodEnd");`);

    await db.$executeRawUnsafe(`
      ALTER TABLE "public"."Subscription" 
      ADD CONSTRAINT "Subscription_userId_fkey" 
      FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `);

    console.log("✅ Database reset and recreated successfully!");

    return NextResponse.json({
      success: true,
      message: "Database reset and recreated successfully!",
      tables: ['User', 'Account', 'Session', 'VerificationToken', 'Note', 'Subscription'],
    });
  } catch (error: any) {
    console.error("Error resetting database:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to reset database",
        message: error?.message,
        code: error?.code,
      },
      { status: 500 }
    );
  } finally {
    await db.$disconnect();
  }
}

