"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeftIcon, UploadCloud, ChevronDown } from "lucide-react";
import { getBlogById, updateBlog } from "@/lib/appwrite/services";
import Image from "next/image";
import { storage } from "@/lib/appwrite/config";
import { ID } from "appwrite";
import conf from "@/config/appwrite";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Loader } from "@/components/ui/loader";

// Dynamically import RichTextEditor with no SSR
const RichTextEditor = dynamic(
  () => import("@/components/landing/richtext-editor"),
  { ssr: false }
);

function EditBlogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const blogId = searchParams.get("id");

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [author, setAuthor] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("draft");
  const [statusOpen, setStatusOpen] = useState(false);

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
          const blog = await getBlogById(blogId);
          setTitle(blog.title);
          setExcerpt(blog.excerpt);
          setContent(blog.content);
          setImagePreview(blog.coverImage || "");
          setAuthor(blog.author);
          setStatus(blog.status || "draft");
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogId) return;

    setIsSubmitting(true);

    try {
      let coverImageUrl = imagePreview;

      // Upload new image to Appwrite Storage if one was selected
      if (coverImage) {
        const fileId = ID.unique();
        await storage.createFile(
          conf.appwriteBucketId,
          fileId,
          coverImage
        );

        // Get the file URL
        coverImageUrl = storage.getFileView(
          conf.appwriteBucketId,
          fileId
        ).toString();
      }

      const updatedBlog = {
        title,
        excerpt,
        content,
        coverImage: coverImageUrl || undefined,
        author,
        status,
      };

      await updateBlog(blogId, updatedBlog);
      // alert("Blog post updated successfully!");
      router.push("/admin/blogs-dashboard");
    } catch (error) {
      console.error("Error updating blog:", error);
      alert("Failed to update blog. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loader />;
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
          <CardHeader className="border-b border-gray-200/50 dark:border-gray-700/50 p-6">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-rose-500 bg-clip-text text-transparent">
              Edit Blog Post
            </CardTitle>
            <CardDescription className="text-base">
              Update the details of your blog post
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter blog title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="bg-white/50 dark:bg-black/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author" className="text-sm font-medium">Author</Label>
                  <Input
                    id="author"
                    placeholder="Author name"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                    className="bg-white/50 dark:bg-black/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt" className="text-sm font-medium">Excerpt</Label>
                <Input
                  id="excerpt"
                  placeholder="Short description of the blog"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  required
                  className="bg-white/50 dark:bg-black/20"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium">Status</Label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setStatusOpen(!statusOpen)}
                      className="w-full h-9 px-3 py-1 flex items-center justify-between rounded-md border border-input bg-white/50 dark:bg-black/20 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                    >
                      <span className="capitalize">{status}</span>
                      <ChevronDown className={`h-4 w-4 opacity-50 transition-transform ${statusOpen ? "rotate-180" : ""}`} />
                    </button>

                    {statusOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setStatusOpen(false)}
                        />
                        <div className="absolute top-full left-0 w-full mt-1 rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-lg z-50 py-1 animate-in fade-in zoom-in-95 duration-100">
                          {["draft", "published"].map((option) => (
                            <div
                              key={option}
                              onClick={() => {
                                setStatus(option);
                                setStatusOpen(false);
                              }}
                              className={`px-3 py-2 text-sm cursor-pointer capitalize hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors ${status === option ? "bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400" : ""
                                }`}
                            >
                              {option}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coverImage" className="text-sm font-medium">Cover Image</Label>
                  <div className="relative">
                    <Input
                      id="coverImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="cursor-pointer bg-white/50 dark:bg-black/20 file:mr-1 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 dark:file:bg-teal-900/20 dark:file:text-teal-400"
                    />
                    <UploadCloud className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {imagePreview && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative h-64 w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700"
                >
                  <Image
                    src={imagePreview}
                    alt="Cover preview"
                    fill
                    className="object-cover"
                    unoptimized={!imagePreview.startsWith("http") || imagePreview.includes("cloud.appwrite.io")}
                  />
                </motion.div>
              )}

              <div className="space-y-2">
                <Label htmlFor="content" className="text-sm font-medium">Content</Label>
                <div className="min-h-[400px]">
                  <RichTextEditor
                    initialContent={content}
                    onChange={setContent}
                    className="min-h-[400px] rounded-md border border-input bg-white/50 dark:bg-black/20"
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end gap-3 border-t border-gray-200/50 dark:border-gray-700/50 p-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/blogs-dashboard")}
                className="bg-white/50 dark:bg-black/20"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white shadow-lg transition-all hover:scale-105"
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Updating...
                  </>
                ) : (
                  "Update Blog Post"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </main>
  );
}

export default function EditBlog() {
  return (
    <Suspense fallback={<Loader />}>
      <EditBlogContent />
    </Suspense>
  );
}
