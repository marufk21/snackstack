import { z } from "zod";
import { auth } from "@/server/auth/config";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  aiSuggestionRateLimit,
  getUserIdentifier,
} from "@/server/utils/rate-limit";
import {
  getUserSubscriptionTier,
  getAISuggestionsRemaining,
  incrementAISuggestionsCount,
} from "@/server/services/subscription";

const getGemini = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Gemini API key not configured");
  }
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
};

const aiSuggestionSchema = z.object({
  content: z.string().min(1, "Content is required"),
  type: z.enum(["improve", "summarize", "expand"]).default("improve"),
});

const SYSTEM_INSTRUCTION = `You are a thinking partner embedded in SnackStack, a notes app. Your job: help users write better notes by editing, condensing, or expanding their thoughts.

Golden rules:
- Return ONLY the final output. No intros, no sign-offs, no "Here you go," no code blocks, no quotation wrapping.
- The user's voice is sacred. Casual stays casual. Technical stays technical. A one-line todo stays a one-line todo.
- Never invent facts, dates, names, stats, or citations. Derive only what the text reasonably implies.
- Match the input language. Hindi input → Hindi output. Mixed input → stay in the primary language.
- Use light Markdown (bullets, **bold**, *italic*) only when it genuinely helps readability.
- If the input is already optimal, return it exactly as-is. Doing nothing is better than making it worse.`;

const PROMPTS: Record<string, (content: string) => string> = {
  improve: (content: string) =>
    `Edit this note for clarity, grammar, and flow.

What to fix:
- Spelling, grammar, punctuation
- Run-on sentences → break them up. Choppy fragments → connect them.
- Filler words: "very", "really", "just", "basically", "actually", "kind of", "sort of"
- Weak constructions: "there is/are", "it is/was that", "in order to"
- Wordiness — cut until every word earns its place

What to leave alone:
- The meaning, the ideas, the conclusion
- The author's voice — don't formalize casual writing
- Short functional notes (todos, reminders, lists)
- Bullet points — keep them as bullets unless they're clearly meant as prose

Example:
Input: "i think we should probly refactor the auth module becuase its getting to complecated and hard to maintain, also the tests are failin"
Output: "We should probably refactor the auth module — it's getting too complicated and hard to maintain. The tests are also failing."

Now edit this:
"""
${content}
"""

Output:`,
  summarize: (content: string) =>
    `Condense this note to its essentials.

Guidelines:
- 2+ distinct points → use bullet points. Single idea → one tight paragraph.
- Strip: greetings, filler, digressions, repetition, "I think that", "It's worth noting that"
- Keep: the core claim, supporting evidence, action items, deadlines, decisions
- ~30-50% of original length. But don't crush a 2-sentence note into gibberish.
- Preserve dates, names, numbers, links exactly

Example:
Input: "Had a call with the design team today. They brought up some good points about the onboarding flow. Basically, users are dropping off at step 3 because the form asks for too much info at once. We should probably split it into multiple steps. Also, Sarah mentioned that the color contrast on the buttons doesn't meet WCAG standards, which we need to fix before the next release."
Output:
- Users drop off at onboarding step 3 — form asks too much at once → split into multiple steps
- Button color contrast fails WCAG → fix before next release

Now condense this:
"""
${content}
"""

Output:`,
  expand: (content: string) =>
    `Enrich this note with genuine depth. Do not pad — add insight.

Pick the strategies that fit best (1-3, not all):
1. Why does this matter? Answer it concretely.
2. Give a vivid example or analogy.
3. What's a second-order consequence or hidden implication?
4. What's the strongest counterargument or alternative view?
5. What's the natural next step or action?

Then blend everything into one seamless note. The reader should not be able to tell where the original ends and your addition begins.

Example:
Input: "Remote work improves productivity but hurts collaboration."
Output: "Remote work improves productivity but hurts collaboration. The productivity gain is real — no commute, fewer interruptions, 2-3 extra hours of deep work per day. But collaboration suffers because the spontaneous conversations that happen in hallways and over lunch don't replicate over Slack. The real question isn't remote versus office — it's how to design for both focus and connection. One approach: make synchronous meetings rare and intentional, and move everything else to async."

Now enrich this:
"""
${content}
"""

Output:`,
};

function extractOutput(raw: string): string {
  let text = raw;

  // Strip common preamble patterns
  text = text
    .replace(
      /^(here( is| are|'s| you go| ya go)?[!.,]?\s*|sure[!.,]?\s*|certainly[!.,]?\s*|of course[!.,]?\s*|absolutely[!.,]?\s*|great question[!.,]?\s*)(the |a |your |an )?\s*/i,
      ""
    )
    .replace(
      /^(improved|edited|summarized|condensed|expanded|enriched|enhanced|rewritten|polished)( version| note| text| content| result| summary| draft)?[:\-]?\s*/i,
      ""
    );

  // Strip trailing pleasantries
  text = text
    .replace(/\s*(hope this helps[!.]?|let me know[^.]*\.?|lmk[^.]*\.?|feel free[^.]*\.?)$/i, "")
    .replace(/\s*\n---\s*\n?[\s\S]*$/, "");

  // Strip code fences and quote wrappers
  text = text
    .replace(/^```[a-z]*\s*\n?/i, "")
    .replace(/\n?\s*```$/i, "")
    .replace(/^["']{3}\s*/i, "")
    .replace(/\s*["']{3}$/i, "");

  return text.trim();
}

export async function POST(request: NextRequest) {
  try {
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
        { status: 429 }
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

    const promptBuilder = PROMPTS[type];
    if (!promptBuilder) {
      return NextResponse.json(
        { error: `Invalid suggestion type: ${type}` },
        { status: 400 }
      );
    }

    const genAI = getGemini();

    const generationConfig: Record<string, unknown> = {
      topP: 0.92,
      topK: type === "improve" ? 20 : 40,
      maxOutputTokens: type === "summarize" ? 512 : 1024,
      stopSequences: type === "expand"
        ? []
        : ["\n\nNote", "\n\nInput", "\n\n---", "\n\nExample"],
    };

    switch (type) {
      case "improve":
        generationConfig.temperature = 0.1;
        break;
      case "summarize":
        generationConfig.temperature = 0.4;
        break;
      case "expand":
        generationConfig.temperature = 0.8;
        break;
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION,
      generationConfig,
    });

    const prompt = promptBuilder(content);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text();

    if (!rawText) {
      return NextResponse.json(
        { error: "Failed to generate suggestion" },
        { status: 500 }
      );
    }

    const suggestion = extractOutput(rawText);

    if (!suggestion) {
      return NextResponse.json(
        { error: "Generated output was empty after cleaning" },
        { status: 500 }
      );
    }

    const newRemaining = await incrementAISuggestionsCount(userId, tier);

    return NextResponse.json({
      suggestion,
      aiSuggestionsRemaining: newRemaining,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error generating AI suggestion:", error);

    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return NextResponse.json(
          { error: "Invalid Gemini API key" },
          { status: 401 }
        );
      }

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
