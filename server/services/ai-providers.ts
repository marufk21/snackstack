import "server-only";
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

// ── Model constants ──────────────────────────────────────────────────────

export const GEMINI_MODEL = "gemini-2.5-flash" as const;
export const OPENAI_MODEL = "gpt-4o-mini" as const;

// ── Gemini ───────────────────────────────────────────────────────────────

let genAI: GoogleGenerativeAI | null = null;

export function getGeminiClient(): GoogleGenerativeAI {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY not configured");
  }
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
}

/** Convenience: get a pre-configured Gemini generative model. */
export function getGeminiModel(systemInstruction: string) {
  return getGeminiClient().getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction,
  });
}

// ── OpenAI ───────────────────────────────────────────────────────────────

let openai: OpenAI | null | undefined;

export function getOpenAIClient(): OpenAI | null {
  if (openai === undefined) {
    openai = process.env.OPENAI_API_KEY
      ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
      : null;
  }
  return openai;
}

// ── Fallback logic ───────────────────────────────────────────────────────

const FAIL_PATTERNS = ["429", "quota", "RESOURCE_EXHAUSTED", "rate limit"];

export function shouldFallbackToOpenAI(error: unknown): boolean {
  if (!(error instanceof Error)) return true;
  const msg = error.message.toLowerCase();
  return FAIL_PATTERNS.some((p) => msg.includes(p.toLowerCase()));
}
