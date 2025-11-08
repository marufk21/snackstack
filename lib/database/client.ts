import "server-only";
import { PrismaClient } from "../../server/lib/generated/prisma";

declare global {
  // This prevents us from making multiple connections to the DB during development
  var prisma: PrismaClient | undefined;
}

// Create Prisma client with error formatting
export const db = globalThis.prisma || new PrismaClient({
  log: process.env.NODE_ENV === "development" 
    ? ["error", "warn"] 
    : ["error"],
  errorFormat: "pretty",
});

// Handle connection errors
db.$on("error" as never, (e: any) => {
  console.error("Prisma Client Error:", e);
});

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}
