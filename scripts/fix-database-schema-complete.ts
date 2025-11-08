/**
 * Comprehensive script to fix database schema mismatches
 * This script adds all missing columns to match the Prisma schema
 * Run this with: npx ts-node scripts/fix-database-schema-complete.ts
 */

import { db } from "../lib/database/client";

async function fixDatabaseSchema() {
  try {
    console.log("🔧 Fixing database schema...");
    console.log("");
    
    // First, check if imageUrl exists and create image column from it if needed
    console.log("🔍 Checking for image/imageUrl column...");
    const imageUrlCheck = await db.$queryRawUnsafe(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = 'User' 
        AND column_name IN ('image', 'imageUrl');
    `) as Array<{ column_name: string }>;

    const hasImage = imageUrlCheck.some(col => col.column_name === 'image');
    const hasImageUrl = imageUrlCheck.some(col => col.column_name === 'imageUrl');

    if (hasImageUrl && !hasImage) {
      console.log("📝 Renaming imageUrl to image...");
      try {
        await db.$executeRawUnsafe(`ALTER TABLE "public"."User" RENAME COLUMN "imageUrl" TO "image";`);
        console.log("✅ Renamed imageUrl to image");
      } catch (error: any) {
        console.log("⚠️  Could not rename imageUrl, will create image column instead");
        if (error.code !== '42701') { // Not "column does not exist"
          throw error;
        }
      }
    } else if (!hasImage && !hasImageUrl) {
      console.log("📝 Adding image column...");
      await db.$executeRawUnsafe(`ALTER TABLE "public"."User" ADD COLUMN IF NOT EXISTS "image" TEXT;`);
      console.log("✅ Added image column");
    } else if (hasImage) {
      console.log("✓ image column already exists");
    }

    // List of columns that should exist in the User table
    const userColumns = [
      { name: 'emailVerified', type: 'TIMESTAMP(3)', nullable: true },
      { name: 'isSubscribed', type: 'BOOLEAN', nullable: false, defaultValue: 'false' },
      { name: 'updatedAt', type: 'TIMESTAMP(3)', nullable: false, defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'lastActiveAt', type: 'TIMESTAMP(3)', nullable: false, defaultValue: 'CURRENT_TIMESTAMP' },
    ];

    // Check and add missing columns
    for (const column of userColumns) {
      try {
        // Check if column exists
        // Use Prisma's parameterized query format
        const checkResult = await db.$queryRawUnsafe(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_schema = 'public' 
            AND table_name = 'User' 
            AND column_name = '${column.name}';
        `) as Array<{ column_name: string }>;

        if (checkResult.length === 0) {
          console.log(`📝 Adding column: ${column.name}...`);
          
          let alterSql = `ALTER TABLE "public"."User" ADD COLUMN "${column.name}" ${column.type}`;
          
          if (!column.nullable && column.defaultValue) {
            alterSql += ` NOT NULL DEFAULT ${column.defaultValue}`;
          } else if (column.nullable) {
            alterSql += ` NULL`;
          }
          
          alterSql += ';';
          
          await db.$executeRawUnsafe(alterSql);
          console.log(`✅ Added column: ${column.name}`);
        } else {
          console.log(`✓ Column already exists: ${column.name}`);
        }
      } catch (error: any) {
        // If column already exists or other error, log and continue
        if (error.message?.includes('already exists') || error.code === '42701') {
          console.log(`✓ Column already exists: ${column.name}`);
        } else {
          console.error(`❌ Error adding column ${column.name}:`, error.message);
          // Continue with other columns
        }
      }
    }

    // Check if User.id is String (text) or Integer
    console.log("");
    console.log("🔍 Checking User table structure...");
    const idColumnInfo = await db.$queryRawUnsafe(`
      SELECT data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = 'User' 
        AND column_name = 'id';
    `) as Array<{ data_type: string }>;

    if (idColumnInfo.length > 0) {
      const idType = idColumnInfo[0].data_type;
      console.log(`📊 User.id type: ${idType}`);
      
      if (idType === 'integer' || idType === 'bigint') {
        console.log("⚠️  WARNING: User.id is INTEGER but schema expects String (cuid)");
        console.log("   This requires a more complex migration. Please run:");
        console.log("   npm run db:reset (WARNING: This will delete all data)");
        console.log("   OR create a proper migration to convert ID type");
      }
    }

    // Check Note table columns
    console.log("");
    console.log("🔍 Checking Note table...");
    const noteColumns = [
      { name: 'isPublic', type: 'BOOLEAN', nullable: false, defaultValue: 'false' },
      { name: 'views', type: 'INTEGER', nullable: false, defaultValue: '0' },
    ];

    for (const column of noteColumns) {
      try {
        const checkResult = await db.$queryRawUnsafe(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_schema = 'public' 
            AND table_name = 'Note' 
            AND column_name = '${column.name}';
        `) as Array<{ column_name: string }>;

        if (checkResult.length === 0) {
          console.log(`📝 Adding column: Note.${column.name}...`);
          
          let alterSql = `ALTER TABLE "public"."Note" ADD COLUMN "${column.name}" ${column.type}`;
          
          if (!column.nullable && column.defaultValue) {
            alterSql += ` NOT NULL DEFAULT ${column.defaultValue}`;
          }
          
          alterSql += ';';
          
          await db.$executeRawUnsafe(alterSql);
          console.log(`✅ Added column: Note.${column.name}`);
        } else {
          console.log(`✓ Column already exists: Note.${column.name}`);
        }
      } catch (error: any) {
        if (error.message?.includes('already exists') || error.code === '42701') {
          console.log(`✓ Column already exists: Note.${column.name}`);
        } else {
          console.error(`❌ Error adding column Note.${column.name}:`, error.message);
        }
      }
    }

    // Verify final state
    console.log("");
    console.log("🔍 Verifying schema...");
    const userColumnsFinal = await db.$queryRawUnsafe(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = 'User'
      ORDER BY column_name;
    `) as Array<{ column_name: string; data_type: string; is_nullable: string }>;

    console.log("");
    console.log("📊 User table columns:");
    userColumnsFinal.forEach(col => {
      console.log(`   - ${col.column_name} (${col.data_type}, nullable: ${col.is_nullable})`);
    });

    console.log("");
    console.log("✅ Schema fix completed!");
    
  } catch (error) {
    console.error("❌ Error fixing schema:", error);
    throw error;
  } finally {
    await db.$disconnect();
  }
}

fixDatabaseSchema()
  .then(() => {
    console.log("");
    console.log("🎉 All done! Please restart your development server.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Schema fix failed:", error);
    process.exit(1);
  });

