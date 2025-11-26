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
    <div className="min-h-screen relative overflow-hidden bg-background selection:bg-primary/20">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 h-full w-full bg-background bg-grid-pattern [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

      <div className="absolute top-0 left-0 z-0 h-full w-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[100px] dark:bg-purple-900/10" />
        <div className="absolute top-[30%] -right-[10%] h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[100px] dark:bg-blue-900/10" />
        <div className="absolute -bottom-[10%] left-[20%] h-[600px] w-[600px] rounded-full bg-pink-500/10 blur-[100px] dark:bg-pink-900/10" />
      </div>

      <div className="relative z-10">
        <AdminHeader />
        {children}
      </div>
    </div>
  );
}
