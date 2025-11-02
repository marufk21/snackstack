"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
} from "lucide-react";
import { Blog } from "@/lib/appwrite/config";
import { getBlogs, deleteBlog } from "@/lib/appwrite/services";
import { DeleteModal } from "@/components/landing/modal-delete";

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
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <>
      <main className="container mx-auto px-4 py-6 relative z-10">
        <Tabs defaultValue="blogs" className="w-full my-4 sm:my-6">
          <TabsContent value="blogs" className="space-y-2">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                <CardHeader className="py-3 px-4 sm:px-6">
                  <CardTitle className="text-lg sm:text-2xl py-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                    Manage Blogs
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Create, View, edit and delete your blog posts
                  </CardDescription>
                </CardHeader>

                <div className="flex items-center gap-2 px-4 sm:px-6 pb-4 sm:pb-0">
                  <Button
                    onClick={() =>
                      router.push("/admin/blogs-dashboard/new-blog")
                    }
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg transition-all duration-200 hover:scale-105 flex items-center text-sm"
                  >
                    <PlusIcon className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">New Blog</span>
                    <span className="sm:hidden">New</span>
                  </Button>
                </div>
              </div>

              <CardContent className="p-3 py-1">
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="inline-block min-w-full align-middle">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead>
                        <tr className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/30 dark:to-purple-900/30">
                          <th
                            scope="col"
                            className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                          >
                            #
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                          >
                            Title
                          </th>
                          <th
                            scope="col"
                            className="hidden sm:table-cell px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                          >
                            Author
                          </th>
                          <th
                            scope="col"
                            className="hidden sm:table-cell px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                          >
                            Date
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                          >
                            Status
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white/60 dark:bg-gray-800/60 divide-y divide-gray-200/50 dark:divide-gray-700/50">
                        {blogs.length === 0 ? (
                          <tr>
                            <td
                              colSpan={6}
                              className="px-3 py-4 text-center text-sm text-gray-500"
                            >
                              No blogs found. Create your first blog post!
                            </td>
                          </tr>
                        ) : (
                          blogs.map((blog, key) => (
                            <tr key={blog.id} className="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/20 transition-colors">
                              <td className="px-3 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                                {key + 1}.
                              </td>
                              <td className="px-3 py-3 text-sm text-gray-900 dark:text-gray-100">
                                <div className="max-w-[200px] truncate">
                                  {blog.title}
                                </div>
                              </td>
                              <td className="hidden sm:table-cell px-3 py-3 text-sm text-gray-500 dark:text-gray-400">
                                {blog.author}
                              </td>
                              <td className="hidden sm:table-cell px-3 py-3 text-sm text-gray-500 dark:text-gray-400">
                                {blog.date}
                              </td>
                              <td className="px-3 py-3 text-sm">
                                <span
                                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${
                                    blog.status === "published"
                                      ? "bg-green-100 text-green-800"
                                      : blog.status === "draft"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {blog.status}
                                </span>
                              </td>
                              <td className="px-3 py-3 text-sm text-gray-500 dark:text-gray-400">
                                <div className="flex justify-center gap-1 sm:gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      router.push(
                                        `/admin/blogs-dashboard/view-blog?id=${blog.id}`
                                      )
                                    }
                                    className="flex items-center"
                                  >
                                    <EyeIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      router.push(
                                        `/admin/blogs-dashboard/edit-blog?id=${blog.id}`
                                      )
                                    }
                                    className="flex items-center"
                                  >
                                    <PencilIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openDeleteModal(blog)}
                                    className="flex items-center text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <TrashIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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
