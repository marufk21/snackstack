import { NextResponse } from "next/server";
import { db } from "@/lib/database/client";

// Explicitly use Node.js runtime for database operations
export const runtime = "nodejs";

export async function GET() {
  try {
    // Check User table structure
    const userColumns = await db.$queryRawUnsafe(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = 'User'
      ORDER BY ordinal_position;
    `) as Array<{
      column_name: string;
      data_type: string;
      is_nullable: string;
      column_default: string | null;
    }>;

    // Check Note table structure
    const noteColumns = await db.$queryRawUnsafe(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = 'Note'
      ORDER BY ordinal_position;
    `) as Array<{
      column_name: string;
      data_type: string;
      is_nullable: string;
      column_default: string | null;
    }>;

    // Check for missing columns
    const expectedUserColumns = ['id', 'name', 'email', 'emailVerified', 'image', 'isSubscribed', 'createdAt', 'updatedAt', 'lastActiveAt'];
    const existingUserColumns = userColumns.map(col => col.column_name);
    const missingUserColumns = expectedUserColumns.filter(col => !existingUserColumns.includes(col));

    return NextResponse.json({
      userTable: {
        columns: userColumns,
        missingColumns: missingUserColumns,
        idType: userColumns.find(col => col.column_name === 'id')?.data_type,
      },
      noteTable: {
        columns: noteColumns,
      },
      recommendations: missingUserColumns.length > 0 
        ? [
            `Run: npm run db:quick-fix to add missing columns: ${missingUserColumns.join(', ')}`,
            `Or POST to /api/debug/fix-schema to auto-fix the schema`
          ]
        : ['Schema looks good!'],
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to check database schema",
        message: error?.message,
        code: error?.code,
      },
      { status: 500 }
    );
  } finally {
    await db.$disconnect();
  }
}

