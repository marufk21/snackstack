/**
 * Script to add the missing emailVerified column to the User table
 * Run this with: npx ts-node scripts/add-email-verified-column.ts
 */

import { db } from "../lib/database/client";

async function addEmailVerifiedColumn() {
  try {
    console.log("Adding emailVerified column to User table...");
    
    // Use raw SQL to add the column if it doesn't exist
    // Note: PostgreSQL requires the table name to match exactly (case-sensitive)
    await db.$executeRawUnsafe(`
      ALTER TABLE "public"."User" 
      ADD COLUMN IF NOT EXISTS "emailVerified" TIMESTAMP(3);
    `);
    
    console.log("✅ Successfully added emailVerified column!");
    
    // Verify the column was added
    const result = await db.$queryRawUnsafe(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'User' AND column_name = 'emailVerified';
    `);
    
    console.log("Verification:", result);
    
  } catch (error) {
    console.error("❌ Error adding column:", error);
    throw error;
  } finally {
    await db.$disconnect();
  }
}

addEmailVerifiedColumn()
  .then(() => {
    console.log("✅ Migration script completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Migration script failed:", error);
    process.exit(1);
  });

