/**
 * Generate a Cloudinary URL with transformations (client-side safe)
 * This only constructs URLs and doesn't use the server-side Cloudinary SDK
 */
export function buildCloudinaryUrl(
  publicId: string,
  cloudName: string = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "",
  transformations?: string[]
): string {
  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;

  if (transformations && transformations.length > 0) {
    const transformString = transformations.join(",");
    return `${baseUrl}/${transformString}/${publicId}`;
  }

  return `${baseUrl}/${publicId}`;
}

/**
 * Get optimized image URL for display
 */
export function getOptimizedImageUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: string;
    format?: string;
  } = {}
): string {
  const {
    width = 800,
    height = 600,
    quality = "auto",
    format = "auto",
  } = options;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";

  return `https://res.cloudinary.com/${cloudName}/image/upload/w_${width},h_${height},c_limit,q_${quality},f_${format}/${publicId}`;
}
