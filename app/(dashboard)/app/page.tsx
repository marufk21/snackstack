"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getNotes, type Note } from "@/server/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WelcomeHeader } from "@/components/ui/welcome-header";
import { NoteCard } from "@/components/dashboard/note-card";
import { NoteViewModal } from "@/components/dashboard/note-view-modal";
import { Plus, Loader2, FileText } from "lucide-react";

export default function NotesPage() {
  const router = useRouter();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all notes
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["notes"],
    queryFn: getNotes,
    retry: (failureCount, error) => {
      // Don't retry on 401, 403, 404, 503 errors
      if (error && typeof error === "object" && "response" in error) {
        const response = (error as any).response;
        if (
          response?.status === 401 ||
          response?.status === 403 ||
          response?.status === 404 ||
          response?.status === 503
        ) {
          return false;
        }
      }
      return failureCount < 2;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading notes...</span>
        </div>
      </div>
    );
  }

  if (error) {
    const errorMessage =
      error && typeof error === "object" && "response" in error
        ? (error as any).response?.data?.error ||
          "Something went wrong while loading your notes."
        : "Something went wrong while loading your notes.";

    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold">Error loading notes</h1>
        <p className="text-muted-foreground text-center max-w-md">
          {errorMessage}
        </p>
        <div className="flex gap-2">
          <Button onClick={() => refetch()} variant="outline">
            Try Again
          </Button>
          <Button onClick={() => window.location.reload()} variant="default">
            Reload Page
          </Button>
        </div>
      </div>
    );
  }

  const notes = data || [];

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Welcome Header */}
      <WelcomeHeader className="mb-8" />

      {/* Notes Stats and Actions */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold">My Notes</h2>
          <p className="text-muted-foreground mt-1">
            {notes.length > 0
              ? `${notes.length} note${notes.length === 1 ? "" : "s"}`
              : "No notes yet"}
          </p>
        </div>

        <Button onClick={() => router.push("/app/new")} size="lg">
          <Plus className="w-5 h-5 mr-2" />
          New Note
        </Button>
      </div>

      {/* Notes Grid */}
      {notes.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">No notes yet</h2>
          <p className="text-muted-foreground mb-6">
            Create your first note to get started with your AI-powered
            note-taking experience.
          </p>
          <Button onClick={() => router.push("/app/new")} size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Create First Note
          </Button>
        </Card>
      ) : (
        <>
          {/* Modern Notes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onClick={() => {
                  setSelectedNote(note);
                  setIsModalOpen(true);
                }}
              />
            ))}
          </div>

          {/* Note View/Edit Modal */}
          <NoteViewModal
            note={selectedNote}
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedNote(null);
            }}
          />
        </>
      )}
    </div>
  );
}
