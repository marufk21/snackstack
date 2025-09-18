"use client";

import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateNote, type Note } from "@/server/api";
import { useAppStore } from "@/stores/use-app-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { NoteBottomBar } from "./note-bottom-bar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Save,
  Sparkles,
  Image as ImageIcon,
  Clock,
  Loader2,
  Calendar,
  X,
} from "lucide-react";

interface NoteViewModalProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
}

export function NoteViewModal({ note, isOpen, onClose }: NoteViewModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const { addNotification } = useAppStore();
  const queryClient = useQueryClient();

  // Initialize form data when note changes
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setImageUrl(note.imageUrl || null);
      setIsDirty(false);
    }
  }, [note]);

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
      setLastSaved(new Date());
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      addNotification({
        type: "success",
        message: "Note saved successfully",
      });
    },
    onError: (error) => {
      console.error("Error saving note:", error);
      addNotification({
        type: "error",
        message: "Failed to save note",
      });
    },
    onSettled: () => {
      setIsSaving(false);
    },
  });

  // Handle save
  const handleSave = () => {
    if (title.trim() && note?.id) {
      saveMutation.mutate({
        title: title.trim(),
        content,
        imageUrl: imageUrl || undefined,
      });
    }
  };

  // Handle image upload
  const handleImageUpload = (url: string) => {
    setImageUrl(url);
    setIsDirty(true);
    addNotification({
      type: "success",
      message: "Image uploaded successfully",
    });
  };

  // Handle content changes
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    setIsDirty(true);
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setIsDirty(true);
  };

  if (!note) return null;

  const createdDate = new Date(note.createdAt);
  const updatedDate = new Date(note.updatedAt);
  const isUpdated = updatedDate.getTime() !== createdDate.getTime();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl h-[95vh] flex flex-col p-0"
        showCloseButton={false}
      >
        <DialogHeader className="flex-shrink-0 px-8 py-0 pt-4 border-b border-border/20 bg-background/98 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold tracking-tight text-foreground">
              <input
                type="text"
                placeholder="Enter note title..."
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full text-3xl font-bold bg-transparent border-none outline-none placeholder-muted-foreground/50 focus:placeholder-muted-foreground/30 transition-all duration-200 text-foreground"
              />
            </DialogTitle>

            <div className="flex items-center gap-3">
              <Button
                onClick={handleSave}
                disabled={!isDirty || !title.trim() || isSaving}
                variant="default"
                size="sm"
                className="min-w-24 h-9 px-4 font-medium bg-primary hover:bg-primary/90 transition-colors"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isSaving ? "Saving..." : "Save"}
              </Button>
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="w-9 h-9 p-0 rounded-lg hover:bg-muted/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Content - With Scroll */}
        <div className="flex-1 overflow-y-auto px-8 py-0">
          <div className="space-y-8 max-w-none">
            {/* Title Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 pt-2 border-t border-border/20">
                {isDirty && (
                  <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    Unsaved changes
                  </div>
                )}
              </div>
            </div>

            {/* Attached Image Preview */}
            {imageUrl && (
              <div className="relative border border-border/30 rounded-xl p-4 bg-muted/20">
                <Button
                  onClick={() => {
                    setImageUrl(null);
                    setIsDirty(true);
                  }}
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 w-8 h-8 p-0 rounded-full bg-background/80 hover:bg-destructive/10 hover:text-destructive transition-colors backdrop-blur-sm border border-border/20 z-10"
                >
                  <X className="w-4 h-4" />
                </Button>
                <img
                  src={imageUrl}
                  alt="Note attachment"
                  className="max-w-full h-auto rounded-lg shadow-sm"
                />
              </div>
            )}

            {/* Content Editor */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Content
                </label>
                <Badge variant="outline" className="text-xs">
                  Markdown Supported
                </Badge>
              </div>
              <div className="relative">
                <textarea
                  placeholder="Start writing your note in markdown...\n\nSupported formatting:\n- **bold** and *italic*\n- # Headers\n- - Lists\n- `code` blocks"
                  value={content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  className="w-full min-h-[450px] p-6 bg-muted/20 rounded-xl border border-border/30 outline-none resize-none font-mono text-sm leading-relaxed focus:ring-2 focus:ring-primary/15 focus:border-primary/40 focus:bg-background/50 transition-all duration-200 placeholder:text-muted-foreground/40"
                  rows={18}
                />
                <div className="absolute bottom-4 right-4 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
                  {content.length} characters
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar for Modal */}
        <div className="flex-shrink-0 border-t border-border/20 bg-background/98 backdrop-blur-md">
          <NoteBottomBar
            isModal={true}
            modalContent={content}
            modalSetContent={handleContentChange}
            modalImageUrl={imageUrl}
            modalSetImageUrl={setImageUrl}
            onImageUpload={handleImageUpload}
            lastSaved={lastSaved}
            updatedDate={isUpdated ? updatedDate : null}
            isDirty={isDirty}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
