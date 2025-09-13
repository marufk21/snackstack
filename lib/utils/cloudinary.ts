import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export interface UploadOptions {
  folder?: string;
  transformation?: any[];
  resource_type?: "image" | "video" | "raw" | "auto";
}

/**
 * Upload a file buffer to Cloudinary
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  options: UploadOptions = {}
): Promise<UploadResult> {
  const {
    folder = "snackstack",
    transformation = [
      { width: 1200, height: 1200, crop: "limit" },
      { quality: "auto" },
      { format: "auto" },
    ],
    resource_type = "auto",
  } = options;

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type,
          folder,
          transformation,
        },
        (error: any, result: any) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve({
              public_id: result.public_id,
              secure_url: result.secure_url,
              width: result.width,
              height: result.height,
              format: result.format,
              bytes: result.bytes,
            });
          } else {
            reject(new Error("Upload failed: No result returned"));
          }
        }
      )
      .end(buffer);
  });
}

/**
 * Delete an image from Cloudinary using its public_id
 */
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === "ok";
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    return false;
  }
}

/**
 * Generate a Cloudinary URL with transformations
 */
export function getCloudinaryUrl(
  publicId: string,
  transformations?: any[]
): string {
  return cloudinary.url(publicId, {
    transformation: transformations,
  });
}
