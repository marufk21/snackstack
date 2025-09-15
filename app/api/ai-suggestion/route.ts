import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import OpenAI from "openai";

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const aiSuggestionSchema = z.object({
  content: z.string().min(1, "Content is required"),
  type: z
    .enum(["improve", "continue", "summarize", "expand"])
    .default("improve"),
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { content, type } = aiSuggestionSchema.parse(body);

    let prompt = "";

    switch (type) {
      case "improve":
        prompt = `Please improve the following markdown content by enhancing clarity, structure, and readability. Keep the same general meaning but make it more engaging and well-formatted:\n\n${content}`;
        break;
      case "continue":
        prompt = `Please continue writing the following markdown content in a natural and coherent way. Maintain the same style and tone:\n\n${content}`;
        break;
      case "summarize":
        prompt = `Please provide a concise summary of the following markdown content in bullet points:\n\n${content}`;
        break;
      case "expand":
        prompt = `Please expand on the following markdown content by adding more details, examples, and explanations while maintaining the original structure:\n\n${content}`;
        break;
      default:
        prompt = `Please improve the following markdown content:\n\n${content}`;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful writing assistant that helps improve markdown content. Always respond with well-formatted markdown. Be concise but helpful.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const suggestion = completion.choices[0]?.message?.content || "";

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

    // Handle OpenAI specific errors
    if (error instanceof Error && error.message.includes("API key")) {
      return NextResponse.json(
        { error: "Invalid OpenAI API key" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate AI suggestion" },
      { status: 500 }
    );
  }
}
