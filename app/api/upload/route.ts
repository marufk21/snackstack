import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/server/integrations/cloudinary/upload";
import { protectApiRoute } from "@/server/utils/api-protection";
import { getUserSubscriptionTier } from "@/server/services/subscription";
import { PLAN_LIMITS } from "@/server/utils/subscription-check";

export async function POST(request: NextRequest) {
  try {
    // Protect route - require authentication only (no subscription needed)
    const { error, user } = await protectApiRoute();
    if (error) return error;

    // Check if Cloudinary environment variables are set
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.error("Missing Cloudinary environment variables:", {
        cloudName: !!cloudName,
        apiKey: !!apiKey,
        apiSecret: !!apiSecret,
      });
      return NextResponse.json(
        {
          error: "Server configuration error",
          details:
            "Cloudinary environment variables are not configured. Please check your .env.local file.",
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.",
        },
        { status: 400 }
      );
    }

    // Resolve per-plan upload limit (clamped to Cloudinary free-tier safe maximum of 10MB)
    const tier = user?.id ? await getUserSubscriptionTier(user.id) : "free";
    const planMaxSize = PLAN_LIMITS[tier].maxImageSize;
    const CLOUDINARY_SAFE_MAX = 10 * 1024 * 1024; // 10MB safe cap for free Cloudinary accounts
    const maxSize = Math.min(planMaxSize, CLOUDINARY_SAFE_MAX);

    if (file.size > maxSize) {
      const maxMB = Math.round(maxSize / (1024 * 1024));
      return NextResponse.json(
        {
          error: `File size too large. Your plan allows up to ${maxMB}MB per image.`,
          code: "FILE_TOO_LARGE",
          maxSize,
          currentTier: tier,
        },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary using utility function
    const result = await uploadToCloudinary(buffer, {
      folder: "snackstack",
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        error: "Upload failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
