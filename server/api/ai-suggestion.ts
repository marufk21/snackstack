import { apiClient } from "../axios/config";

export interface AiSuggestionData {
  content: string;
  type: "improve" | "summarize" | "expand";
}

export interface AiSuggestionResponse {
  suggestion: string;
}

// Generate AI suggestion for content
export const generateAiSuggestion = async (
  data: AiSuggestionData
): Promise<string> => {
  const response = await apiClient.post("/ai-suggestion", data);
  return response.data.suggestion;
};
