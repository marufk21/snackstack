/**
 * Quick fix script for database schema issues
 * Adds missing columns that Prisma expects
 */

import { config } from "dotenv";
import { PrismaClient } from "../server/lib/generated/prisma/index.js";

// Load environment variables
config();

const db = new PrismaClient();

async function quickFix() {
  try {
    console.log("🔧 Quick fixing database schema...\n");

    // Add emailVerified column (most critical)
    console.log("1. Adding emailVerified column...");
    try {
      await db.$executeRawUnsafe(`
        ALTER TABLE "public"."User" 
        ADD COLUMN IF NOT EXISTS "emailVerified" TIMESTAMP(3);
      `);
      console.log("   ✅ emailVerified column added\n");
    } catch (error: any) {
      if (error.code === '42701') {
        console.log("   ✓ emailVerified column already exists\n");
      } else {
        console.error("   ❌ Error:", error.message);
        throw error;
      }
    }

    // Handle image/imageUrl column
    console.log("2. Checking image column...");
    const imageCheck = await db.$queryRawUnsafe(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = 'User' 
        AND column_name IN ('image', 'imageUrl');
    `) as Array<{ column_name: string }>;

    const hasImage = imageCheck.some(c => c.column_name === 'image');
    const hasImageUrl = imageCheck.some(c => c.column_name === 'imageUrl');

    if (hasImageUrl && !hasImage) {
      console.log("   📝 Renaming imageUrl to image...");
      try {
        await db.$executeRawUnsafe(`ALTER TABLE "public"."User" RENAME COLUMN "imageUrl" TO "image";`);
        console.log("   ✅ Renamed imageUrl to image\n");
      } catch (error: any) {
        console.log("   ⚠️  Could not rename (may need manual fix)\n");
      }
    } else if (!hasImage) {
      console.log("   📝 Adding image column...");
      await db.$executeRawUnsafe(`ALTER TABLE "public"."User" ADD COLUMN IF NOT EXISTS "image" TEXT;`);
      console.log("   ✅ Added image column\n");
    } else {
      console.log("   ✓ image column exists\n");
    }

    // Check User.id type
    console.log("3. Checking User.id type...");
    const idType = await db.$queryRawUnsafe(`
      SELECT data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = 'User' 
        AND column_name = 'id';
    `) as Array<{ data_type: string }>;

    if (idType.length > 0 && (idType[0].data_type === 'integer' || idType[0].data_type === 'bigint')) {
      console.log("   ⚠️  WARNING: User.id is INTEGER but schema expects String!");
      console.log("   This will cause Prisma errors. You have two options:");
      console.log("   Option A: Reset database (deletes all data): npm run db:reset");
      console.log("   Option B: Update schema.prisma to use Integer id (not recommended)\n");
    } else {
      console.log("   ✓ User.id type is correct\n");
    }

    console.log("✅ Quick fix completed!\n");
    console.log("Please restart your dev server and test again.");

  } catch (error: any) {
    console.error("\n❌ Error:", error.message);
    if (error.code) {
      console.error("   Error code:", error.code);
    }
    throw error;
  } finally {
    await db.$disconnect();
  }
}

quickFix()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));

