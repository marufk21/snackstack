"use client";

import React, { useRef, useEffect, useState } from "react";
import { useLangChat } from "@/hooks/use-lang-chat";
import { ChatMarkdown } from "@/components/dashboard/chat-markdown";
import { X, Loader2, Sparkles, Send, MessageCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import { m, AnimatePresence } from "framer-motion";

interface AiChatPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  noteId?: string | null;
  noteTitle?: string;
  noteContent?: string;
}

export function AiChatPanel({
  isOpen,
  onToggle,
  noteId,
  noteTitle,
  noteContent,
}: AiChatPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");

  const { messages, sendMessage, status, error, aiRemaining } = useLangChat({
    noteId,
    noteTitle,
    noteContent,
  });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const suggestedActions = [
    { label: "Summarize", prompt: "Summarize this note in 2-3 lines." },
    { label: "Action items", prompt: "List action items from this note as bullet points." },
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="w-full h-full border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col overflow-hidden shadow-lg"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-r from-cyan-600 to-emerald-500 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                SnackAI
              </span>
              {aiRemaining != null && (
                <span
                  className={cn(
                    "text-[11px] px-1.5 py-0.5 rounded-full font-medium",
                    aiRemaining <= 5
                      ? "bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400"
                      : aiRemaining <= 20
                        ? "bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400",
                  )}
                >
                  {aiRemaining === Infinity ? "∞" : `${aiRemaining} left`}
                </span>
              )}
            </div>
            <button
              onClick={onToggle}
              className="h-7 w-7 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center transition-colors text-zinc-500 dark:text-zinc-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="w-6 h-6 text-zinc-300 dark:text-zinc-600" />
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                  Ask me anything about this note
                </p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                  I can summarize, find action items, or improve your writing
                </p>
              </div>
            )}

            {messages.map((msg) => {
              const isEmpty = msg.role === "assistant" && msg.content === "";

              // Skip rendering empty assistant placeholder — show dots instead
              if (isEmpty && isLoading) return null;

              return (
                <div
                  key={msg.id}
                  className={cn(
                    "flex items-start gap-2.5",
                    msg.role === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  {msg.role === "assistant" && (
                    <div className="w-6 h-6 rounded-md bg-gradient-to-r from-cyan-600 to-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "rounded-xl px-3 py-2 text-sm max-w-[85%]",
                      msg.role === "user"
                        ? "bg-gradient-to-r bg-cyan-600 to-emerald-500 text-white"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100",
                    )}
                  >
                    {msg.role === "assistant" ? (
                      <ChatMarkdown content={msg.content} />
                    ) : (
                      <p className="whitespace-pre-wrap leading-relaxed">
                        {msg.content}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Loading indicator — shown only while waiting for first token */}
            {isLoading &&
              messages.length > 0 &&
              messages[messages.length - 1]?.role === "assistant" &&
              messages[messages.length - 1]?.content === "" && (
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-r from-cyan-600 to-emerald-500 flex items-center justify-center shrink-0">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800">
                    <span
                      className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"
                      style={{ animationDelay: "0.15s" }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"
                      style={{ animationDelay: "0.3s" }}
                    />
                  </div>
                </div>
              )}

            {error && (
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-red-500 flex items-center justify-center shrink-0">
                  <X className="w-3 h-3 text-white" />
                </div>
                <div className="rounded-xl px-3 py-2 text-sm bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 max-w-[85%]">
                  <p>Failed to get response. Please try again.</p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Actions */}
          {messages.length === 0 && (
            <div className="px-4 pb-2 space-y-1.5 shrink-0">
              <p className="text-[11px] text-zinc-400 dark:text-zinc-500 px-1 uppercase tracking-wide font-medium">
                Suggested
              </p>
              {suggestedActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => sendMessage(action.prompt)}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-4 py-3 border-t border-zinc-200 dark:border-zinc-800 shrink-0">
            <form
              onSubmit={handleFormSubmit}
              className="flex items-center gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about this note..."
                disabled={isLoading}
                className="flex-1 h-9 px-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 border-none outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="h-9 w-9 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white flex items-center justify-center transition-colors disabled:opacity-50 shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </form>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
