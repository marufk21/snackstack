import "server-only";
import { streamWithFallback, toLangChainMessages, type ChatMessage } from "@/server/services/langchain";

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

// ── Public interface ─────────────────────────────────────────────────────

export async function createChatStream(options: {
  messages: ChatMessage[];
  noteTitle?: string;
  noteContent?: string;
}): Promise<ReadableStream<string>> {
  const { messages, noteTitle = "", noteContent = "" } = options;

  if (messages.length === 0) throw new Error("No messages provided");

  const systemInstruction = buildSystemPrompt(noteTitle, noteContent);
  const lcMessages = toLangChainMessages(messages, systemInstruction);

  // Manual fallback: Gemini primary → OpenAI if Gemini times out or errors.
  // Using streamWithFallback instead of withFallbacks() because
  // @langchain/google-genai hangs on 429/quota errors instead of throwing.
  return new ReadableStream({
    async start(controller) {
      try {
        const stream = streamWithFallback(lcMessages, {
          temperature: 0.4,
          maxOutputTokens: 1024,
        });

        for await (const text of stream) {
          controller.enqueue(text);
        }
        controller.close();
      } catch (error) {
        console.error("[SnackAI] Stream error:", error);
        controller.error(error);
      }
    },
  });
}
