import "server-only";
import { PrismaClient } from "../../server/lib/generated/prisma";

declare global {
  // This prevents us from making multiple connections to the DB during development
  var prisma: PrismaClient | undefined;
}

// Create Prisma client with optimized settings for serverless
export const db = globalThis.prisma || new PrismaClient({
  log: process.env.NODE_ENV === "development" 
    ? ["error", "warn"] 
    : ["error"],
  errorFormat: "pretty",
});

// Validate DATABASE_URL at runtime (not at module load to avoid build issues)
if (typeof window === "undefined" && !process.env.DATABASE_URL) {
  console.error(
    "⚠️ DATABASE_URL environment variable is not set. " +
    "Please set it in your environment variables (Vercel: Settings > Environment Variables)"
  );
}

// Handle connection errors
db.$on("error" as never, (e: any) => {
  console.error("Prisma Client Error:", e);
});

// In development, reuse the same instance
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

// For production/serverless: Prisma automatically manages connections
// Don't call $connect() or $disconnect() manually in serverless environments
// 
// IMPORTANT FOR PRODUCTION (Vercel):
// 1. Ensure DATABASE_URL is set in Vercel Environment Variables
// 2. For better performance, consider using a connection pooler:
//    - Prisma Data Proxy (recommended)
//    - PgBouncer (if using PostgreSQL)
// 3. Connection string format: postgresql://user:password@host:port/database?schema=public
