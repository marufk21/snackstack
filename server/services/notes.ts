import "server-only";
import { db } from "@/server/db/client";

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
