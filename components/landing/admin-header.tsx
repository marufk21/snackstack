"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOutIcon, HomeIcon, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function AdminHeader() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    router.push("/");
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-black/40"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin/blogs-dashboard"
              className="group flex items-center gap-3"
            >
              <div className="relative h-10 w-10 overflow-hidden rounded-xl transition-transform group-hover:scale-105">
                <Image
                  src="/logo.svg"
                  alt="SnackStack Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400">
                  SnackStack
                </span>
                <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Admin Panel
                </span>
              </div>
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="flex items-center text-gray-600 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/20"
            >
              <LogOutIcon className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden">Exit</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
