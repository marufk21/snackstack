"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  FileText,
  Calendar,
  User,
} from "lucide-react";
import { Blog } from "@/lib/appwrite/config";
import { getBlogs, deleteBlog } from "@/lib/appwrite/services";
import { DeleteModal } from "@/components/landing/modal-delete";
import { m, AnimatePresence } from "framer-motion";
import { Loader } from "@/components/ui/loader";

export default function BlogsDashboard() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);

  // Check if user is logged in and load blogs
  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";

      if (!isLoggedIn) {
        router.push("/admin");
      } else {
        loadBlogs();
      }
    };

    checkAuth();
  }, [router]);

  const loadBlogs = async () => {
    try {
      const fetchedBlogs = await getBlogs();
      setBlogs(fetchedBlogs);
    } catch (error) {
      console.error("Error loading blogs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (blog: Blog) => {
    setBlogToDelete(blog);
    setDeleteModalOpen(true);
  };

  // Handle blog deletion
  const handleDeleteBlog = async () => {
    if (!blogToDelete) return;

    try {
      await deleteBlog(blogToDelete.id);
      await loadBlogs();
      setDeleteModalOpen(false);
      setBlogToDelete(null);
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete blog. Please try again.");
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <main className="container mx-auto px-4 py-8 relative z-10">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Tabs defaultValue="blogs" className="w-full">
            <TabsContent value="blogs" className="space-y-6">
              <Card className="overflow-hidden border-white/20 bg-white/70 backdrop-blur-xl shadow-xl dark:border-white/10 dark:bg-black/40">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200/50 dark:border-gray-700/50 p-6">
                  <div className="space-y-1">
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-rose-500 bg-clip-text text-transparent">
                      Manage Blogs
                    </CardTitle>
                    <CardDescription className="text-base">
                      Create, view, edit and delete your blog posts
                    </CardDescription>
                  </div>

                  <div className="mt-4 sm:mt-0">
                    <Button
                      onClick={() =>
                        router.push("/admin/blogs-dashboard/new-blog")
                      }
                      className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-2 text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02]"
                    >
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                      <div className="relative flex items-center gap-2">
                        <PlusIcon className="h-4 w-4" />
                        <span>New Blog Post</span>
                      </div>
                    </Button>
                  </div>
                </div>

                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50/50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400">
                        <tr>
                          <th className="px-6 py-4 font-medium">#</th>
                          <th className="px-6 py-4 font-medium">Title</th>
                          <th className="px-6 py-4 font-medium hidden sm:table-cell">
                            Author
                          </th>
                          <th className="px-6 py-4 font-medium hidden sm:table-cell">
                            Date
                          </th>
                          <th className="px-6 py-4 font-medium">Status</th>
                          <th className="px-6 py-4 font-medium text-center">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                        <AnimatePresence>
                          {blogs.length === 0 ? (
                            <m.tr
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              <td
                                colSpan={6}
                                className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                              >
                                <div className="flex flex-col items-center gap-3">
                                  <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                                    <FileText className="h-6 w-6 text-gray-400" />
                                  </div>
                                  <p>
                                    No blogs found. Create your first blog post!
                                  </p>
                                </div>
                              </td>
                            </m.tr>
                          ) : (
                            blogs.map((blog, index) => (
                              <m.tr
                                key={blog.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ delay: index * 0.05 }}
                                className="group hover:bg-teal-50/30 dark:hover:bg-teal-900/10 transition-colors"
                              >
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                                  {index + 1}
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="relative h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                                      {blog.coverImage ? (
                                        <Image
                                          src={blog.coverImage}
                                          alt=""
                                          fill
                                          className="object-cover"
                                          unoptimized={blog.coverImage.includes(
                                            "appwrite"
                                          )}
                                        />
                                      ) : (
                                        <FileText className="h-5 w-5 text-gray-400" />
                                      )}
                                    </div>
                                    <span className="font-medium text-gray-900 dark:text-gray-100 line-clamp-1 max-w-[200px] sm:max-w-[300px]">
                                      {blog.title}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 hidden sm:table-cell text-gray-500 dark:text-gray-400">
                                  <div className="flex items-center gap-2">
                                    <User className="h-3.5 w-3.5" />
                                    <span>{blog.author}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 hidden sm:table-cell text-gray-500 dark:text-gray-400">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-3.5 w-3.5" />
                                    <span>{blog.date}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border ${
                                      blog.status === "published"
                                        ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30"
                                        : blog.status === "draft"
                                        ? "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900/30"
                                        : "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
                                    }`}
                                  >
                                    <span
                                      className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                                        blog.status === "published"
                                          ? "bg-green-500"
                                          : blog.status === "draft"
                                          ? "bg-yellow-500"
                                          : "bg-gray-500"
                                      }`}
                                    />
                                    {blog.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center justify-center gap-2 transition-opacity">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() =>
                                        router.push(
                                          `/admin/blogs-dashboard/view-blog?id=${blog.id}`
                                        )
                                      }
                                      className="h-8 w-8 text-gray-500 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20"
                                      title="View"
                                    >
                                      <EyeIcon className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() =>
                                        router.push(
                                          `/admin/blogs-dashboard/edit-blog?id=${blog.id}`
                                        )
                                      }
                                      className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                      title="Edit"
                                    >
                                      <PencilIcon className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => openDeleteModal(blog)}
                                      className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                      title="Delete"
                                    >
                                      <TrashIcon className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </td>
                              </m.tr>
                            ))
                          )}
                        </AnimatePresence>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </m.div>
      </main>

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setBlogToDelete(null);
        }}
        onConfirm={handleDeleteBlog}
        title="Delete Blog Post"
        description={`Are you sure you want to delete "${blogToDelete?.title}"? This action cannot be undone.`}
      />
    </>
  );
}
