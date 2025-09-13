import { useState } from "react";

export interface UploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export interface UploadResponse {
  success: boolean;
  data?: UploadResult;
  error?: string;
  details?: string;
}

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<UploadResult | null> => {
    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result: UploadResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      if (!result.success || !result.data) {
        throw new Error("Invalid response from server");
      }

      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed";
      setError(errorMessage);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const uploadMultipleImages = async (
    files: File[]
  ): Promise<UploadResult[]> => {
    const results: UploadResult[] = [];

    for (const file of files) {
      const result = await uploadImage(file);
      if (result) {
        results.push(result);
      }
    }

    return results;
  };

  return {
    uploadImage,
    uploadMultipleImages,
    isUploading,
    error,
    clearError: () => setError(null),
  };
}
