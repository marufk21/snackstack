import { z } from "zod";
import { auth } from "@/server/auth/config";
import { NextRequest, NextResponse } from "next/server";
import {
  getGeminiModel,
  getOpenAIClient,
  shouldFallbackToOpenAI,
  OPENAI_MODEL,
} from "@/server/services/ai-providers";
import {
  aiSuggestionRateLimit,
  getUserIdentifier,
} from "@/server/utils/rate-limit";
import {
  getUserSubscriptionTier,
  getAISuggestionsRemaining,
  incrementAISuggestionsCount,
} from "@/server/services/subscription";

// ── Schema ─────────────────────────────────────────────────────────

const aiSuggestionSchema = z.object({
  content: z.string().min(1, "Content is required"),
  type: z.enum(["improve", "expand"]).default("improve"),
});

// ── Shared prompts ─────────────────────────────────────────────────

const SYSTEM_INSTRUCTION = `You are a thinking partner embedded in SnackStack, a notes app. Your job: help users write better notes by editing or expanding their thoughts.

Golden rules:
- Return ONLY the final output. No intros, no sign-offs, no "Here you go," no code blocks, no quotation wrapping.
- The user's voice is sacred. Casual stays casual. Technical stays technical. A one-line todo stays a one-line todo.
- Never invent facts, dates, names, stats, or citations. Derive only what the text reasonably implies.
- Match the input language. Hindi input → Hindi output. Mixed input → stay in the primary language.
- Use light Markdown (bullets, **bold**, *italic*) only when it genuinely helps readability.
- If the input is already optimal, return it exactly as-is. Doing nothing is better than making it worse.`;

const PROMPTS: Record<string, (content: string) => string> = {
  improve: (content: string) =>
    `Fix every spelling mistake, grammar error, and punctuation issue in this note. Format it cleanly so it reads well.

Your job is simple — fix only what's broken:
- **Spelling**: Correct every misspelled word. This is the #1 priority.
- **Grammar**: Fix subject-verb agreement, tense errors, missing articles, wrong prepositions.
- **Punctuation**: Add missing periods, commas, capital letters. Fix run-on sentences.
- **Format**: If the note is a list, make it a clean bullet list. If it's prose, make it readable paragraphs. Add line breaks between sections where helpful.
- **Capitalization**: Capitalize the first letter of sentences and proper nouns.

What you MUST NOT change:
- The meaning, the ideas, the tone, the voice
- Casual language — "gonna", "wanna", slang stay as-is
- Short notes, todos, reminders — keep them short
- Any facts, names, dates, numbers, links

CRITICAL: If there are spelling mistakes, you MUST fix them. That is non-negotiable. If the note has no errors at all, return it exactly as-is.

Example:
Input: "i think we should probly refactor the auth module becuase its getting to complecated and hard to maintain, also the tests are failin"
Output: "I think we should probably refactor the auth module because it's getting too complicated and hard to maintain. Also, the tests are failing."

Now fix this note:
"""
${content}
"""

Output:`,

  expand: (content: string) =>
    `Expand this note with more detail — but only about what's already in it. Stay on topic. Do not drift.

Rules for expansion:
- **Stay relevant**: Every sentence you add must connect directly to the original content. Don't introduce unrelated ideas.
- **Right length**: Double to triple the original length. A 2-line note becomes 4-6 lines. A paragraph becomes 2-3 paragraphs. Don't write an essay from a one-liner.
- **Add depth, not fluff**: Explain the "why", give a concrete example, describe a real consequence, or suggest a natural next step.
- **One voice**: Blend your additions seamlessly with the original. The reader should not be able to tell where the original ends and yours begins.
- **Match the style**: Formal stays formal. Casual stays casual. Hindi stays Hindi.

What NOT to do:
- Don't invent facts, statistics, names, or citations
- Don't repeat the same point in different words
- Don't go off on tangents — stay anchored to the input
- Don't add generic motivational quotes or life advice

Example:
Input: "Remote work improves productivity but hurts collaboration."
Output: "Remote work improves productivity but hurts collaboration. The productivity gain is real — no commute means 2-3 extra hours of deep work per day, and fewer interruptions let people stay in flow longer. But collaboration takes a hit because the quick hallway conversations and lunch chats that spark ideas don't happen over Slack. The real challenge isn't choosing remote or office — it's designing a workflow that enables both focused solo work and meaningful team connection. One practical approach: reserve synchronous meetings for decisions and brainstorming, and move status updates and feedback to async channels."

Now expand this — stay on topic and keep it proportional:
"""
${content}
"""

Output:`,
};

// ── Output cleaner ─────────────────────────────────────────────────

