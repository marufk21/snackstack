"use client";

import Image from "next/image";
import { Blog } from "@/lib/appwrite/config";

interface BlogContentViewProps {
  blog: Blog;
  className?: string;
}

export default function BlogContentView({ blog, className = "" }: BlogContentViewProps) {
  if (!blog) return null;

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Title */}
      <div className="space-y-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
          {blog.title}
        </h1>
        <div className="flex items-center text-sm text-muted-foreground">
          <span>{blog.author}</span>
          <span className="mx-2">•</span>
          <span>{blog.date}</span>
        </div>
      </div>

      {/* Cover Image */}
      {blog.coverImage && (
        <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden border border-border">
          <Image
            src={blog.coverImage}
            alt={blog.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
        </div>
      )}

      {/* Excerpt */}
      {blog.excerpt && (
        <p className="text-xl text-muted-foreground leading-relaxed border-l-4 border-cyan-500 pl-4">
          {blog.excerpt}
        </p>
      )}

      {/* Content */}
      <div 
        className="prose prose-lg dark:prose-invert max-w-none 
          prose-headings:text-foreground prose-headings:font-bold
          prose-p:text-muted-foreground prose-p:leading-relaxed
          prose-a:text-cyan-600 dark:prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-foreground
          prose-code:text-foreground prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded
          prose-pre:bg-muted prose-pre:border prose-pre:border-border
          prose-blockquote:border-cyan-500 prose-blockquote:border-l-4 prose-blockquote:pl-4 prose-blockquote:text-muted-foreground
          prose-img:rounded-xl prose-img:border prose-img:border-border"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </div>
  );
} 