import { apiClient } from "../axios";

export interface AiSuggestionData {
  content: string;
  type: "improve" | "continue" | "summarize" | "expand";
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
