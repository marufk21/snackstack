import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Calendar, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { db } from "@/lib/database";
import { notFound } from "next/navigation";

// Type for public note
interface PublicNote {
  id: string;
  title: string;
  content: string;
  slug: string;
  imageUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    name: string;
    email: string;
  };
}

// Server function to get note by slug
async function getNoteBySlug(slug: string): Promise<PublicNote | null> {
  try {
    const note = await db.note.findUnique({
      where: { slug },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
    return note;
  } catch (error) {
    console.error("Error fetching note:", error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const note = await getNoteBySlug(slug);

  if (!note) {
    return {
      title: "Note not found - SnackStack",
      description: "The requested note could not be found.",
    };
  }

  const description =
    note.content.substring(0, 160).replace(/\n/g, " ") + "...";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://localhost:3000";

  return {
    title: `${note.title} - SnackStack`,
    description,
    authors: [{ name: note.user.name }],
    keywords: [`${note.title}`, "note", "SnackStack", "AI-powered notes"],
    openGraph: {
      title: note.title,
      description,
      type: "article",
      url: `${baseUrl}/notes/${slug}`,
      siteName: "SnackStack",
      images: note.imageUrl
        ? [
            {
              url: note.imageUrl,
              alt: note.title,
            },
          ]
        : undefined,
      authors: [note.user.name],
      publishedTime: note.createdAt.toISOString(),
      modifiedTime: note.updatedAt.toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: note.title,
      description,
      images: note.imageUrl ? [note.imageUrl] : undefined,
    },
    alternates: {
      canonical: `${baseUrl}/notes/${slug}`,
    },
  };
}

// Server component
export default async function PublicNotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = await getNoteBySlug(slug);

  if (!note) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center gap-4 mb-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        <Card className="p-8">
          {/* Note Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{note.title}</h1>

            {/* Meta Information */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>By {note.user.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(note.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              {note.updatedAt !== note.createdAt && (
                <div className="flex items-center gap-2">
                  <span>
                    Updated {new Date(note.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Note Image */}
          {note.imageUrl && (
            <div className="mb-8">
              <Image
                src={note.imageUrl}
                alt={`Image for ${note.title}`}
                width={800}
                height={400}
                className="w-full h-auto rounded-lg object-cover"
              />
            </div>
          )}

          {/* Note Content */}
          <div className="prose prose-lg max-w-none">
            <div
              className="whitespace-pre-wrap"
              dangerouslySetInnerHTML={{
                __html: note.content.replace(/\n/g, "<br>"),
              }}
            />
          </div>

          {/* Call to Action */}
          <div className="mt-12 pt-8 border-t">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">
                Want to create your own notes?
              </h3>
              <p className="text-muted-foreground mb-4">
                Join SnackStack and start building your AI-powered knowledge
                base today.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button asChild>
                  <Link href="/sign-up">Get Started</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/sign-in">Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
