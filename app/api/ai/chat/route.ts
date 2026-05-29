import { auth } from "@/server/auth/config";
import { NextRequest } from "next/server";
import { z } from "zod";
import { createChatStream } from "@/server/api/ai-chat";
import {
  getUserSubscriptionTier,
  getAISuggestionsRemaining,
  incrementAISuggestionsCount,
} from "@/server/services/subscription";
import {
  aiSuggestionRateLimit,
  getUserIdentifier,
} from "@/server/utils/rate-limit";

export const runtime = "nodejs";

const chatSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    }),
  ),
  noteId: z.string().optional().nullable(),
  noteTitle: z.string().optional(),
  noteContent: z.string().optional(),
});

function normalizeMessages(msgs: z.infer<typeof chatSchema>["messages"]) {
  return msgs.map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));
}

export async function POST(req: NextRequest) {
  try {
    // ── Auth ────────────────────────────────────────────────────────
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    // ── Rate limit ──────────────────────────────────────────────────
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded
      ? forwarded.split(",")[0]
      : req.headers.get("x-real-ip") || "unknown";
    const userIdentifier = getUserIdentifier(userId, ip);
    const rateLimitResult = aiSuggestionRateLimit.check(userIdentifier);

    if (!rateLimitResult.allowed) {
      const resetTime = rateLimitResult.resetTime
        ? Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        : 60;
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please try again later.", retryAfter: resetTime }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": resetTime.toString(),
          },
        },
      );
    }

    // ── Subscription tier check ─────────────────────────────────────
    const tier = await getUserSubscriptionTier(userId);
    const remaining = await getAISuggestionsRemaining(userId, tier);

    if (remaining <= 0) {
      const message =
        tier === "free"
          ? "You've used all 30 AI requests for this month. Upgrade to Basic for 300/month."
          : tier === "basic"
            ? "You've used all 300 AI requests for this month. Upgrade to Pro for 1,500/month."
            : "You've reached your AI request limit for this period.";

      return new Response(
        JSON.stringify({ error: "AI limit reached", message, aiRemaining: 0 }),
        { status: 429, headers: { "Content-Type": "application/json" } },
      );
    }

    // ── Validate input ──────────────────────────────────────────────
    if (!process.env.GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Gemini API key not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    const body = await req.json();
    const parsed = chatSchema.parse(body);
    const messages = normalizeMessages(parsed.messages);

    const tokenStream = await createChatStream({
      messages,
      noteTitle: parsed.noteTitle || undefined,
      noteContent: parsed.noteContent || undefined,
    });

    // ── SSE wrapper with usage tracking ─────────────────────────────
    const encoder = new TextEncoder();
    let aiCountIncremented = false;

    const sseStream = new ReadableStream({
      async start(controller) {
        try {
          const reader = tokenStream.getReader();

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ t: value })}\n\n`),
            );
          }

          // Stream completed successfully → count this usage
          await incrementAISuggestionsCount(userId, tier);
          aiCountIncremented = true;

          const newRemaining = await getAISuggestionsRemaining(userId, tier);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ aiRemaining: newRemaining })}\n\n`,
            ),
          );
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          console.error("[SnackAI] SSE stream error:", error);
          // Still increment — the user already consumed the request
          if (!aiCountIncremented) {
            await incrementAISuggestionsCount(userId, tier).catch(() => {});
          }
          controller.error(error);
        }
      },
    });

    return new Response(sseStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: "Validation error", details: error.issues }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    console.error("[SnackAI] Chat error:", error);

    return new Response(
      JSON.stringify({ error: "Failed to process chat request" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
