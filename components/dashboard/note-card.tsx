"use client";

import React from "react";
import Image from "next/image";
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
    "bg-gradient-to-br from-cyan-50/50 to-cyan-100/30 dark:from-cyan-950/20 dark:to-cyan-900/10 border-cyan-200/50 dark:border-cyan-800/30",
    "bg-gradient-to-br from-orange-50/50 to-orange-100/30 dark:from-orange-950/20 dark:to-orange-900/10 border-orange-200/50 dark:border-orange-800/30",
    "bg-gradient-to-br from-rose-50/50 to-rose-100/30 dark:from-rose-950/20 dark:to-rose-900/10 border-rose-200/50 dark:border-rose-800/30",
  ][colorVariant];

  return (
    <Card
      className={`group relative overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/10 dark:hover:shadow-cyan-500/20 hover:scale-[1.03] hover:-translate-y-1 hover:z-10 ripple-effect ${cardBgClass}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`Open note: ${note.title}`}
    >
      {/* Animated gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/10 dark:from-black/0 dark:via-black/0 dark:to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Glowing border effect on hover */}
      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-rose-500/20 blur-sm -z-10" />

      <div className="relative p-6 h-full flex flex-col">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-foreground transition-all duration-300 group-hover:translate-x-1">
              {note.title}
            </h3>
            <Sparkles
              className="w-4 h-4 text-cyan-500 flex-shrink-0 opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Image preview */}
        {note.imageUrl && (
          <div className="relative mb-4 rounded-lg overflow-hidden border border-border/50 group-hover:border-border transition-all duration-300 h-32">
            <Image
              src={note.imageUrl}
              alt="Note preview"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              unoptimized={note.imageUrl.includes("cloudinary")}
            />
          </div>
        )}

        {/* Content preview */}
        <div className="flex-1 mb-4">
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed transition-colors duration-300 group-hover:text-foreground/80">
            {preview}
            {preview.length >= 180 ? "..." : ""}
          </p>
        </div>

        {/* AI Badge with pulse animation */}
        <div className="inline-flex items-center gap-1.5 bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 text-xs px-2.5 py-1.5 rounded-full w-fit mb-3 transition-all duration-300 group-hover:bg-cyan-500/20 dark:group-hover:bg-cyan-500/30 group-hover:scale-105">
          <Brain className="w-3 h-3 group-hover:animate-pulse-glow" />
          <span className="font-medium">AI-Powered</span>
        </div>

        {/* Metadata footer - show on hover */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{isUpdated ? "Updated" : "Created"}</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText className="w-3 h-3" />
            <span>{note.content.length} chars</span>
          </div>
        </div>

        {/* Subtle corner decoration */}
        <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-white/30 to-transparent dark:from-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Side accent line based on content type */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-500 ${
          note.imageUrl
            ? "bg-gradient-to-b from-cyan-500 to-cyan-600"
            : note.content.length > 1000
            ? "bg-gradient-to-b from-green-500 to-green-600"
            : note.content.length > 500
            ? "bg-gradient-to-b from-blue-500 to-blue-600"
            : "bg-gradient-to-b from-amber-500 to-amber-600"
        } opacity-0 group-hover:opacity-100 group-hover:w-1.5`}
      />
    </Card>
  );
}
