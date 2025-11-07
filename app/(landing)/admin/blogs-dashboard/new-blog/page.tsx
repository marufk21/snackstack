"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { ArrowLeftIcon } from "lucide-react";
import { createBlog } from "@/lib/appwrite/services";
import Image from "next/image";
import { storage } from "@/lib/appwrite/config";
import { ID } from "appwrite";
import conf from "@/config/appwrite";
import dynamic from "next/dynamic";

// Dynamically import RichTextEditor with no SSR
const RichTextEditor = dynamic(
  () => import("@/components/landing/richtext-editor"),
  { ssr: false }
);

export default function NewBlog() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [author, setAuthor] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("draft");
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
    if (!isLoggedIn) {
      router.push("/admin");
    } else {
      setIsAuthChecked(true);
    }
  }, [router]);

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
    setIsSubmitting(true);

    try {
      let coverImageUrl = "";
      
      // Upload image to Appwrite Storage if one was selected
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

      const newBlog = {
        title,
        excerpt,
        content,
        coverImage: coverImageUrl || undefined,
        author,
        status,
      };

      await createBlog(newBlog);
      alert("Blog post created successfully!");
      router.push("/admin/blogs-dashboard");
    } catch (error) {
      console.error("Error creating blog:", error);
      alert("Failed to create blog. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
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
          <CardHeader>
            <CardTitle className="text-2xl py-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              Create New Blog Post
            </CardTitle>
            <CardDescription>
              Fill in the details below to create a new blog post
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter blog title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Input
                  id="excerpt"
                  placeholder="Short description of the blog"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  placeholder="Author name"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverImage">Cover Image</Label>
                <Input
                  id="coverImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="cursor-pointer"
                />
                {imagePreview && (
                  <div className="relative h-48 w-full mt-2">
                    <Image
                      src={imagePreview}
                      alt="Cover preview"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover rounded-lg"
                      unoptimized={!imagePreview.startsWith("http") || imagePreview.includes("cloud.appwrite.io")}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <RichTextEditor
                  initialContent={content}
                  onChange={setContent}
                />
              </div>
            </CardContent>

            <CardFooter className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/blogs-dashboard")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg transition-all duration-200 hover:scale-105"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Blog"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </>
  );
}
