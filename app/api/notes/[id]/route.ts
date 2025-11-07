import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/database";
import { generateUniqueSlug } from "@/lib/utils/notes";

const updateNoteSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title too long")
    .optional(),
  content: z.string().optional(),
  imageUrl: z.string().url().optional(),
});

// GET /api/notes/[id] - Get specific note
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await context.params;

    const note = await db.note.findFirst({
      where: {
        id: params.id,
        userId: userId,
      },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json({ note });
  } catch (error) {
    console.error("Error fetching note:", error);
    return NextResponse.json(
      { error: "Failed to fetch note" },
      { status: 500 }
    );
  }
}

// PUT /api/notes/[id] - Update specific note
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateNoteSchema.parse(body);
    const params = await context.params;

    // Find the existing note
    const existingNote = await db.note.findFirst({
      where: {
        id: params.id,
        userId: userId,
      },
    });

    if (!existingNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    // Update slug if title changed
    let slug = existingNote.slug;
    if (validatedData.title && validatedData.title !== existingNote.title) {
      slug = await generateUniqueSlug(validatedData.title, params.id);
    }

    const updatedNote = await db.note.update({
      where: { id: params.id },
      data: {
        title: validatedData.title || existingNote.title,
        content: validatedData.content || existingNote.content,
        imageUrl:
          validatedData.imageUrl !== undefined
            ? validatedData.imageUrl
            : existingNote.imageUrl,
        slug,
      },
    });

    return NextResponse.json({ note: updatedNote });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error updating note:", error);
    return NextResponse.json(
      { error: "Failed to update note" },
      { status: 500 }
    );
  }
}

// DELETE /api/notes/[id] - Delete specific note
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await context.params;

    // Check if note exists and belongs to user
    const existingNote = await db.note.findFirst({
      where: {
        id: params.id,
        userId: userId,
      },
    });

    if (!existingNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    // Delete the note
    await db.note.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 }
    );
  }
}
