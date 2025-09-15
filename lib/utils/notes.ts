import { db } from "@/lib/db";

// Helper function to generate slug
export function generateSlug(title: string): string {
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
export async function generateUniqueSlug(
  title: string,
  excludeId?: string
): Promise<string> {
  let slug = generateSlug(title);
  let counter = 1;

  while (true) {
    const existing = await db.note.findFirst({
      where: {
        slug: slug,
        NOT: excludeId ? { id: excludeId } : undefined,
      },
    });

    if (!existing) {
      return slug;
    }

    slug = `${generateSlug(title)}-${counter}`;
    counter++;
  }
}

// Helper function to create initial welcome note for new users
export async function createWelcomeNote(clerkUserId: string) {
  // First, find or create the user in our database
  let user = await db.user.findFirst({
    where: { email: clerkUserId }, // Using clerkUserId as email for now
  });

  if (!user) {
    user = await db.user.create({
      data: {
        name: "New User",
        email: clerkUserId,
      },
    });
  }

  const slug = await generateUniqueSlug("Welcome to Your AI-Powered Notes");

  return await db.note.create({
    data: {
      title: "Welcome to Your AI-Powered Notes",
      content:
        '# Welcome! 🎉\n\nThis is your first note in the AI-powered note editor. Here are some features you can try:\n\n## Features\n- **Markdown Support**: Write in markdown with live preview\n- **Auto-save**: Your changes are saved automatically\n- **AI Assistance**: Get writing help with AI suggestions\n- **Image Upload**: Add images to your notes\n\n## AI Commands\nTry these AI features:\n- **Improve**: Enhance clarity and structure\n- **Continue**: Let AI continue your writing\n- **Summarize**: Get bullet point summaries\n- **Expand**: Add more details and examples\n\n## Getting Started\n1. Click "Edit" to modify this note\n2. Try the AI suggestion buttons\n3. Upload an image\n4. Create a new note\n\nHappy writing! ✨',
      slug,
      imageUrl: null,
      userId: user.id,
    },
  });
}
