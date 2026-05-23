import { auth } from "@/server/auth/config";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/server/db/client";
import { generateUniqueSlug } from "@/server/services/notes";
import { getOrCreateUserByEmail } from "@/server/services/user";

// Explicitly use Node.js runtime for database operations
export const runtime = "nodejs";

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
    const userEmail = session?.user?.email;

    if (!userId && !userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await context.params;

    // Resolve user ID - try by ID first, then by email
    // If user doesn't exist, create them (this handles first-time sign-ins)
    let dbUserId: string | null = null;
    const sessionEmail = userEmail || (userId?.includes("@") ? userId : null);

    if (userId && !userId.includes("@")) {
      // userId is a database ID (CUID)
      const userById = await db.user.findUnique({
        where: { id: userId },
        select: { id: true },
      });
      if (userById) {
        dbUserId = userById.id;
      }
    }

    // If not found and we have an email, look up or create user by email
    if (!dbUserId && sessionEmail) {
      try {
        const user = await getOrCreateUserByEmail(
          sessionEmail,
          session?.user?.name || sessionEmail
        );
        dbUserId = user.id;
      } catch (error) {
        console.error("Error getting/creating user:", error);
        return NextResponse.json(
          { error: "Failed to get or create user" },
          { status: 500 }
        );
      }
    }

    if (!dbUserId) {
      return NextResponse.json(
        { error: "User not found and could not be created" },
        { status: 404 }
      );
    }

    const note = await db.note.findFirst({
      where: {
        id: params.id,
        userId: dbUserId,
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
    const userEmail = session?.user?.email;

    if (!userId && !userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateNoteSchema.parse(body);
    const params = await context.params;

    // Resolve user ID - try by ID first, then by email
    // If user doesn't exist, create them (this handles first-time sign-ins)
    let dbUserId: string | null = null;
    const sessionEmail = userEmail || (userId?.includes("@") ? userId : null);

    if (userId && !userId.includes("@")) {
      // userId is a database ID (CUID)
      const userById = await db.user.findUnique({
        where: { id: userId },
        select: { id: true },
      });
      if (userById) {
        dbUserId = userById.id;
      }
    }

    // If not found and we have an email, look up or create user by email
    if (!dbUserId && sessionEmail) {
      try {
        const user = await getOrCreateUserByEmail(
          sessionEmail,
          session?.user?.name || sessionEmail
        );
        dbUserId = user.id;
      } catch (error) {
        console.error("Error getting/creating user:", error);
        return NextResponse.json(
          { error: "Failed to get or create user" },
          { status: 500 }
        );
      }
    }

    if (!dbUserId) {
      return NextResponse.json(
        { error: "User not found and could not be created" },
        { status: 404 }
      );
    }

    // Find the existing note
    const existingNote = await db.note.findFirst({
      where: {
        id: params.id,
        userId: dbUserId,
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
    const userEmail = session?.user?.email;

    if (!userId && !userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await context.params;

    // Resolve user ID - try by ID first, then by email
    // If user doesn't exist, create them (this handles first-time sign-ins)
    let dbUserId: string | null = null;
    const sessionEmail = userEmail || (userId?.includes("@") ? userId : null);

    if (userId && !userId.includes("@")) {
      // userId is a database ID (CUID)
      const userById = await db.user.findUnique({
        where: { id: userId },
        select: { id: true },
      });
      if (userById) {
        dbUserId = userById.id;
      }
    }

    // If not found and we have an email, look up or create user by email
    if (!dbUserId && sessionEmail) {
      try {
        const user = await getOrCreateUserByEmail(
          sessionEmail,
          session?.user?.name || sessionEmail
        );
        dbUserId = user.id;
      } catch (error) {
        console.error("Error getting/creating user:", error);
        return NextResponse.json(
          { error: "Failed to get or create user" },
          { status: 500 }
        );
      }
    }

    if (!dbUserId) {
      return NextResponse.json(
        { error: "User not found and could not be created" },
        { status: 404 }
      );
    }

    // Check if note exists and belongs to user
    const existingNote = await db.note.findFirst({
      where: {
        id: params.id,
        userId: dbUserId,
      },
    });

    if (!existingNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    // Delete the note and decrement count
    await db.$transaction(async (tx) => {
      await tx.note.delete({
        where: { id: params.id },
      });

      // Decrement user's note count if the function exists
      const { decrementNoteCount } = await import("@/server/services/subscription");
      await decrementNoteCount(dbUserId!);
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
