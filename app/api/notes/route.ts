import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  mockNotes,
  createWelcomeNote,
  generateUniqueSlug,
  type Note,
} from "@/lib/mock-data/notes";

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

    // Filter notes by user and create welcome note if none exist
    let userNotes = mockNotes.filter((note) => note.userId === userId);

    // If user has no notes, create a welcome note
    if (userNotes.length === 0) {
      const welcomeNote = createWelcomeNote(userId);
      mockNotes.push(welcomeNote);
      userNotes = [welcomeNote];
    }

    return NextResponse.json({ notes: userNotes });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
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

    // Generate unique slug
    const slug = generateUniqueSlug(validatedData.title);

    const newNote = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      title: validatedData.title,
      content: validatedData.content,
      slug,
      imageUrl: validatedData.imageUrl || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockNotes.unshift(newNote);

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
