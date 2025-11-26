"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/landing/admin-header";

import MistBackground from "@/components/ui/mist-background";

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
      <MistBackground />

      <div className="relative z-10">
        <AdminHeader />
        {children}
      </div>
    </div>
  );
}
