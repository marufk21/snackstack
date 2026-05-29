import { useState, useRef, useCallback, useEffect } from "react";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export type ChatStatus = "ready" | "submitted" | "streaming" | "error";

interface UseLangChatOptions {
  noteId?: string | null;
  noteTitle?: string;
  noteContent?: string;
}

export function useLangChat(options: UseLangChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>("ready");
  const [error, setError] = useState<Error | null>(null);
  const [aiRemaining, setAiRemaining] = useState<number | null>(null);
  const messagesRef = useRef<ChatMessage[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  // Keep ref in sync so sendMessage always has latest messages
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || status === "submitted" || status === "streaming") return;

      // Abort any previous in-flight request
      abortRef.current?.abort();
      const abortController = new AbortController();
      abortRef.current = abortController;

      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: text,
      };
      const assistantId = crypto.randomUUID();
      const assistantMsg: ChatMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setStatus("submitted");
      setError(null);

      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: abortController.signal,
          body: JSON.stringify({
            messages: [...messagesRef.current, userMsg].map((m) => ({
              role: m.role,
              content: m.content,
            })),
            noteId: options.noteId ?? null,
            noteTitle: options.noteTitle ?? "",
            noteContent: options.noteContent ?? "",
          }),
        });

        if (!res.ok) {
          const errBody = await res.json().catch(() => null);
          throw new Error(errBody?.error || `Request failed (${res.status})`);
        }

        if (!res.body) throw new Error("Response body is empty");

        setStatus("streaming");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6).trim();
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              if (typeof parsed.t === "string" && parsed.t) {
                setMessages((prev) => {
                  const updated = [...prev];
                  const last = updated[updated.length - 1];
                  if (last?.id === assistantId) {
                    updated[updated.length - 1] = {
                      ...last,
                      content: last.content + parsed.t,
                    };
                  }
                  return updated;
                });
              }
              if (typeof parsed.aiRemaining === "number") {
                setAiRemaining(parsed.aiRemaining);
              }
            } catch {
              // skip malformed JSON lines
            }
          }
        }

        setStatus("ready");
      } catch (err) {
        if (abortController.signal.aborted) return; // intentional abort, ignore
        setError(err instanceof Error ? err : new Error(String(err)));
        setStatus("error");
      }
    },
    [options.noteId, options.noteTitle, options.noteContent, status],
  );

  const clearMessages = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setStatus("ready");
    setError(null);
  }, []);

  return { messages, sendMessage, status, error, aiRemaining, clearMessages };
}
