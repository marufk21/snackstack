import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  aiSuggestionRateLimit,
  getUserIdentifier,
} from "@/lib/utils/rate-limit";

// Initialize Gemini only when needed
const getGemini = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Gemini API key not configured");
  }
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
};

const aiSuggestionSchema = z.object({
  content: z.string().min(1, "Content is required"),
  type: z
    .enum(["improve", "continue", "summarize", "expand"])
    .default("improve"),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Apply rate limiting
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded
      ? forwarded.split(",")[0]
      : request.headers.get("x-real-ip") || "unknown";
    const userIdentifier = getUserIdentifier(userId, ip);
    const rateLimitResult = aiSuggestionRateLimit.check(userIdentifier);

    if (!rateLimitResult.allowed) {
      const resetTime = rateLimitResult.resetTime
        ? Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        : 60;
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please try again later.",
          retryAfter: resetTime,
        },
        {
          status: 429,
          headers: {
            "Retry-After": resetTime.toString(),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { content, type } = aiSuggestionSchema.parse(body);

    let prompt = "";

    switch (type) {
      case "improve":
        prompt = `You are an AI-powered note enhancement assistant. Please improve the following markdown note by enhancing clarity, structure, and readability. Keep the same general meaning but make it more engaging and well-formatted. Add insights or connections that might not be immediately obvious. Make suggestions to help the user think more deeply about their ideas:\n\n${content}`;
        break;
      case "continue":
        prompt = `You are an AI-powered note continuation assistant. Please continue writing the following markdown note in a natural and coherent way. Maintain the same style and tone. Help the user explore their ideas further by suggesting related concepts or asking thought-provoking questions:\n\n${content}`;
        break;
      case "summarize":
        prompt = `You are an AI-powered note summarization assistant. Please provide a concise summary of the following markdown note in bullet points. Identify the key ideas and main takeaways. Help the user distill their thoughts into actionable insights:\n\n${content}`;
        break;
      case "expand":
        prompt = `You are an AI-powered note expansion assistant. Please expand on the following markdown note by adding more details, examples, and explanations while maintaining the original structure. Help the user think more deeply about their ideas by suggesting related concepts, asking questions, or providing additional context:\n\n${content}`;
        break;
      default:
        prompt = `You are an AI-powered note enhancement assistant. Please improve the following markdown note:\n\n${content}`;
    }

    const genAI = getGemini();
    // Use gemini-pro for free tier compatibility
    // Free tier users can use gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemPrompt =
      "You are a helpful AI note-taking assistant that helps users capture, organize, and enhance their ideas. Always respond with well-formatted markdown. Be concise but helpful. Focus on helping users think more deeply about their ideas and make connections between concepts.";
    const fullPrompt = `${systemPrompt}\n\n${prompt}`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const suggestion = response.text();

    if (!suggestion) {
      return NextResponse.json(
        { error: "Failed to generate suggestion" },
        { status: 500 }
      );
    }

    return NextResponse.json({ suggestion });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error generating AI suggestion:", error);

    // Handle Gemini specific errors
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return NextResponse.json(
          { error: "Invalid Gemini API key" },
          { status: 401 }
        );
      }

      // Handle quota/rate limit errors (common with free tier)
      if (
        error.message.includes("429") ||
        error.message.includes("quota") ||
        error.message.includes("rate limit") ||
        error.message.includes("RESOURCE_EXHAUSTED")
      ) {
        return NextResponse.json(
          {
            error: "Daily quota exceeded",
            message:
              "You've reached your daily free tier limit. Please try again tomorrow or upgrade your plan.",
          },
          { status: 429 }
        );
      }

      // Handle model not found errors
      if (
        error.message.includes("404") ||
        error.message.includes("not found") ||
        error.message.includes("is not found for API version")
      ) {
        return NextResponse.json(
          {
            error: "Model not available",
            message:
              "The selected model is not available. Please check your API key permissions or try a different model.",
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to generate AI-powered note enhancement" },
      { status: 500 }
    );
  }
}
