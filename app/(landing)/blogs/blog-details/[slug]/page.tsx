"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import * as React from "react";
import { getBlogs } from "@/lib/appwrite/services";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import BlogContentView from "@/components/landing/blog-content-view";
import { Blog } from "@/lib/appwrite/config";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function BlogDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = React.use(params);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [nextBlog, setNextBlog] = useState<Blog | null>(null);
  const [prevBlog, setPrevBlog] = useState<Blog | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadBlog = async () => {
      try {
        const blogs = await getBlogs();
        const blogData = blogs.find((b) => b.id === resolvedParams.slug);

        if (blogData) {
          // Find next and previous blogs
          const currentIndex = blogs.findIndex((b) => b.id === blogData.id);

          // Set next blog (if not the last blog)
          if (currentIndex < blogs.length - 1) {
            setNextBlog(blogs[currentIndex + 1]);
          } else {
            setNextBlog(null);
          }

          // Set previous blog (if not the first blog)
          if (currentIndex > 0) {
            setPrevBlog(blogs[currentIndex - 1]);
          } else {
            setPrevBlog(null);
          }

          setBlog(blogData);
        } else {
          setBlog(null);
        }
      } catch (error) {
        console.error("Error loading blog:", error);
        setBlog(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadBlog();
  }, [resolvedParams.slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 dark:border-purple-400"></div>
      </div>
    );
  }

  if (!blog) {
    notFound();
  }

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/blogs")}
          className="mb-6 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Blogs
        </Button>

        {/* Article Content */}
        <article className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden p-8 md:p-12">
          <BlogContentView blog={blog} />

          {/* Next/Previous navigation */}
          <div className="mt-12 border-t border-border pt-8 flex justify-between gap-4">
            {prevBlog ? (
              <Link
                href={`/blogs/blog-details/${prevBlog.id}`}
                className="group inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors max-w-[45%]"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                <span className="truncate">Previous: {prevBlog.title}</span>
              </Link>
            ) : (
              <div></div>
            )}

            {nextBlog && (
              <Link
                href={`/blogs/blog-details/${nextBlog.id}`}
                className="group inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors max-w-[45%] ml-auto"
              >
                <span className="truncate">Next: {nextBlog.title}</span>
                <ArrowRightIcon className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
