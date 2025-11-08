import { PrismaClient } from "./generated/prisma";

declare global {
  // This prevents us from making multiple connections to the DB during development
  var prisma: PrismaClient | undefined;
}

export const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

