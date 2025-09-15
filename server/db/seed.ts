import { PrismaClient } from "../lib/generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database initialization...");

  try {
    // Test database connection
    console.log("🔌 Testing database connection...");
    await prisma.$connect();

    console.log("✅ Database connection successful!");
    console.log("🎉 Database is ready for use!");

    // Show current database state
    const userCount = await prisma.user.count();
    const noteCount = await prisma.note.count();

    console.log("\n📊 Current database state:");
    console.log(`👥 Users: ${userCount}`);
    console.log(`📝 Notes: ${noteCount}`);

    if (userCount === 0 && noteCount === 0) {
      console.log("\n✨ Database is clean and ready for real data!");
      console.log(
        "📝 Real notes will be created when users sign up and use the app."
      );
    }
  } catch (error) {
    console.error("❌ Error during database initialization:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error("❌ Database initialization failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("🔌 Database connection closed");
  });
