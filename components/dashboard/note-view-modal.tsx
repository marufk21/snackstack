"use client";

import React, { useEffect, useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateNote, type Note, generateAiSuggestion } from "@/server/api";
import { useAppStore } from "@/stores/use-app-store";
import { X, Loader2, ImageIcon, Wand2, Type, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useImageUpload } from "@/hooks/use-image-upload";
import { motion, AnimatePresence } from "framer-motion";

interface NoteViewModalProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
}

interface Notification {
  message: string;
  type: "success" | "warning" | "error";
}

export function NoteViewModal({ note, isOpen, onClose }: NoteViewModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);

  const { addNotification } = useAppStore();
  const queryClient = useQueryClient();
  const { uploadImage, isUploading } = useImageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize form data when note changes
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setImageUrl(note.imageUrl || null);
      setIsDirty(false);
    }
  }, [note]);

  const showNotification = (message: string, type: Notification["type"] = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Auto-save mutation
  const saveMutation = useMutation({
    mutationFn: async (data: {
      title: string;
      content: string;
      imageUrl?: string;
    }) => {
      if (!note?.id) return;
      return updateNote(note.id, data);
    },
    onMutate: () => {
      setIsSaving(true);
    },
    onSuccess: () => {
      setIsDirty(false);
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      showNotification("Note saved!");
    },
    onError: (error) => {
      console.error("Error saving note:", error);
      showNotification("Failed to save note", "error");
    },
    onSettled: () => {
      setIsSaving(false);
    },
  });

  // AI suggestion mutation
  const aiSuggestionMutation = useMutation({
    mutationFn: async (type: "improve" | "continue" | "summarize") => {
      return generateAiSuggestion({ content, type });
    },
    onMutate: () => {
      setIsGeneratingAI(true);
    },
    onSuccess: (suggestion, variables) => {
      if (suggestion) {
        if (variables === "summarize") {
          showNotification("Summary: " + suggestion.substring(0, 100) + "...");
        } else {
          setContent(suggestion);
          setIsDirty(true);
          showNotification(
            variables === "improve" ? "Content improved!" : "Content continued!"
          );
        }
      }
    },
    onError: (error) => {
      console.error("Error generating AI suggestion:", error);
      showNotification("Failed to generate AI suggestion", "error");
    },
    onSettled: () => {
      setIsGeneratingAI(false);
    },
  });

  // Handle save
  const handleSave = async () => {
    if (title.trim() && note?.id) {
      saveMutation.mutate({
        title: title.trim(),
        content,
        imageUrl: imageUrl || undefined,
      });
    }
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showNotification("Please select an image file", "error");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      showNotification("Image size must be less than 5MB", "error");
      return;
    }

    try {
      const result = await uploadImage(file);
      if (result) {
        setImageUrl(result.secure_url);
        setIsDirty(true);
        showNotification("Image uploaded!");
      } else {
        showNotification("Failed to upload image", "error");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      showNotification("Failed to upload image", "error");
    } finally {
      // Reset the file input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleAiAction = async (type: "improve" | "continue" | "summarize") => {
    if (!content.trim()) {
      showNotification("Please write some content first", "warning");
      return;
    }
    aiSuggestionMutation.mutate(type);
  };

  const autoResize = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    target.style.height = "auto";
    target.style.height = target.scrollHeight + "px";
  };

  if (!note) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-3xl h-[90vh] bg-white dark:bg-zinc-900 rounded-xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Single Scrollable Container */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
              {/* Cover Image */}
              {imageUrl && (
                <div className="relative w-full group">
                  <img
                    src={imageUrl}
                    alt="Cover"
                    className="w-full h-48 object-cover"
                  />
                  <button
                    className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    onClick={() => {
                      setImageUrl(null);
                      setIsDirty(true);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Content Area */}
              <div className="px-6 py-4 space-y-3">
                {/* Title */}
                <textarea
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setIsDirty(true);
                    autoResize(e);
                  }}
                  onInput={autoResize}
                  placeholder="Title"
                  rows={1}
                  className="w-full resize-none bg-transparent text-xl font-medium text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 border-none focus:ring-0 p-0 leading-snug outline-none"
                  style={{ overflow: "hidden" }}
                />

                {/* Content */}
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    setIsDirty(true);
                    autoResize(e);
                  }}
                  onInput={autoResize}
                  placeholder="Take a note..."
                  rows={12}
                  className="w-full resize-none bg-transparent text-base text-zinc-700 dark:text-zinc-300 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 border-none focus:ring-0 p-0 leading-relaxed outline-none"
                  style={{ overflow: "hidden" }}
                />

                {/* Bottom Spacer */}
                <div className="h-20" />
              </div>
            </div>

            {/* Floating Toolbar - Bottom */}
              <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  {/* Left Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="h-9 px-3 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded flex items-center gap-2 transition-colors disabled:opacity-50"
                      title="Add image"
                    >
                      {isUploading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <ImageIcon className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium">Image</span>
                    </button>

                    <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 mx-1" />

                    <button
                      onClick={() => handleAiAction("improve")}
                      disabled={isGeneratingAI}
                      className="h-9 px-3 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded flex items-center gap-2 transition-colors disabled:opacity-50"
                      title="Improve with AI"
                    >
                      <Wand2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Improve</span>
                    </button>

                    <button
                      onClick={() => handleAiAction("continue")}
                      disabled={isGeneratingAI}
                      className="h-9 px-3 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded flex items-center gap-2 transition-colors disabled:opacity-50"
                      title="Continue writing"
                    >
                      <Type className="w-4 h-4" />
                      <span className="text-sm font-medium">Continue</span>
                    </button>

                    <button
                      onClick={() => handleAiAction("summarize")}
                      disabled={isGeneratingAI}
                      className="h-9 px-3 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded flex items-center gap-2 transition-colors disabled:opacity-50"
                      title="Summarize"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span className="text-sm font-medium">Summarize</span>
                    </button>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={onClose}
                      className="h-9 px-4 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-sm font-medium"
                    >
                      Close
                    </button>
                    {isDirty && (
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="h-9 px-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-full transition-colors text-sm font-medium flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {isSaving ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Done
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* AI Loading Indicator */}
                {isGeneratingAI && (
                  <div className="mt-2 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-zinc-900 dark:bg-zinc-100 w-3/5 animate-pulse" />
                  </div>
                )}
              </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />

            {/* Notification Toast */}
            <AnimatePresence>
              {notification && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="fixed top-4 right-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 rounded-lg shadow-lg text-sm font-medium z-[60]"
                >
                  {notification.message}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
