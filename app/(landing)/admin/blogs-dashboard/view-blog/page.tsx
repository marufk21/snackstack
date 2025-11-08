"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Disable static generation for this page
export const dynamic = "force-dynamic";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ArrowLeftIcon, PencilIcon } from "lucide-react";
import { getBlogById } from "@/lib/appwrite/services";
import { Blog } from "@/lib/appwrite/config";
import BlogContentView from "@/components/landing/blog-content-view";

function ViewBlogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const blogId = searchParams.get("id");

  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in and load blog data
  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window === 'undefined') return;
      
      const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";

      if (!isLoggedIn) {
        router.push("/admin");
        return;
      }

      // Load blog data
      if (blogId) {
        try {
          const fetchedBlog = await getBlogById(blogId);
          setBlog(fetchedBlog);
        } catch (error) {
          console.error("Error loading blog:", error);
          router.push("/admin/blogs-dashboard");
        }
      } else {
        // No ID provided, redirect back to dashboard
        router.push("/admin/blogs-dashboard");
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [router, blogId]);

  const handleEdit = () => {
    if (!blog) return;
    router.push(`/admin/blogs-dashboard/edit-blog?id=${blog.id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-700">Blog not found</div>
      </div>
    );
  }

  return (
    <>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="mt-2 mb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/admin/blogs-dashboard")}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border-0">
          <CardContent className="pt-6">
            <BlogContentView blog={blog} />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              onClick={handleEdit}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg transition-all duration-200 hover:scale-105 flex items-center"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit Blog
            </Button>
          </CardFooter>
        </Card>
      </main>
    </>
  );
}

export default function ViewBlog() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <ViewBlogContent />
    </Suspense>
  );
}    