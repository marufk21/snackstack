import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Mock data store (should match the main route)
let mockNotes: Array<{
  id: string;
  title: string;
  content: string;
  slug: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}> = [
  {
    id: "1",
    title: "Welcome to Your AI-Powered Notes",
    content:
      '# Welcome! 🎉\n\nThis is your first note in the AI-powered note editor. Here are some features you can try:\n\n## Features\n- **Markdown Support**: Write in markdown with live preview\n- **Auto-save**: Your changes are saved automatically\n- **AI Assistance**: Get writing help with AI suggestions\n- **Image Upload**: Add images to your notes\n\n## AI Commands\nTry these AI features:\n- **Improve**: Enhance clarity and structure\n- **Continue**: Let AI continue your writing\n- **Summarize**: Get bullet point summaries\n- **Expand**: Add more details and examples\n\n## Getting Started\n1. Click "Edit" to modify this note\n2. Try the AI suggestion buttons\n3. Upload an image\n4. Create a new note\n\nHappy writing! ✨',
    slug: "welcome-to-your-ai-powered-notes",
    imageUrl: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const updateNoteSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title too long")
    .optional(),
  content: z.string().optional(),
  imageUrl: z.string().url().optional(),
});

// Helper function to generate slug
function generateSlug(title: string): string {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 50);

  return baseSlug || "untitled";
}

// Helper function to ensure unique slug
function generateUniqueSlug(title: string, excludeId?: string): string {
  let slug = generateSlug(title);
  let counter = 1;

  while (true) {
    const existing = mockNotes.find(
      (note) => note.slug === slug && note.id !== excludeId
    );

    if (!existing) {
      return slug;
    }

    slug = `${generateSlug(title)}-${counter}`;
    counter++;
  }
}

// GET /api/notes/[id] - Get specific note
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await context.params;
    const note = mockNotes.find((n) => n.id === params.id);

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
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateNoteSchema.parse(body);
    const params = await context.params;

    const noteIndex = mockNotes.findIndex((n) => n.id === params.id);

    if (noteIndex === -1) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    const existingNote = mockNotes[noteIndex];

    // Update slug if title changed
    let slug = existingNote.slug;
    if (validatedData.title && validatedData.title !== existingNote.title) {
      slug = generateUniqueSlug(validatedData.title, params.id);
    }

    const updatedNote = {
      ...existingNote,
      ...validatedData,
      slug,
      updatedAt: new Date().toISOString(),
    };

    mockNotes[noteIndex] = updatedNote;

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
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await context.params;
    const noteIndex = mockNotes.findIndex((n) => n.id === params.id);

    if (noteIndex === -1) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    mockNotes.splice(noteIndex, 1);

    return NextResponse.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 }
    );
  }
}
