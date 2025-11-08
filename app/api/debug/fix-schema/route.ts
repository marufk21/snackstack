import { NextResponse } from "next/server";
import { db } from "@/lib/database/client";

// Explicitly use Node.js runtime for database operations
export const runtime = "nodejs";

export async function POST() {
  try {
    console.log("🔧 Fixing database schema...");

    // Add emailVerified column
    try {
      await db.$executeRawUnsafe(`
        ALTER TABLE "public"."User" 
        ADD COLUMN IF NOT EXISTS "emailVerified" TIMESTAMP(3);
      `);
      console.log("✅ Added emailVerified column");
    } catch (error: any) {
      if (error.code === "42701") {
        // Column already exists
        console.log("✓ emailVerified column already exists");
      } else {
        throw error;
      }
    }

    // Handle image/imageUrl column
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
      try {
        await db.$executeRawUnsafe(`ALTER TABLE "public"."User" RENAME COLUMN "imageUrl" TO "image";`);
        console.log("✅ Renamed imageUrl to image");
      } catch (error: any) {
        console.log("⚠️  Could not rename imageUrl (may already be renamed)");
      }
    } else if (!hasImage && !hasImageUrl) {
      await db.$executeRawUnsafe(`ALTER TABLE "public"."User" ADD COLUMN IF NOT EXISTS "image" TEXT;`);
      console.log("✅ Added image column");
    }

    return NextResponse.json({
      success: true,
      message: "Database schema fixed successfully!",
      changes: [
        "Added emailVerified column",
        hasImageUrl && !hasImage ? "Renamed imageUrl to image" : hasImage ? "image column exists" : "Added image column"
      ].filter(Boolean),
    });
  } catch (error: any) {
    console.error("Error fixing schema:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fix database schema",
        message: error?.message,
        code: error?.code,
        hint: "Make sure DATABASE_URL is set correctly and you have permission to alter the database schema",
      },
      { status: 500 }
    );
  } finally {
    await db.$disconnect();
  }
}

