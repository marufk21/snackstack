import { useMutation } from "@tanstack/react-query";
import { uploadFile } from "@/server/api";
import { useAppStore } from "@/stores/use-app-store";

export function useImageUploadMutation() {
  const { addNotification } = useAppStore();

  return useMutation({
    mutationFn: uploadFile,
    onSuccess: (data) => {
      addNotification({
        type: "success",
        message: "Image uploaded successfully",
      });
    },
    onError: (error) => {
      console.error("Error uploading image:", error);
      addNotification({
        type: "error",
        message: "Failed to upload image",
      });
    },
  });
}
