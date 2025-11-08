-- AlterTable
-- Add emailVerified column to User table
ALTER TABLE "public"."User" ADD COLUMN IF NOT EXISTS "emailVerified" TIMESTAMP(3);

