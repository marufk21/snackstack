"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import {
  ArrowLeft,
  Edit,
  Calendar,
  Clock,
  Loader2,
  ImageIcon,
} from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  slug: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export default function NotePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  // Fetch note by slug
  const { data, isLoading, error } = useQuery({
    queryKey: ["note", slug],
    queryFn: async () => {
      // We need to get all notes and find by slug since we don't have a slug endpoint
      const response = await axios.get("/api/notes");
      const notes = response.data.notes as Note[];
      const note = notes.find((n) => n.slug === slug);

      if (!note) {
        throw new Error("Note not found");
      }

      return note;
    },
    enabled: !!slug,
  });

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

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold">Note not found</h1>
        <p className="text-muted-foreground">
          The note you're looking for doesn't exist or has been deleted.
        </p>
        <Button onClick={() => router.push("/notes")} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Notes
        </Button>
      </div>
    );
  }

  const note = data;
  const createdDate = new Date(note.createdAt);
  const updatedDate = new Date(note.updatedAt);
  const isUpdated = updatedDate.getTime() !== createdDate.getTime();

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button onClick={() => router.push("/notes")} variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Notes
        </Button>

        <Button
          onClick={() => router.push(`/notes/edit/${note.id}`)}
          variant="outline"
          size="sm"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Note
        </Button>
      </div>

      {/* Note Content */}
      <Card className="p-8">
        {/* Title */}
        <div className="border-b pb-6 mb-6">
          <h1 className="text-4xl font-bold mb-4">{note.title}</h1>

          {/* Metadata */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Created: {createdDate.toLocaleDateString()}
            </div>

            {isUpdated && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Updated: {updatedDate.toLocaleDateString()}
              </div>
            )}

            <Badge variant="secondary">{note.slug}</Badge>
          </div>
        </div>

        {/* Attached Image */}
        {note.imageUrl && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <ImageIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Attached Image</span>
            </div>
            <img
              src={note.imageUrl}
              alt="Note attachment"
              className="max-w-full h-auto rounded-lg border"
            />
          </div>
        )}

        {/* Markdown Content */}
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              // Custom components for better styling
              h1: ({ children, ...props }) => (
                <h1
                  className="text-3xl font-bold mb-4 mt-8 first:mt-0"
                  {...props}
                >
                  {children}
                </h1>
              ),
              h2: ({ children, ...props }) => (
                <h2 className="text-2xl font-semibold mb-3 mt-6" {...props}>
                  {children}
                </h2>
              ),
              h3: ({ children, ...props }) => (
                <h3 className="text-xl font-semibold mb-2 mt-4" {...props}>
                  {children}
                </h3>
              ),
              p: ({ children, ...props }) => (
                <p className="mb-4 leading-7" {...props}>
                  {children}
                </p>
              ),
              ul: ({ children, ...props }) => (
                <ul className="mb-4 ml-6 list-disc" {...props}>
                  {children}
                </ul>
              ),
              ol: ({ children, ...props }) => (
                <ol className="mb-4 ml-6 list-decimal" {...props}>
                  {children}
                </ol>
              ),
              li: ({ children, ...props }) => (
                <li className="mb-1" {...props}>
                  {children}
                </li>
              ),
              blockquote: ({ children, ...props }) => (
                <blockquote
                  className="border-l-4 border-muted pl-4 italic my-4"
                  {...props}
                >
                  {children}
                </blockquote>
              ),
              code: ({ inline, children, ...props }: any) =>
                inline ? (
                  <code
                    className="bg-muted px-1 py-0.5 rounded text-sm"
                    {...props}
                  >
                    {children}
                  </code>
                ) : (
                  <code
                    className="block bg-muted p-4 rounded-lg overflow-x-auto"
                    {...props}
                  >
                    {children}
                  </code>
                ),
              pre: ({ children, ...props }) => (
                <pre
                  className="bg-muted p-4 rounded-lg overflow-x-auto mb-4"
                  {...props}
                >
                  {children}
                </pre>
              ),
              table: ({ children, ...props }) => (
                <div className="overflow-x-auto mb-4">
                  <table
                    className="w-full border-collapse border border-border"
                    {...props}
                  >
                    {children}
                  </table>
                </div>
              ),
              th: ({ children, ...props }) => (
                <th
                  className="border border-border px-4 py-2 bg-muted font-semibold text-left"
                  {...props}
                >
                  {children}
                </th>
              ),
              td: ({ children, ...props }) => (
                <td className="border border-border px-4 py-2" {...props}>
                  {children}
                </td>
              ),
            }}
          >
            {note.content}
          </ReactMarkdown>
        </div>
      </Card>

      {/* Footer */}
      <div className="mt-8 text-center">
        <Button onClick={() => router.push(`/notes/edit/${note.id}`)} size="lg">
          <Edit className="w-4 h-4 mr-2" />
          Edit this Note
        </Button>
      </div>
    </div>
  );
}
