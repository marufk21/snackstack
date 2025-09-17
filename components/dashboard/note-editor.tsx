"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { useNoteEditorStore } from "../../stores/use-note-editor-store";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { ImageUpload } from "../ui/image-upload";
import { NoteBottomBar } from "./note-bottom-bar";
import TextareaAutosize from "react-textarea-autosize";
import {
  Save,
  Sparkles,
  Image as ImageIcon,
  Clock,
  Loader2,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote, updateNote } from "@/server/api";
import { useAppStore } from "../../stores/use-app-store";

interface NoteEditorProps {
  noteId?: string;
  onSave?: (noteId: string) => void;
}

export function NoteEditor({ noteId, onSave }: NoteEditorProps) {
  const {
    title,
    content,
    imageUrl,
    isDirty,
    isSaving,
    lastSaved,
    isGeneratingAI,
    setTitle,
    setContent,
    setImageUrl,
    setIsDirty,
    setIsSaving,
    setLastSaved,
    setIsGeneratingAI,
    getSlugFromTitle,
    currentNote,
  } = useNoteEditorStore();

  const { addNotification } = useAppStore();
  const queryClient = useQueryClient();
  const autosaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-save mutation
  const saveMutation = useMutation({
    mutationFn: async (data: {
      title: string;
      content: string;
      imageUrl?: string;
    }) => {
      if (noteId) {
        // Update existing note
        return updateNote(noteId, data);
      } else {
        // Create new note
        return createNote(data);
      }
    },
    onMutate: () => {
      setIsSaving(true);
    },
    onSuccess: (data) => {
      setIsDirty(false);
      setLastSaved(new Date());
      queryClient.invalidateQueries({ queryKey: ["notes"] });

      // If this was a new note, call onSave with the new ID
      if (!noteId && data?.id && onSave) {
        onSave(data.id);
      }

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

  // Auto-save logic
  const scheduleAutosave = useCallback(() => {
    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }

    autosaveTimeoutRef.current = setTimeout(() => {
      if (isDirty && title.trim()) {
        saveMutation.mutate({
          title: title.trim(),
          content,
          imageUrl: imageUrl || undefined,
        });
      }
    }, 10000); // Auto-save after 10 seconds of inactivity
  }, [isDirty, title, content, imageUrl, saveMutation]);

  // Trigger auto-save when content changes
  useEffect(() => {
    if (isDirty) {
      scheduleAutosave();
    }

    return () => {
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }
    };
  }, [isDirty, scheduleAutosave]);

  // Manual save
  const handleManualSave = () => {
    if (title.trim()) {
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
    addNotification({
      type: "success",
      message: "Image uploaded successfully",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Note Editor</h1>
          {isDirty && <Badge variant="secondary">Unsaved changes</Badge>}
          {isSaving && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" />
              Saving...
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {lastSaved && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              Last saved: {lastSaved.toLocaleTimeString()}
            </div>
          )}

          <Button
            onClick={handleManualSave}
            disabled={!isDirty || !title.trim() || isSaving}
            variant="outline"
            size="sm"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Editor */}
      <Card className="p-6">
        <div className="space-y-4">
          {/* Title */}
          <div>
            <input
              type="text"
              placeholder="Enter note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-3xl font-bold bg-transparent border-none outline-none placeholder-muted-foreground"
            />
            {title && (
              <p className="text-sm text-muted-foreground mt-1">
                Slug: {getSlugFromTitle(title)}
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div className="flex items-center gap-4">
            <ImageUpload onUpload={handleImageUpload} />
            {imageUrl && (
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                <span className="text-sm text-muted-foreground">
                  Image attached
                </span>
                <Button
                  onClick={() => setImageUrl(null)}
                  variant="ghost"
                  size="sm"
                >
                  Remove
                </Button>
              </div>
            )}
          </div>

          {/* Content Editor */}
          <div>
            <TextareaAutosize
              placeholder="Start writing your note in markdown..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[400px] p-4 bg-muted/50 rounded-lg border-none outline-none resize-none font-mono text-sm"
              minRows={15}
            />
          </div>
        </div>
      </Card>

      {/* Display attached image */}
      {imageUrl && (
        <Card className="p-4">
          <img
            src={imageUrl}
            alt="Note attachment"
            className="max-w-full h-auto rounded-lg"
          />
        </Card>
      )}

      {/* Fixed Bottom Bar with AI and Upload */}
      <NoteBottomBar />
    </div>
  );
}
