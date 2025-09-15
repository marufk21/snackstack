// Cloudinary configuration
export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
  folder: "snackstack",
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFormats: ["jpg", "jpeg", "png", "webp", "gif"],
} as const;

export const getCloudinaryConfig = () => {
  if (!cloudinaryConfig.cloudName) {
    throw new Error("Cloudinary cloud name is required");
  }
  return cloudinaryConfig;
};
