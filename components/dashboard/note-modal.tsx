"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateNote, deleteNote, type Note } from "@/server/api/notes";
import { generateAiSuggestion } from "@/server/api/ai-suggestion";
import { useAppStore } from "@/stores/use-app-store";
import {
  X,
  Loader2,
  ImageIcon,
  Wand2,
  Trash2,
  BookOpen,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useImageUpload } from "@/hooks/use-image-upload";
import { useSubscription } from "@/hooks/use-subscription";
import { m, AnimatePresence } from "framer-motion";
import { AiChatPanel } from "@/components/dashboard/ai-chat-panel";

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
  const [activeAiAction, setActiveAiAction] = useState<
    "improve" | "expand" | null
  >(null);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);

  const { addNotification } = useAppStore();
  const queryClient = useQueryClient();
  const { uploadImage, isUploading } = useImageUpload();
  const { limits } = useSubscription();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize form data when note changes
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setImageUrl(note.imageUrl || null);
      setIsDirty(false);
      setIsAiChatOpen(false); // close AI chat when switching notes
      setShowDeleteConfirm(false); // dismiss any pending delete dialog
    }
  }, [note]);

  const showNotification = (
    message: string,
    type: Notification["type"] = "success",
  ) => {
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
    mutationFn: async (type: "improve" | "expand") => {
      return generateAiSuggestion({ content, type });
    },
    onMutate: (variables) => {
      setActiveAiAction(variables);
    },
    onSuccess: (suggestion, variables) => {
      if (suggestion) {
        setContent(suggestion);
        setIsDirty(true);
        showNotification(
          variables === "improve" ? "Content improved!" : "Content expanded!",
        );
      }
    },
    onError: (error) => {
      console.error("Error generating AI suggestion:", error);
      const message =
        error instanceof Error ? error.message : "Failed to generate AI suggestion";
      showNotification(message, "error");
    },
    onSettled: () => {
      setActiveAiAction(null);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!note?.id) return;
      return deleteNote(note.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      showNotification("Note deleted successfully!");
      setTimeout(() => {
        onClose();
      }, 500);
    },
    onError: (error) => {
      console.error("Error deleting note:", error);
      showNotification("Failed to delete note", "error");
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

    // Validate file size based on plan limit
    const maxSize = limits.maxImageSize || 5 * 1024 * 1024;
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

  const handleAiAction = async (type: "improve" | "expand") => {
    if (!content.trim()) {
      showNotification("Please write some content first", "warning");
      return;
    }
    aiSuggestionMutation.mutate(type);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate();
    setShowDeleteConfirm(false);
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
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          {/* Wrapper: responsive — side-by-side on desktop, overlay on mobile */}
          <div
            className="relative flex items-stretch justify-center w-full max-w-3xl md:max-w-[calc(768px+360px)]"
            onClick={(e) => e.stopPropagation()}
          >
            <m.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={cn(
                "relative flex-1 max-w-3xl h-[85vh] md:h-[90vh] bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden flex flex-col",
                isAiChatOpen
                  ? "rounded-xl md:rounded-l-xl md:rounded-r-none"
                  : "rounded-xl",
              )}
            >
            {/* Top-right Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-40 h-8 w-8 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center transition-colors shadow-sm"
              title="Close"
            >
              <X className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
            </button>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col relative">
              {/* Cover Image */}
              {imageUrl && (
                <div className="relative w-full h-48 group">
                  <Image
                    src={imageUrl}
                    alt="Cover"
                    fill
                    className="object-cover"
                    unoptimized={imageUrl.includes("cloudinary")}
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
            <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm border-t border-zinc-200 dark:border-zinc-800 z-10">
              <div className="flex items-center justify-between">
                {/* Left Actions */}
                <div className="flex items-center gap-1">
                  {limits.canUploadImages ? (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="h-9 px-2 sm:px-3 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded flex items-center gap-1.5 sm:gap-2 transition-colors disabled:opacity-50"
                      title="Add image"
                    >
                      {isUploading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <ImageIcon className="w-4 h-4" />
                      )}
                      <span className="hidden sm:inline text-sm font-medium">Image</span>
                    </button>
                  ) : (
                    <button
                      disabled
                      className="h-9 px-2 sm:px-3 text-zinc-400 dark:text-zinc-600 rounded flex items-center gap-1.5 sm:gap-2 cursor-not-allowed opacity-50"
                      title="Upgrade to Basic or higher to upload images"
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span className="hidden sm:inline text-sm font-medium">Image</span>
                    </button>
                  )}
                  <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 mx-1" />
                  <button
                    onClick={() => handleAiAction("improve")}
                    disabled={activeAiAction !== null}
                    className="h-9 px-2 sm:px-3 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded flex items-center gap-1.5 sm:gap-2 transition-colors disabled:opacity-50"
                    title="Improve with AI"
                  >
                    {activeAiAction === "improve" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Wand2 className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline text-sm font-medium">Improve</span>
                  </button>
                  <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 mx-1" />
                  <button
                    onClick={() => handleAiAction("expand")}
                    disabled={activeAiAction !== null}
                    className="h-9 px-2 sm:px-3 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded flex items-center gap-1.5 sm:gap-2 transition-colors disabled:opacity-50"
                    title="Expand"
                  >
                    {activeAiAction === "expand" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <BookOpen className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline text-sm font-medium">Expand</span>
                  </button>
                  <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 mx-1" />
                  <button
                    onClick={() => setIsAiChatOpen(!isAiChatOpen)}
                    className={cn(
                      "h-9 px-2 sm:px-3 rounded flex items-center gap-1.5 sm:gap-2 transition-colors",
                      isAiChatOpen
                        ? "dark:text-blue-400"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800",
                    )}
                    title="Open AI Chat"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="hidden sm:inline text-sm font-medium">Chat</span>
                  </button>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                    className="h-9 px-4 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full transition-colors text-sm font-medium flex items-center gap-1.5 disabled:opacity-50"
                    title="Delete note"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="h-9 px-3 sm:px-4 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-sm font-medium flex items-center gap-1.5"
                  >
                    <X className="w-4 h-4 sm:hidden" />
                    <span className="hidden sm:inline">Close</span>
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving || !isDirty}
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
                        <span className="hidden sm:inline">Done</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />

            {/* Delete Confirmation Dialog */}
            <AnimatePresence>
              {showDeleteConfirm && (
                <m.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center z-[60] rounded-xl"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  <m.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white dark:bg-zinc-900 rounded-lg p-6 max-w-sm mx-4 shadow-2xl border border-zinc-200 dark:border-zinc-800"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center flex-shrink-0">
                        <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                          Delete Note?
                        </h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          This action cannot be undone. This will permanently
                          delete your note.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="h-9 px-4 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-sm font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={confirmDelete}
                        disabled={deleteMutation.isPending}
                        className="h-9 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {deleteMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </>
                        )}
                      </button>
                    </div>
                  </m.div>
                </m.div>
              )}
            </AnimatePresence>

            {/* Notification Toast */}
            <AnimatePresence>
              {notification && (
                <m.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="fixed top-4 right-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 rounded-lg shadow-lg text-sm font-medium z-[60]"
                >
                  {notification.message}
                </m.div>
              )}
            </AnimatePresence>
          </m.div>

          {/* AI Chat Panel — absolute overlay on mobile, side-by-side on desktop */}
          <div
            className={cn(
              "bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden transition-all duration-300 ease-in-out flex-shrink-0",
              "absolute inset-0 z-50 rounded-xl",
              "md:relative md:inset-auto md:z-auto md:rounded-l-none md:rounded-r-xl md:h-[90vh]",
              isAiChatOpen
                ? "w-full md:w-[360px] opacity-100 pointer-events-auto"
                : "w-0 opacity-0 pointer-events-none",
            )}
          >
            <AiChatPanel
              isOpen={isAiChatOpen}
              onToggle={() => setIsAiChatOpen(!isAiChatOpen)}
              noteId={note?.id}
              noteTitle={title}
              noteContent={content}
            />
          </div>

          </div>
          {/* End wrapper */}
        </m.div>
      )}
    </AnimatePresence>
  );
}
