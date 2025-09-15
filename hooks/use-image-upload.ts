"use client";

import { useState } from "react";
import { uploadFile } from "@/server/api";

export interface UploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<UploadResult | null> => {
    setIsUploading(true);
    setError(null);

    try {
      const result = await uploadFile(file);

      if (!result.success) {
        throw new Error("Upload failed");
      }

      return {
        public_id: result.data.public_id,
        secure_url: result.data.secure_url,
        width: result.data.width || 0,
        height: result.data.height || 0,
        format: result.data.format || "",
        bytes: result.data.bytes || 0,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed";
      setError(errorMessage);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadImage,
    isUploading,
    error,
  };
}
