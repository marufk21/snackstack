"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { NoteEditor } from "@/components/dashboard/note-editor";
import { useNoteEditorStore } from "@/stores/use-note-editor-store";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NewNotePage() {
  const router = useRouter();
  const { resetEditor } = useNoteEditorStore();

  // Reset editor when component mounts
  useEffect(() => {
    resetEditor();
  }, [resetEditor]);

  // Handle successful save (redirect to view page)
  const handleSave = (noteId: string) => {
    // We'll need to get the note to find its slug for redirection
    // For now, just redirect to app list
    router.push("/app");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.push("/app")}
              variant="ghost"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Notes
            </Button>

            <div>
              <h1 className="text-2xl font-bold">Create New Note</h1>
              <p className="text-muted-foreground">
                Write your thoughts in markdown with AI assistance
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="py-6">
        <NoteEditor onSave={handleSave} />
      </div>
    </div>
  );
}
