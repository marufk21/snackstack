import "server-only";
import {
  getGeminiClient,
  getOpenAIClient,
  shouldFallbackToOpenAI,
  GEMINI_MODEL,
  OPENAI_MODEL,
} from "@/server/services/ai-providers";

// ── System prompt ────────────────────────────────────────────────────────

function buildSystemPrompt(noteTitle: string, noteContent: string): string {
  let prompt = `You are SnackAI, a concise assistant in SnackStack. Rules:
- Keep responses 2-4 lines unless the user asks for detail.
- Use bullet points only when listing distinct items.
- Match the user's language and tone.
- Never invent facts, names, or stats.
- No greetings, no sign-offs, no filler phrases.
- When editing text, return only the result — no commentary.`;

  if (noteTitle) prompt += `\n\nCurrent note: "${noteTitle}"`;
  if (noteContent) {
    const preview =
      noteContent.length > 2000
        ? noteContent.slice(0, 2000) + "..."
        : noteContent;
    prompt += `\n\nNote content:\n"""\n${preview}\n"""`;
  }

  return prompt;
}

// ── Stream helpers ───────────────────────────────────────────────────────

interface GeminiChatSession {
  sendMessageStream(
    query: string,
  ): Promise<{ stream: AsyncGenerator<{ text: () => string }> }>;
}

async function streamGemini(
  controller: ReadableStreamDefaultController<string>,
  chat: GeminiChatSession,
  query: string,
) {
  const result = await chat.sendMessageStream(query);
  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) controller.enqueue(text);
  }
}

async function streamOpenAI(
  controller: ReadableStreamDefaultController<string>,
  systemInstruction: string,
  messages: { role: ChatRole; content: string }[],
) {
  const openai = getOpenAIClient()!;
  const stream = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    temperature: 0.4,
    max_tokens: 1024,
    messages: [
      { role: "system" as const, content: systemInstruction },
      ...messages.map((m) => ({
        role: (m.role === "user" ? "user" : "assistant") as
          | "user"
          | "assistant",
        content: m.content,
      })),
    ],
    stream: true,
  });

  for await (const chunk of stream) {
    const text = chunk.choices[0]?.delta?.content;
    if (text) controller.enqueue(text);
  }
}

// ── Public interface ─────────────────────────────────────────────────────

export type ChatRole = "user" | "assistant";

export async function createChatStream(options: {
  messages: { role: ChatRole; content: string }[];
  noteTitle?: string;
  noteContent?: string;
}): Promise<ReadableStream<string>> {
  const { messages: rawMessages, noteTitle = "", noteContent = "" } = options;

  const systemInstruction = buildSystemPrompt(noteTitle, noteContent);

  const historyMessages = rawMessages.slice(0, -1);
  const lastMsg = rawMessages[rawMessages.length - 1];
  if (!lastMsg) throw new Error("No messages provided");

  const history = historyMessages.map((m) => ({
    role: (m.role === "user" ? "user" : "model") as "user" | "model",
    parts: [{ text: m.content }],
  }));

  const genAI = getGeminiClient();
  const chat = genAI
    .getGenerativeModel({ model: GEMINI_MODEL, systemInstruction })
    .startChat({ history: history.length > 0 ? history : undefined });

  const query = lastMsg.content;

  return new ReadableStream({
    async start(controller) {
      // ── Primary: Gemini ──
      try {
        await streamGemini(controller, chat, query);
        controller.close();
        return;
      } catch (geminiError) {
        console.warn("[SnackAI] Gemini failed:", geminiError);
        if (!shouldFallbackToOpenAI(geminiError)) {
          controller.error(geminiError);
          return;
        }
      }

      // ── Fallback: OpenAI ──
      const openai = getOpenAIClient();
      if (!openai) {
        controller.error(
          new Error("Gemini unavailable and OPENAI_API_KEY not configured"),
        );
        return;
      }

      try {
        await streamOpenAI(controller, systemInstruction, rawMessages);
        controller.close();
      } catch (openaiError) {
        console.error("[SnackAI] OpenAI fallback failed:", openaiError);
        controller.error(openaiError);
      }
    },
  });
}
