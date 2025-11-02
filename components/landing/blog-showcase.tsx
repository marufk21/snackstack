"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Blog } from "@/lib/appwrite/config";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export default function BlogShowCase({ blogs }: { blogs: Blog[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useIsMobile();
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const blogsPerPage = isLargeScreen ? 9 : isMobile ? 4 : 6;

  // Calculate pagination details
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-10">
        {blogs.length > 0 ? (
          currentBlogs.map((blog: Blog) => (
            <Link
              key={blog.id}
              href={`/blogs/blog-details/${blog.id}`}
              className="group"
            >
              <div className="bg-white dark:bg-card rounded-lg shadow-md dark:shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-lg dark:hover:shadow-xl hover:-translate-y-1 h-[450px] flex flex-col border border-gray-200/50 dark:border-gray-800/50">
                {blog.coverImage && (
                  <div className="relative h-48 w-full flex-shrink-0">
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
                      unoptimized={!blog.coverImage.startsWith("http")}
                    />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-xl font-semibold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent group-hover:from-indigo-700 group-hover:to-purple-700 dark:group-hover:from-indigo-300 dark:group-hover:to-purple-300 transition-colors line-clamp-2">
                    {blog.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 flex-grow">
                    {blog.excerpt}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span>{blog.date}</span>
                    <span className="mx-2">•</span>
                    <span>{blog.author}</span>
                  </div>
                  <div className="mt-auto flex items-center font-medium">
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">Read more</span>
                    <svg
                      className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform text-indigo-600 dark:text-indigo-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center items-center py-20">
            <div className="text-center">
              <h3 className="text-2xl font-semibold mb-2 text-gray-700 dark:text-gray-300">
                No Posts Available
              </h3>
              <p className="text-gray-500 dark:text-gray-400">Check back later for new content</p>
            </div>
          </div>
        )}
      </div>

      {/* Pagination controls */}
      {blogs.length > 0 && (
        <div className="mt-8 flex justify-center gap-2">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-all",
              currentPage > 1
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-400 dark:hover:to-purple-400"
                : "bg-white dark:bg-card text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-card/80"
            )}
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-all",
              currentPage < totalPages
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-400 dark:hover:to-purple-400"
                : "bg-white dark:bg-card text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-card/80"
            )}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}
