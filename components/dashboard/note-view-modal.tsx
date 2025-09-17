"use client";

import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateNote, type Note } from "@/server/api";
import { useAppStore } from "@/stores/use-app-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/ui/image-upload";
import { NoteBottomBar } from "./note-bottom-bar";
import TextareaAutosize from "react-textarea-autosize";
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
        className="max-w-4xl max-h-[90vh] overflow-hidden p-0"
        showCloseButton={false}
      >
        {/* Custom Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <DialogTitle className="text-xl font-semibold">
              Edit Note
            </DialogTitle>
            {isDirty && <Badge variant="secondary">Unsaved changes</Badge>}
            {isSaving && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                Saving...
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Metadata */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground mr-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {createdDate.toLocaleDateString()}
              </div>
              {isUpdated && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {updatedDate.toLocaleDateString()}
                </div>
              )}
              {lastSaved && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {lastSaved.toLocaleTimeString()}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <Button
              onClick={handleSave}
              disabled={!isDirty || !title.trim() || isSaving}
              variant="outline"
              size="sm"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>

            <Button onClick={onClose} variant="ghost" size="sm">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content - Always in Edit Mode */}
        <div className="flex-1 overflow-y-auto p-6 pb-32">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <input
                type="text"
                placeholder="Enter note title..."
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full text-2xl font-bold bg-transparent border-none outline-none placeholder-muted-foreground"
              />
              <Badge variant="secondary" className="mt-2">
                {note.slug}
              </Badge>
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
                    onClick={() => {
                      setImageUrl(null);
                      setIsDirty(true);
                    }}
                    variant="ghost"
                    size="sm"
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>

            {/* Attached Image Preview */}
            {imageUrl && (
              <div className="border rounded-lg p-4">
                <img
                  src={imageUrl}
                  alt="Note attachment"
                  className="max-w-full h-auto rounded-lg"
                />
              </div>
            )}

            {/* Content Editor */}
            <div>
              <TextareaAutosize
                placeholder="Start writing your note in markdown..."
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                className="w-full min-h-[400px] p-4 bg-muted/50 rounded-lg border-none outline-none resize-none font-mono text-sm"
                minRows={15}
              />
            </div>
          </div>
        </div>

        {/* Bottom Bar for Modal */}
        <div className="absolute bottom-0 left-0 right-0">
          <NoteBottomBar />
        </div>
      </DialogContent>
    </Dialog>
  );
}
