"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { type Note } from "@/server/api";
import {
  Calendar,
  Clock,
  ImageIcon,
  Edit3,
  FileText,
  Sparkles,
  Brain,
} from "lucide-react";

interface NoteCardProps {
  note: Note;
  onClick: () => void;
}

export function NoteCard({ note, onClick }: NoteCardProps) {
  const createdDate = new Date(note.createdAt);
  const updatedDate = new Date(note.updatedAt);
  const isUpdated = updatedDate.getTime() !== createdDate.getTime();

  // Extract first few lines of content for preview
  const preview = note.content
    .replace(/[#*`_~]/g, "") // Remove markdown formatting
    .split("\n")
    .filter((line) => line.trim()) // Remove empty lines
    .slice(0, 4)
    .join(" ")
    .substring(0, 180);

  // Get dominant color based on note content length for visual variety
  const colorVariant = note.content.length % 5;
  const cardBgClass = [
    "bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/20 dark:to-blue-900/10 border-blue-200/50 dark:border-blue-800/30",
    "bg-gradient-to-br from-green-50/50 to-green-100/30 dark:from-green-950/20 dark:to-green-900/10 border-green-200/50 dark:border-green-800/30",
    "bg-gradient-to-br from-purple-50/50 to-purple-100/30 dark:from-purple-950/20 dark:to-purple-900/10 border-purple-200/50 dark:border-purple-800/30",
    "bg-gradient-to-br from-orange-50/50 to-orange-100/30 dark:from-orange-950/20 dark:to-orange-900/10 border-orange-200/50 dark:border-orange-800/30",
    "bg-gradient-to-br from-pink-50/50 to-pink-100/30 dark:from-pink-950/20 dark:to-pink-900/10 border-pink-200/50 dark:border-pink-800/30",
  ][colorVariant];

  return (
    <Card
      className={`group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:z-10 ${cardBgClass}`}
      onClick={onClick}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/5 dark:from-black/0 dark:via-black/0 dark:to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative p-6 h-full flex flex-col">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-foreground transition-colors">
              {note.title}
            </h3>
            <Sparkles className="w-4 h-4 text-purple-500 flex-shrink-0 opacity-70" />
          </div>
        </div>

        {/* Image preview */}
        {note.imageUrl && (
          <div className="mb-4 rounded-lg overflow-hidden border border-border/50">
            <img
              src={note.imageUrl}
              alt="Note preview"
              className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}

        {/* Content preview */}
        <div className="flex-1 mb-4">
          <p className="text-sm text-muted-foreground truncate leading-relaxed">
            {preview}
            {preview.length >= 180 ? "..." : ""}
          </p>
        </div>

        {/* AI Badge */}
        <div className="inline-flex items-center gap-1 bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs px-2 py-1 rounded-full w-fit mb-3">
          <Brain className="w-3 h-3" />
          <span>AI-Powered</span>
        </div>

        {/* Quick action buttons - show on hover */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0"></div>

        {/* Subtle corner decoration */}
        <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-white/20 to-transparent dark:from-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Side accent line based on content type */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 ${
          note.imageUrl
            ? "bg-gradient-to-b from-purple-500 to-purple-600"
            : note.content.length > 500
            ? "bg-gradient-to-b from-purple-500 to-purple-600"
            : note.content.length > 1000
            ? "bg-gradient-to-b from-green-500 to-green-600"
            : "bg-gradient-to-b from-blue-500 to-blue-600"
        } opacity-0 group-hover:opacity-100`}
      />
    </Card>
  );
}