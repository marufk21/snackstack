import { auth } from "@/config/auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/database";
import { createWelcomeNote, generateUniqueSlug } from "@/lib/utils/notes";
import { getOrCreateUserByEmail } from "@/lib/database/user";

// Explicitly use Node.js runtime for database operations
export const runtime = "nodejs";

// Validation schemas
const createNoteSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  content: z.string(),
  imageUrl: z.string().url().optional(),
});

// GET /api/notes - Get all notes for authenticated user
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const userEmail = session?.user?.email;

    if (!userId && !userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if database is available
    try {
      await db.$connect();
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 503 }
      );
    }

    // Resolve user - try by ID first, then by email
    // If user doesn't exist, create them (this handles first-time sign-ins)
    let user = null;
    const sessionEmail = userEmail || (userId?.includes("@") ? userId : null);

    if (userId && !userId.includes("@")) {
      // userId is a database ID (CUID)
      user = await db.user.findUnique({
        where: { id: userId },
      });
    }

    // If not found and we have an email, look up or create user by email
    if (!user && sessionEmail) {
      try {
        user = await getOrCreateUserByEmail(
          sessionEmail,
          session?.user?.name || sessionEmail
        );
      } catch (error: any) {
        console.error("❌ Error getting/creating user:", {
          email: sessionEmail,
          error: error?.message,
          code: error?.code,
          meta: error?.meta,
          stack: error?.stack?.split("\n").slice(0, 3),
        });
        
        const errorMessage = error?.message || "Unknown error";
        const errorCode = error?.code || "UNKNOWN";
        
        // Handle specific Prisma schema errors
        if (errorCode === "P2022" || errorMessage.includes("does not exist") || errorMessage.includes("emailVerified")) {
          return NextResponse.json(
            { 
              error: "Database schema mismatch",
              message: "The database is missing required columns. Please restart your dev server to regenerate Prisma client.",
              fixes: [
                "1. Stop your dev server (Ctrl+C)",
                "2. Run: npx prisma generate --schema=server/db/schema.prisma",
                "3. Restart your dev server",
                "Or POST to /api/debug/fix-schema to auto-fix"
              ],
              details: process.env.NODE_ENV === "development" 
                ? { message: errorMessage, code: errorCode, column: errorMessage.includes("emailVerified") ? "emailVerified" : "unknown" }
                : undefined
            },
            { status: 500 }
          );
        }
        
        // Handle connection errors
        if (errorCode === "P1001" || errorMessage.includes("connection") || errorMessage.includes("connect")) {
          return NextResponse.json(
            { 
              error: "Database connection failed",
              message: "Could not connect to the database. Please check your DATABASE_URL.",
              details: process.env.NODE_ENV === "development" 
                ? { message: errorMessage, code: errorCode }
                : undefined
            },
            { status: 503 }
          );
        }
        
        return NextResponse.json(
          { 
            error: "Failed to get or create user",
            message: errorMessage,
            details: process.env.NODE_ENV === "development" 
              ? { 
                  code: errorCode, 
                  meta: error?.meta,
                  hint: "Check server console for full error details. You may need to restart your dev server to regenerate Prisma client."
                }
              : undefined
          },
          { status: 500 }
        );
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: "User not found and could not be created" },
        { status: 404 }
      );
    }

    // Get all notes for this user
    let userNotes = await db.note.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
    });

    // If user has no notes, create a welcome note
    if (userNotes.length === 0) {
      const welcomeNote = await createWelcomeNote(user.id);
      userNotes = [welcomeNote];
    }

    return NextResponse.json({ notes: userNotes });
  } catch (error: any) {
    console.error("Error fetching notes:", error);
    
    const errorMessage = error?.message || "Unknown error";
    const errorCode = error?.code || "UNKNOWN";

    // More specific error handling
    if (error instanceof Error) {
      if (error.message.includes("connection")) {
        return NextResponse.json(
          { error: "Database connection failed" },
          { status: 503 }
        );
      }
      if (error.message.includes("timeout")) {
        return NextResponse.json({ error: "Request timeout" }, { status: 408 });
      }
      // Handle Prisma schema mismatch errors
      if (errorCode === "P2022" || errorMessage.includes("does not exist")) {
        return NextResponse.json(
          { 
            error: "Database schema mismatch",
            message: "The database schema does not match the expected schema. Please run: npm run db:quick-fix",
            details: process.env.NODE_ENV === "development" ? errorMessage : undefined
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { 
        error: "Failed to fetch notes",
        details: process.env.NODE_ENV === "development" ? { message: errorMessage, code: errorCode } : undefined
      },
      { status: 500 }
    );
  } finally {
    // Ensure database connection is closed
    try {
      await db.$disconnect();
    } catch (disconnectError) {
      console.error("Error disconnecting from database:", disconnectError);
    }
  }
}

// POST /api/notes - Create new note
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const userEmail = session?.user?.email;

    if (!userId && !userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createNoteSchema.parse(body);

    // Resolve user - try by ID first, then by email
    // If user doesn't exist, create them (this handles first-time sign-ins)
    let user = null;
    const sessionEmail = userEmail || (userId?.includes("@") ? userId : null);

    if (userId && !userId.includes("@")) {
      // userId is a database ID (CUID)
      user = await db.user.findUnique({
        where: { id: userId },
      });
    }

    // If not found and we have an email, look up or create user by email
    if (!user && sessionEmail) {
      try {
        user = await getOrCreateUserByEmail(
          sessionEmail,
          session?.user?.name || sessionEmail
        );
      } catch (error: any) {
        console.error("Error getting/creating user:", error);
        const errorMessage = error?.message || "Unknown error";
        const errorCode = error?.code || "UNKNOWN";
        
        // Handle specific Prisma schema errors
        if (errorCode === "P2022" || errorMessage.includes("does not exist") || errorMessage.includes("emailVerified")) {
          return NextResponse.json(
            { 
              error: "Database schema mismatch",
              message: "The database is missing required columns. Please run the database fix script.",
              fix: "Run: npm run db:quick-fix (requires DATABASE_URL in .env file)",
              details: process.env.NODE_ENV === "development" 
                ? { message: errorMessage, code: errorCode, column: errorMessage.includes("emailVerified") ? "emailVerified" : "unknown" }
                : undefined
            },
            { status: 500 }
          );
        }
        
        return NextResponse.json(
          { 
            error: "Failed to get or create user",
            message: errorMessage,
            details: process.env.NODE_ENV === "development" 
              ? { code: errorCode, meta: error?.meta }
              : undefined
          },
          { status: 500 }
        );
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: "User not found and could not be created" },
        { status: 404 }
      );
    }

    // Generate unique slug
    const slug = await generateUniqueSlug(validatedData.title);

    const newNote = await db.note.create({
      data: {
        title: validatedData.title,
        content: validatedData.content,
        slug,
        imageUrl: validatedData.imageUrl || null,
        userId: user.id,
      },
    });

    return NextResponse.json({ note: newNote }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error creating note:", error);
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}
