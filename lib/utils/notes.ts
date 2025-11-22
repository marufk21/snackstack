import "server-only";
import { db } from "@/lib/database";

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


