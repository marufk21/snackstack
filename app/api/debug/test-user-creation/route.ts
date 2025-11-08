import { NextResponse } from "next/server";
import { getOrCreateUserByEmail } from "@/lib/database/user";
import { db } from "@/lib/database/client";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    console.log("Testing user creation with:", { email, name });

    // Test database connection first
    try {
      await db.$connect();
      console.log("✅ Database connected");
    } catch (dbError: any) {
      console.error("❌ Database connection failed:", dbError);
      return NextResponse.json(
        {
          error: "Database connection failed",
          details: dbError?.message,
        },
        { status: 503 }
      );
    }

    // Test Prisma client schema
    try {
      const testQuery = await db.$queryRaw`SELECT 1 as test`;
      console.log("✅ Raw query works:", testQuery);
    } catch (queryError: any) {
      console.error("❌ Raw query failed:", queryError);
      return NextResponse.json(
        {
          error: "Prisma query failed",
          details: queryError?.message,
          code: queryError?.code,
        },
        { status: 500 }
      );
    }

    // Test user lookup
    try {
      const existingUser = await db.user.findUnique({
        where: { email },
      });
      console.log("✅ User lookup works. Existing user:", existingUser ? "Found" : "Not found");
    } catch (lookupError: any) {
      console.error("❌ User lookup failed:", lookupError);
      return NextResponse.json(
        {
          error: "User lookup failed",
          details: lookupError?.message,
          code: lookupError?.code,
          meta: lookupError?.meta,
        },
        { status: 500 }
      );
    }

    // Test user creation
    try {
      const user = await getOrCreateUserByEmail(email, name || undefined);
      console.log("✅ User created/found successfully:", user.id);
      
      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
    } catch (createError: any) {
      console.error("❌ User creation failed:", createError);
      return NextResponse.json(
        {
          error: "User creation failed",
          details: createError?.message,
          code: createError?.code,
          meta: createError?.meta,
          stack: createError?.stack,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("❌ Unexpected error:", error);
    return NextResponse.json(
      {
        error: "Unexpected error",
        details: error?.message,
        stack: error?.stack,
      },
      { status: 500 }
    );
  } finally {
    await db.$disconnect();
  }
}

