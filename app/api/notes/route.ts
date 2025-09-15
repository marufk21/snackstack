import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Mock data store for demo
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

// Validation schemas
const createNoteSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  content: z.string(),
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

// GET /api/notes - Get all notes for authenticated user
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ notes: mockNotes });
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
