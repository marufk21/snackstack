import { handlers } from "@/server/auth/config";

// Explicitly use Node.js runtime for auth routes (required for database operations)
export const runtime = "nodejs";

export const { GET, POST } = handlers;
