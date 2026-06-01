"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getNotes, createNote, type Note } from "@/server/api/notes";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card } from "@/components/ui/card";
import { NoteCard } from "@/components/dashboard/note-card";
import { Plus, Loader2, FileText, Sparkles } from "lucide-react";

// Lazy load NoteViewModal (contains TipTap editor - heavy)
const NoteViewModal = dynamic(
  () =>
    import("@/components/dashboard/note-modal").then((mod) => ({
      default: mod.NoteViewModal,
    })),
  { ssr: false }
);

export default function NotesPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

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

  // Create new note mutation
  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onMutate: () => {
      setIsCreatingNote(true);
    },
    onSuccess: (newNote) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setSelectedNote(newNote);
      setIsModalOpen(true);
    },
    onError: (error: any) => {
      console.error("Error creating note:", error);
      if (error.response?.status === 403) {
        setIsUpgradeModalOpen(true);
      } else {
        alert("Failed to create note. Please try again.");
      }
    },
    onSettled: () => {
      setIsCreatingNote(false);
    },
  });

  // Handle creating a new note
  const handleCreateNewNote = () => {
    createNoteMutation.mutate({
      title: "Untitled",
      content: "",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
          <span className="text-lg font-medium">Loading your notes...</span>
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
    <div className="relative max-w-7xl mx-auto px-1.5 py-3 md:px-3 md:py-4">
      {/* Notes Stats and Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 md:mb-6 animate-fade-in-up animate-delay-100">
        <div>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold flex items-center gap-2">
            My Notes
            {notes.length > 0 && (
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-cyan-500" />
            )}
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            {notes.length > 0
              ? `${notes.length} note${
                  notes.length === 1 ? "" : "s"
                } with AI-powered insights`
              : "No notes yet"}
          </p>
        </div>

        <Button
          onClick={handleCreateNewNote}
          size="lg"
          className="w-full sm:w-auto bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          disabled={isCreatingNote}
        >
          {isCreatingNote ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Plus className="w-5 h-5 mr-2" />
          )}
          {isCreatingNote ? "Creating..." : "New Note"}
        </Button>
      </div>

      {/* Notes Grid */}
      {notes.length === 0 ? (
        <Card className="p-12 md:p-16 text-center animate-fade-in-up animate-delay-200 bg-gradient-to-br from-background to-muted/20 border-dashed border-2 hover:border-cyan-500/50 transition-all duration-300">
          <div className="max-w-md mx-auto">
            <div className="relative inline-block mb-6">
              <FileText className="w-20 h-20 md:w-24 md:h-24 text-muted-foreground/50" />
              <Sparkles className="w-8 h-8 text-cyan-500 absolute -top-2 -right-2 animate-pulse-glow" />
            </div>
            <h2 className="text-xl md:text-2xl font-semibold mb-3">
              No notes yet
            </h2>
            <p className="text-muted-foreground mb-8 text-sm md:text-base leading-relaxed">
              Create your first note to get started with your AI-powered
              note-taking experience. Our AI will help you organize and enhance
              your ideas.
            </p>
            <Button
              onClick={handleCreateNewNote}
              size="lg"
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              disabled={isCreatingNote}
            >
              {isCreatingNote ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Plus className="w-5 h-5 mr-2" />
              )}
              {isCreatingNote ? "Creating..." : "Create First Note"}
            </Button>
          </div>
        </Card>
      ) : (
        <>
          {/* Modern Notes Grid with staggered animation */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {notes.map((note, index) => (
              <div
                key={note.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${Math.min(index * 50, 400)}ms` }}
              >
                <NoteCard
                  note={note}
                  onClick={() => {
                    setSelectedNote(note);
                    setIsModalOpen(true);
                  }}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Note View/Edit Modal */}
      <NoteViewModal
        note={selectedNote}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedNote(null);
        }}
      />

      {/* Upgrade Required Modal */}
      <AlertDialog
        open={isUpgradeModalOpen}
        onOpenChange={setIsUpgradeModalOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-500" />
              Note Limit Reached
            </AlertDialogTitle>
            <AlertDialogDescription>
              You&apos;ve reached the limit of notes for your current plan.
              Upgrade to a premium plan to create unlimited notes and unlock
              advanced AI insights.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Maybe Later</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => router.push("/app/pricing")}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
            >
              View Plans
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
