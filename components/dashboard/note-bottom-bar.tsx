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
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { generateAiSuggestion } from "@/server/api";
import { useNoteEditorStore } from "@/stores/use-note-editor-store";
import { useAppStore } from "@/stores/use-app-store";
import { useImageUpload } from "@/hooks/use-image-upload";

interface NoteBottomBarProps {
  className?: string;
}

export function NoteBottomBar({ className = "" }: NoteBottomBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    content,
    isGeneratingAI,
    setContent,
    setImageUrl,
    setIsGeneratingAI,
  } = useNoteEditorStore();

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
      setImageUrl(result.secure_url);
      addNotification({
        type: "success",
        message: "Image uploaded successfully",
      });
      setShowImageUpload(false);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    if (showImageUpload) {
      setShowImageUpload(false);
    }
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
      {/* Image Upload Modal */}
      {showImageUpload && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Upload Image</h3>
              <Button
                onClick={() => setShowImageUpload(false)}
                variant="ghost"
                size="sm"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={handleFileSelect}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files)}
                className="hidden"
              />

              {isUploading ? (
                <div className="flex flex-col items-center space-y-2">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Uploading...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">
                      Drop an image here or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, GIF, WebP up to 5MB
                    </p>
                  </div>
                </div>
              )}
            </div>

            {error && <p className="text-sm text-destructive mt-2">{error}</p>}
          </Card>
        </div>
      )}

      {/* Fixed Bottom Bar */}
      <div className={`fixed bottom-0 left-0 right-0 z-30 ${className}`}>
        <div className="bg-background/95 backdrop-blur-sm border-t border-border">
          <div className="max-w-4xl mx-auto p-4">
            <Card className="shadow-lg border-border/50">
              <div className="p-4">
                {/* Expanded AI Actions */}
                {isExpanded && (
                  <div className="mb-4 space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">AI Assistant</span>
                      {isGeneratingAI && (
                        <Badge variant="outline" className="text-xs">
                          <Loader2 className="w-3 h-3 animate-spin mr-1" />
                          Working...
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={() => handleAISuggestion("improve")}
                        disabled={isGeneratingAI}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        <Wand2 className="w-3 h-3 mr-1" />
                        Improve
                      </Button>

                      <Button
                        onClick={() => handleAISuggestion("continue")}
                        disabled={isGeneratingAI}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        <Type className="w-3 h-3 mr-1" />
                        Continue
                      </Button>

                      <Button
                        onClick={() => handleAISuggestion("summarize")}
                        disabled={isGeneratingAI}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        <Sparkles className="w-3 h-3 mr-1" />
                        Summarize
                      </Button>

                      <Button
                        onClick={() => handleAISuggestion("expand")}
                        disabled={isGeneratingAI}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        <Mic className="w-3 h-3 mr-1" />
                        Expand
                      </Button>
                    </div>
                  </div>
                )}

                {/* Main Action Bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Image Upload Button */}
                    <Button
                      onClick={() => setShowImageUpload(true)}
                      variant="ghost"
                      size="sm"
                      className="rounded-full w-9 h-9 p-0"
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
                      className="text-xs px-3"
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      {isGeneratingAI ? "Working..." : "AI Assist"}
                    </Button>
                  </div>

                  {/* Expand/Collapse Toggle */}
                  <Button
                    onClick={toggleExpanded}
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                  >
                    {isExpanded ? "Less" : "More AI"}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
