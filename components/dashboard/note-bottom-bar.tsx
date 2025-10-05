"use client";

import React, { useState, useRef } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Plus,
  Sparkles,
  Image as ImageIcon,
  Wand2,
  Type,
  Mic,
  X,
  Upload,
  Loader2,
  Clock,
  Calendar,
  CircleDot,
  Brain,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { generateAiSuggestion } from "@/server/api";
import { useNoteEditorStore } from "@/stores/use-note-editor-store";
import { useAppStore } from "@/stores/use-app-store";
import { useImageUpload } from "@/hooks/use-image-upload";

interface NoteBottomBarProps {
  className?: string;
  isModal?: boolean;
  // Optional props for modal mode
  modalContent?: string;
  modalSetContent?: (content: string) => void;
  modalImageUrl?: string | null;
  modalSetImageUrl?: (url: string | null) => void;
  // Image upload handler
  onImageUpload?: (url: string) => void;
  // Status info for modal
  lastSaved?: Date | null;
  updatedDate?: Date | null;
  isDirty?: boolean;
}

export function NoteBottomBar({
  className = "",
  isModal = false,
  modalContent,
  modalSetContent,
  modalImageUrl,
  modalSetImageUrl,
  onImageUpload,
  lastSaved,
  updatedDate,
  isDirty,
}: NoteBottomBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    content: storeContent,
    isGeneratingAI,
    setContent: setStoreContent,
    setIsGeneratingAI,
  } = useNoteEditorStore();

  // Use modal props if in modal mode, otherwise use store
  const content = isModal ? modalContent || "" : storeContent;
  const setContent = isModal ? modalSetContent || (() => {}) : setStoreContent;

  const { addNotification } = useAppStore();
  const { uploadImage, isUploading, error } = useImageUpload();

  // AI suggestion mutation
  const aiSuggestionMutation = useMutation({
    mutationFn: async (
      type: "improve" | "continue" | "summarize" | "expand"
    ) => {
      return generateAiSuggestion({ content, type });
    },
    onMutate: () => {
      setIsGeneratingAI(true);
    },
    onSuccess: (suggestion) => {
      if (suggestion) {
        setContent(suggestion);
        addNotification({
          type: "success",
          message: "AI suggestion applied",
        });
      }
    },
    onError: (error) => {
      console.error("Error generating AI suggestion:", error);
      addNotification({
        type: "error",
        message: "Failed to generate AI suggestion",
      });
    },
    onSettled: () => {
      setIsGeneratingAI(false);
    },
  });

  // Handle image upload
  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const result = await uploadImage(file);

    if (result) {
      // Use modal setImageUrl if in modal mode, otherwise use onImageUpload callback
      if (isModal && modalSetImageUrl) {
        modalSetImageUrl(result.secure_url);
      } else if (onImageUpload) {
        onImageUpload(result.secure_url);
      }

      addNotification({
        type: "success",
        message: "Image uploaded successfully",
      });
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleAISuggestion = (
    type: "improve" | "continue" | "summarize" | "expand"
  ) => {
    if (!content.trim()) {
      addNotification({
        type: "warning",
        message: "Please write some content first",
      });
      return;
    }
    aiSuggestionMutation.mutate(type);
  };

  return (
    <>
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleImageUpload(e.target.files)}
        className="hidden"
      />

      {/* Fixed Bottom Bar */}
      <div
        className={`${
          isModal ? "relative" : "fixed bottom-0 left-0 right-0"
        } z-30 ${className}`}
      >
        <div
          className={`${
            isModal
              ? ""
              : "bg-background/95 backdrop-blur-sm border-t border-border"
          }`}
        >
          <div className={`${isModal ? "" : "max-w-4xl mx-auto"} p-4`}>
           
            <Card className="shadow-xl border-border/40 bg-card/95 backdrop-blur-sm">
              <div className="p-4">
                {/* Expanded AI Actions - Modern Design */}
                {isExpanded && (
                  <div className="mb-6 space-y-4">
                    <div className="flex items-center gap-3 pb-3 border-b border-border/30">
                      <Brain className="w-4 h-4 text-primary" />
                      <span className="text-sm font-semibold text-foreground">
                        AI-Powered Assistant
                      </span>
                      {isGeneratingAI && (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-primary/10 text-primary border-primary/20"
                        >
                          <Loader2 className="w-3 h-3 animate-spin mr-1" />
                          Generating...
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        onClick={() => handleAISuggestion("improve")}
                        disabled={isGeneratingAI}
                        variant="outline"
                        size="sm"
                        className="h-10 text-xs font-medium border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all"
                      >
                        <Wand2 className="w-3 h-3 mr-2" />
                        Improve Writing
                      </Button>

                      <Button
                        onClick={() => handleAISuggestion("continue")}
                        disabled={isGeneratingAI}
                        variant="outline"
                        size="sm"
                        className="h-10 text-xs font-medium border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all"
                      >
                        <Type className="w-3 h-3 mr-2" />
                        Continue Writing
                      </Button>

                      <Button
                        onClick={() => handleAISuggestion("summarize")}
                        disabled={isGeneratingAI}
                        variant="outline"
                        size="sm"
                        className="h-10 text-xs font-medium border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all"
                      >
                        <Sparkles className="w-3 h-3 mr-2" />
                        Summarize
                      </Button>

                      <Button
                        onClick={() => handleAISuggestion("expand")}
                        disabled={isGeneratingAI}
                        variant="outline"
                        size="sm"
                        className="h-10 text-xs font-medium border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all"
                      >
                        <Mic className="w-3 h-3 mr-2" />
                        Expand Content
                      </Button>
                    </div>
                  </div>
                )}

                {/* Main Action Bar - Modern Design */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Image Upload Button */}
                    <Button
                      onClick={handleFileSelect}
                      variant="ghost"
                      size="sm"
                      className="w-10 h-10 p-0 rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </Button>

                    {/* Quick AI Button */}
                    <Button
                      onClick={() => handleAISuggestion("improve")}
                      disabled={!content.trim() || isGeneratingAI}
                      variant="ghost"
                      size="sm"
                      className="h-10 px-4 text-xs font-medium hover:bg-primary/10 hover:text-primary transition-all flex items-center gap-2"
                    >
                      <Sparkles className="w-3 h-3" />
                      {isGeneratingAI ? "Generating..." : "AI Assist"}
                    </Button>
                  </div>

                  {/* Expand/Collapse Toggle */}
                  <Button
                    onClick={toggleExpanded}
                    variant="ghost"
                    size="sm"
                    className="h-10 px-4 text-xs font-medium hover:bg-muted/60 transition-colors flex items-center gap-2"
                  >
                    <Brain className="w-3 h-3" />
                    {isExpanded ? "Show Less" : "AI Tools"}
                  </Button>

                  {updatedDate && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span className="font-medium">Updated:</span>
                      <span className="text-foreground">
                        {updatedDate.toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}