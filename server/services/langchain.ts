import "server-only";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, AIMessage, SystemMessage, type BaseMessage } from "langchain";

// ── Model constants ──────────────────────────────────────────────────────

export const GEMINI_MODEL = "gemini-2.5-flash" as const;
export const OPENAI_MODEL = "gpt-4o-mini" as const;

// ── Config ────────────────────────────────────────────────────────────────

export interface ChatModelConfig {
  temperature?: number;
  maxOutputTokens?: number;
  topP?: number;
  topK?: number;
  stopSequences?: string[];
}

// ── Model factory ─────────────────────────────────────────────────────────

function createGemini(config?: ChatModelConfig) {
  return new ChatGoogleGenerativeAI({
    model: GEMINI_MODEL,
    apiKey: process.env.GEMINI_API_KEY,
    temperature: config?.temperature ?? 0.4,
    maxOutputTokens: config?.maxOutputTokens ?? 1024,
    topP: config?.topP ?? 0.92,
    topK: config?.topK,
    stopSequences: config?.stopSequences,
  });
}

function createOpenAI(config?: ChatModelConfig) {
  return new ChatOpenAI({
    model: OPENAI_MODEL,
    apiKey: process.env.OPENAI_API_KEY,
    temperature: config?.temperature ?? 0.4,
    maxTokens: config?.maxOutputTokens ?? 1024,
  });
}

// ── Streaming (race both providers) ───────────────────────────────────────

/**
 * Stream from Gemini AND OpenAI simultaneously — first to respond wins.
 * No 12-second wait if Gemini hangs on 429.
 */
export async function* streamWithFallback(
  messages: BaseMessage[],
  config?: ChatModelConfig,
): AsyncGenerator<string> {
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);

  if (!hasOpenAI) {
    const model = createGemini(config);
    const stream = await model.stream(messages);
    for await (const chunk of stream) {
      const t = typeof chunk.content === "string" ? chunk.content : "";
      if (t) yield t;
    }
    return;
  }

  // Start both streams in parallel
  const geminiStream = createGemini(config)
    .stream(messages)
    .catch(() => null);
  const openaiStream = createOpenAI(config)
    .stream(messages)
    .catch(() => null);

  const [gStream, oStream] = await Promise.all([geminiStream, openaiStream]);

  if (!gStream && !oStream) {
    throw new Error("Both Gemini and OpenAI failed to create stream");
  }

  // Race: first token from either provider wins
  const gNext = gStream
    ? gStream[Symbol.asyncIterator]().next().then((r) => ({ ...r, stream: gStream }))
    : new Promise<never>(() => {});
  const oNext = oStream
    ? oStream[Symbol.asyncIterator]().next().then((r) => ({ ...r, stream: oStream }))
    : new Promise<never>(() => {});

  const first = await Promise.race([gNext, oNext]).catch(() => null);

  if (!first || first.done) {
    throw new Error("Both providers returned empty streams");
  }

  // Yield first token
  const t = typeof first.value?.content === "string" ? first.value.content : "";
  if (t) yield t;

  // Drain the winning stream
  for await (const chunk of first.stream) {
    const text = typeof chunk.content === "string" ? chunk.content : "";
    if (text) yield text;
  }
}

// ── Non-streaming (race both providers) ───────────────────────────────────

/**
 * Fire Gemini and OpenAI simultaneously — first response wins.
 * Instant fallback without waiting for a hung provider.
 */
export async function invokeWithFallback(
  messages: BaseMessage[],
  config?: ChatModelConfig,
): Promise<string> {
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);

  if (!hasOpenAI) {
    const r = await createGemini(config).invoke(messages);
    const t = typeof r.content === "string" ? r.content : "";
    if (!t) throw new Error("Gemini returned empty response");
    return t;
  }

  // Race both — first to respond wins
  const race = Promise.race([
    createGemini(config)
      .invoke(messages)
      .then((r) => ({ provider: "gemini" as const, text: typeof r.content === "string" ? r.content : "" })),
    createOpenAI(config)
      .invoke(messages)
      .then((r) => ({ provider: "openai" as const, text: typeof r.content === "string" ? r.content : "" })),
  ]);

  try {
    const winner = await race;
    if (winner.text) {
      console.log(`[LangChain] Invoke winner: ${winner.provider}`);
      return winner.text;
    }
  } catch {
    // One failed — wait for the other
  }

  // Fallback: wait for both, take whichever succeeded
  const [geminiResult, openaiResult] = await Promise.allSettled([
    createGemini(config)
      .invoke(messages)
      .then((r) => typeof r.content === "string" ? r.content : ""),
    createOpenAI(config)
      .invoke(messages)
      .then((r) => typeof r.content === "string" ? r.content : ""),
  ]);

  for (const r of [geminiResult, openaiResult]) {
    if (r.status === "fulfilled" && r.value) return r.value;
  }

  throw new Error("Both Gemini and OpenAI failed");
}

// ── Message helper ────────────────────────────────────────────────────────

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export function toLangChainMessages(
  messages: ChatMessage[],
  systemInstruction?: string,
): BaseMessage[] {
  const lcMessages: BaseMessage[] = [];

  if (systemInstruction) {
    lcMessages.push(new SystemMessage(systemInstruction));
  }

  for (const msg of messages) {
    if (msg.role === "user") {
      lcMessages.push(new HumanMessage(msg.content));
    } else {
      lcMessages.push(new AIMessage(msg.content));
    }
  }

  return lcMessages;
}
