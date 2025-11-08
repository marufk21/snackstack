-- Add emailVerified column to User table
-- Run this SQL directly in your database or via psql

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "emailVerified" TIMESTAMP(3);

