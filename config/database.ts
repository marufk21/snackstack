// Database configuration
export const databaseConfig = {
  maxConnections: 10,
  connectionTimeout: 30000,
  idleTimeout: 600000,
  migrationDirectory: "./server/db/migrations",
  schemaPath: "./server/db/schema.prisma",
  generatedPath: "./server/lib/generated/prisma",
} as const;

export const getDatabaseUrl = () => {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL environment variable is required");
  }
  return url;
};
