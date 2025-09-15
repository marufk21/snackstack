import { apiClient } from "../axios";

export interface UploadResponse {
  success: boolean;
  data: {
    public_id: string;
    secure_url: string;
    url: string;
    [key: string]: any;
  };
}

// Upload file to Cloudinary
export const uploadFile = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
