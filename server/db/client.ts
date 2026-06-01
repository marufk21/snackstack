import "server-only";
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient({
  log: process.env.NODE_ENV === "development"
    ? ["error", "warn"]
    : ["error"],
  errorFormat: "pretty",
});

if (typeof window === "undefined" && !process.env.DATABASE_URL) {
  console.error(
    "⚠️ DATABASE_URL environment variable is not set. " +
    "Please set it in your environment variables (Vercel: Settings > Environment Variables)"
  );
}

db.$on("error" as never, (e: any) => {
  console.error("Prisma Client Error:", e);
});

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}
