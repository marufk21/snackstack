import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/database";
import { createWelcomeNote, generateUniqueSlug } from "@/lib/utils/notes";

// Validation schemas
const createNoteSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  content: z.string(),
  imageUrl: z.string().url().optional(),
});

// GET /api/notes - Get all notes for authenticated user
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
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

    // First, find or create the user in our database
    let user = await db.user.findFirst({
      where: { email: userId }, // Using Clerk userId as email identifier
    });

    if (!user) {
      user = await db.user.create({
        data: {
          name: "New User",
          email: userId,
        },
      });
    }

    // Get all notes for this user
    let userNotes = await db.note.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
    });

    // If user has no notes, create a welcome note
    if (userNotes.length === 0) {
      const welcomeNote = await createWelcomeNote(userId);
      userNotes = [welcomeNote];
    }

    return NextResponse.json({ notes: userNotes });
  } catch (error) {
    console.error("Error fetching notes:", error);

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
    }

    return NextResponse.json(
      { error: "Failed to fetch notes" },
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
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createNoteSchema.parse(body);

    // First, find or create the user in our database
    let user = await db.user.findFirst({
      where: { email: userId }, // Using Clerk userId as email identifier
    });

    if (!user) {
      user = await db.user.create({
        data: {
          name: "New User",
          email: userId,
        },
      });
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
