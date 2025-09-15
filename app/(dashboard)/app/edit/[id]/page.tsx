"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { NoteEditor } from "@/components/notes/note-editor";
import { useNoteEditorStore } from "@/stores/use-note-editor-store";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  slug: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export default function EditNotePage() {
  const params = useParams();
  const router = useRouter();
  const noteId = params.id as string;
  const { updateFromNote, resetEditor } = useNoteEditorStore();

  // Fetch the note to edit
  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["note", noteId],
    queryFn: async () => {
      const response = await axios.get(`/api/notes/${noteId}`);
      return response.data.note as Note;
    },
    enabled: !!noteId,
  });

  // Update editor with note data when loaded
  useEffect(() => {
    if (note) {
      updateFromNote({
        id: note.id,
        title: note.title,
        content: note.content,
        slug: note.slug,
        imageUrl: note.imageUrl,
        userId: undefined, // Not needed for editor
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt),
      });
    }
  }, [note, updateFromNote]);

  // Reset editor on unmount
  useEffect(() => {
    return () => {
      resetEditor();
    };
  }, [resetEditor]);

  // Handle successful save (redirect to view page)
  const handleSave = () => {
    if (note) {
      router.push(`/app/${note.slug}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading note...</span>
        </div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold">Note not found</h1>
        <p className="text-muted-foreground">
          The note you're trying to edit doesn't exist or has been deleted.
        </p>
        <Button onClick={() => router.push("/app")} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Notes
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.push(`/app/${note.slug}`)}
              variant="ghost"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Note
            </Button>

            <div>
              <h1 className="text-2xl font-bold">Edit Note</h1>
              <p className="text-muted-foreground">{note.title}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="py-6">
        <NoteEditor noteId={noteId} onSave={handleSave} />
      </div>
    </div>
  );
}
