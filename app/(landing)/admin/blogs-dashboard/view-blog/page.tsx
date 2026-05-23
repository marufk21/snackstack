"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ArrowLeftIcon } from "lucide-react";
import { getBlogById } from "@/server/integrations/appwrite/services";
import { Blog } from "@/server/integrations/appwrite/config";
import BlogContentView from "@/components/landing/blog-content-view";
import { motion } from "framer-motion";
import { Loader } from "@/components/ui/loader";

// Disable static generation for this page
export const dynamic = "force-dynamic";

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
    return <Loader />;
  }

  if (!blog) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-lg text-gray-500 dark:text-gray-400">Blog not found</div>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 flex items-center">
          <div
            onClick={() => router.push("/admin/blogs-dashboard")}
            className="group flex items-center cursor-pointer text-gray-600 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-400 transition-colors"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/80 ring-1 ring-gray-200 transition-all group-hover:bg-teal-50 group-hover:ring-teal-200 dark:bg-gray-800/50 dark:ring-gray-700 dark:group-hover:bg-teal-900/20 dark:group-hover:ring-teal-500/30 mr-3 backdrop-blur-sm">
              <ArrowLeftIcon className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
            </div>
            <span className="text-base font-medium">Back to Dashboard</span>
          </div>
        </div>

        <Card className="overflow-hidden border-white/20 bg-white/70 backdrop-blur-xl shadow-xl dark:border-white/10 dark:bg-black/40">
          <CardContent className="pt-6">
            <BlogContentView blog={blog} />
          </CardContent>
          <CardFooter className="flex justify-end border-t border-gray-200/50 dark:border-gray-700/50 p-6">
            <Button
              onClick={handleEdit}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-2 text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02]"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              <div className="relative flex items-center gap-2">
                <span>Edit Blog</span>
              </div>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </main>
  );
}

export default function ViewBlog() {
  return (
    <Suspense fallback={<Loader />}>
      <ViewBlogContent />
    </Suspense>
  );
}