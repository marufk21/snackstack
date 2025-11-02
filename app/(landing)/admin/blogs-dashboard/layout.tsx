"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/landing/admin-header";

export default function BlogsDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // Check authentication on client side
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
    if (!isLoggedIn) {
      router.push("/admin");
    }
  }, [router]);

  useEffect(() => {
    const handlePopState = () => {
      // If user tries to go back, stay on dashboard
      window.history.pushState(
        null,
        "/admin/blogs-dashboard",
        window.location.href
      );
    };

    // Push a dummy state to trap back
    window.history.pushState(
      null,
      "/admin/blogs-dashboard",
      window.location.href
    );
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/70 via-purple-50/30 to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 -z-10" />
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-indigo-300/20 to-purple-300/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-blue-300/20 to-purple-300/20 rounded-full blur-3xl -z-10" />
      <AdminHeader />
      {children}
    </div>
  );
}