function extractOutput(raw: string): string {
  let text = raw;

  text = text
    .replace(
      /^(here( is| are|'s| you go| ya go)?[!.,]?\s*|sure[!.,]?\s*|certainly[!.,]?\s*|of course[!.,]?\s*|absolutely[!.,]?\s*|great question[!.,]?\s*)(the |a |your |an )?\s*/i,
      "",
    )
    .replace(
      /^(improved|edited|summarized|condensed|expanded|enriched|enhanced|rewritten|polished)( version| note| text| content| result| summary| draft)?[:\-]?\s*/i,
      "",
    );

  text = text
    .replace(
      /\s*(hope this helps[!.]?|let me know[^.]*\.?|lmk[^.]*\.?|feel free[^.]*\.?)$/i,
      "",
    )
    .replace(/\s*\n---\s*\n?[\s\S]*$/, "");

  text = text
    .replace(/^```[a-z]*\s*\n?/i, "")
    .replace(/\n?\s*```$/i, "")
    .replace(/^["']{3}\s*/i, "")
    .replace(/\s*["']{3}$/i, "");

  return text.trim();
}

// ── Gemini caller ──────────────────────────────────────────────────

async function callGemini(prompt: string, type: string): Promise<string> {
  const model = getGeminiModel(SYSTEM_INSTRUCTION);

  const generationConfig: Record<string, unknown> = {
    topP: 0.92,
    topK: type === "improve" ? 20 : 40,
    maxOutputTokens: 1024,
    stopSequences:
      type === "expand"
        ? []
        : ["\n\nNote", "\n\nInput", "\n\n---", "\n\nExample"],
  };

  switch (type) {
    case "improve":
      generationConfig.temperature = 0.1;
      break;
    case "expand":
      generationConfig.temperature = 0.8;
      break;
  }

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig,
  });
  const rawText = result.response.text();

  if (!rawText) throw new Error("Gemini returned empty response");
  return rawText;
}

// ── OpenAI fallback ────────────────────────────────────────────────

async function callOpenAI(prompt: string, type: string): Promise<string> {
  const openai = getOpenAIClient();
  if (!openai) throw new Error("OPENAI_API_KEY not configured");

  const temperatures: Record<string, number> = {
    improve: 0.1,
    expand: 0.8,
  };

  const completion = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    temperature: temperatures[type] ?? 0.4,
    max_tokens: 1024,
    messages: [
      { role: "system", content: SYSTEM_INSTRUCTION },
      { role: "user", content: prompt },
    ],
  });

  const rawText = completion.choices[0]?.message?.content;
  if (!rawText) throw new Error("OpenAI returned empty response");
  return rawText;
}

// ── Main handler ───────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    // --- Auth & quota checks ---
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tier = await getUserSubscriptionTier(userId);

    const remaining = await getAISuggestionsRemaining(userId, tier);
    if (remaining <= 0) {
      return NextResponse.json(
        {
          error: "AI suggestion limit reached",
          message:
            tier === "free"
              ? "You've used all 30 AI suggestions for this month. Upgrade to Basic for 300/month."
              : tier === "basic"
                ? "You've used all 300 AI suggestions for this month. Upgrade to Pro for 1,500/month."
                : "You've reached your AI suggestion limit for this period.",
          aiSuggestionsRemaining: 0,
        },
        { status: 429 },
      );
    }

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
        },
      );
    }

    // --- Validate input ---
    const body = await request.json();
    const { content, type } = aiSuggestionSchema.parse(body);

    const promptBuilder = PROMPTS[type];
    if (!promptBuilder) {
      return NextResponse.json(
        { error: `Invalid suggestion type: ${type}` },
        { status: 400 },
      );
    }

    const prompt = promptBuilder(content);

    // --- Primary: Gemini → fallback: OpenAI gpt-4o-mini ---
    let rawText: string | null = null;
    let usedFallback = false;

    // Try Gemini first
    try {
      rawText = await callGemini(prompt, type);
    } catch (geminiError) {
      console.warn("Gemini failed, falling back to OpenAI:", geminiError);

      if (!shouldFallbackToOpenAI(geminiError)) {
        // Not a quota issue — rethrow so the outer catch handles it
        throw geminiError;
      }

      // Fallback to OpenAI
      try {
        rawText = await callOpenAI(prompt, type);
        usedFallback = true;
      } catch (openaiError) {
        console.error("OpenAI fallback also failed:", openaiError);
        return NextResponse.json(
          {
            error: "Both AI providers failed",
            message:
              "Gemini quota exhausted and OpenAI fallback also failed. Please try again later.",
          },
          { status: 429 },
        );
      }
    }

    if (!rawText) {
      return NextResponse.json(
        { error: "Failed to generate suggestion" },
        { status: 500 },
      );
    }

    const suggestion = extractOutput(rawText);

    if (!suggestion) {
      return NextResponse.json(
        { error: "Generated output was empty after cleaning" },
        { status: 500 },
      );
    }

    const newRemaining = await incrementAISuggestionsCount(userId, tier);

    return NextResponse.json({
      suggestion,
      aiSuggestionsRemaining: newRemaining,
      ...(usedFallback ? { provider: "openai" } : { provider: "gemini" }),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 },
      );
    }

    console.error("Error generating AI suggestion:", error);

    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return NextResponse.json({ error: error.message }, { status: 401 });
      }

      if (
        error.message.includes("429") ||
        error.message.includes("quota") ||
        error.message.includes("rate limit")
      ) {
        return NextResponse.json(
          {
            error: "Quota exceeded",
            message:
              "Both Gemini and OpenAI quotas are exhausted. Please try again later.",
          },
          { status: 429 },
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to generate AI-powered note enhancement" },
      { status: 500 },
    );
  }
}
