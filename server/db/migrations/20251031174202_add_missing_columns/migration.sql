-- AlterTable
-- Add missing columns to User table
ALTER TABLE "public"."User" ADD COLUMN IF NOT EXISTS "clerkUserId" TEXT;
ALTER TABLE "public"."User" ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;
ALTER TABLE "public"."User" ADD COLUMN IF NOT EXISTS "isSubscribed" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "public"."User" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "public"."User" ADD COLUMN IF NOT EXISTS "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
-- Add missing columns to Note table
ALTER TABLE "public"."Note" ADD COLUMN IF NOT EXISTS "isPublic" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "public"."Note" ADD COLUMN IF NOT EXISTS "views" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "User_clerkUserId_key" ON "public"."User"("clerkUserId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "User_clerkUserId_idx" ON "public"."User"("clerkUserId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "User_isSubscribed_idx" ON "public"."User"("isSubscribed");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "User_lastActiveAt_idx" ON "public"."User"("lastActiveAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Note_userId_createdAt_idx" ON "public"."Note"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Note_isPublic_idx" ON "public"."Note"("isPublic");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Note_createdAt_idx" ON "public"."Note"("createdAt" DESC);

