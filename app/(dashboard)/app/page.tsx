"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getNotes, type Note } from "@/server/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WelcomeHeader } from "@/components/ui/welcome-header";
import {
  Plus,
  Edit,
  Eye,
  Calendar,
  Clock,
  Loader2,
  FileText,
  ImageIcon,
} from "lucide-react";

export default function NotesPage() {
  const router = useRouter();

  // Fetch all notes
  const { data, isLoading, error } = useQuery({
    queryKey: ["notes"],
    queryFn: getNotes,
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
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold">Error loading notes</h1>
        <p className="text-muted-foreground">
          Something went wrong while loading your notes.
        </p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Try Again
        </Button>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => {
            const createdDate = new Date(note.createdAt);
            const updatedDate = new Date(note.updatedAt);
            const isUpdated = updatedDate.getTime() !== createdDate.getTime();

            // Extract first few lines of content for preview
            const preview = note.content
              .split("\n")
              .slice(0, 3)
              .join(" ")
              .substring(0, 150);

            return (
              <Card
                key={note.id}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col h-full">
                  {/* Title and metadata */}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                      {note.title}
                    </h3>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Calendar className="w-3 h-3" />
                      {createdDate.toLocaleDateString()}

                      {isUpdated && (
                        <>
                          <span>•</span>
                          <Clock className="w-3 h-3" />
                          Updated {updatedDate.toLocaleDateString()}
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {note.slug}
                      </Badge>

                      {note.imageUrl && (
                        <Badge
                          variant="outline"
                          className="text-xs flex items-center gap-1"
                        >
                          <ImageIcon className="w-3 h-3" />
                          Image
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Content preview */}
                  <div className="flex-1 mb-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {preview}
                      {preview.length >= 150 ? "..." : ""}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => router.push(`/app/${note.slug}`)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>

                    <Button
                      onClick={() => router.push(`/app/edit/${note.id}`)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
