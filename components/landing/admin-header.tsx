"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOutIcon, HomeIcon } from "lucide-react";
import Link from "next/link";

export default function AdminHeader() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-md backdrop-saturate-150">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin/blogs-dashboard"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <div className="flex flex-col">
                <span className="text-foreground font-bold text-xl">
                  SnackStack
                </span>
                <span className="text-xs text-muted-foreground hidden sm:block">
                  Admin Panel
                </span>
              </div>
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="hidden sm:flex"
            >
              <Link href="/">
                <HomeIcon className="h-4 w-4 mr-2" />
                Home
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center"
            >
              <LogOutIcon className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden">Exit</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

