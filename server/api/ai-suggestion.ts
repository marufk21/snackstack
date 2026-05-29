import { apiClient } from "@/server/api/client";

export interface AiSuggestionData {
  content: string;
  type: "improve" | "expand";
}

export interface AiSuggestionResponse {
  suggestion: string;
}

// Generate AI suggestion for content
export const generateAiSuggestion = async (
  data: AiSuggestionData
): Promise<string> => {
  try {
    const response = await apiClient.post("/ai-suggestion", data);
    return response.data.suggestion;
  } catch (error: unknown) {
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: { data?: { message?: string; error?: string } };
      };
      const message =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        "Failed to generate AI suggestion";
      throw new Error(message);
    }
    throw error;
  }
};
