import { NextResponse } from "next/server";
import { isAdmin } from "@/server/utils/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const authorized = await isAdmin();
    return NextResponse.json({ isAdmin: authorized });
  } catch (error) {
    console.error("Admin verification error:", error);
    return NextResponse.json(
      { isAdmin: false, error: "Verification failed" },
      { status: 500 }
    );
  }
}
