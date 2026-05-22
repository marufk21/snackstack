"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { motion } from "framer-motion";
import { EyeIcon, EyeOffIcon, ShieldCheck } from "lucide-react";

// Disable static generation for this page
export const dynamic = "force-dynamic";

// Predefined superuser credentials
const ADMIN_ID = process.env.NEXT_PUBLIC_ADMIN_ID;
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

import MistBackground from "@/components/ui/mist-background";

export default function AdminLogin() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
    if (isLoggedIn) {
      router.push("/admin/blogs-dashboard");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate network delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Check if credentials match the superuser
    if (userId === ADMIN_ID && password === ADMIN_PASSWORD) {
      // Store login state in localStorage
      localStorage.setItem("adminLoggedIn", "true");
      // Redirect to blogs dashboard
      router.push("/admin/blogs-dashboard");
    } else {
      setError("Invalid credentials. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background selection:bg-primary/20">
      <MistBackground />

      <div className="relative z-10 w-full max-w-md px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="overflow-hidden rounded-3xl border border-white/20 bg-white/70 backdrop-blur-xl shadow-2xl dark:border-white/10 dark:bg-black/40"
        >
          <div className="p-8 sm:p-10">
            {/* Header */}
            <div className="flex flex-col items-center text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="relative mb-6 h-16 w-16"
              >
                <Image
                  src="/logo.svg"
                  alt="SnackStack Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
              >
                Admin Access
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mb-8 text-sm text-gray-500 dark:text-gray-400"
              >
                Enter your credentials to access the dashboard
              </motion.p>
            </div>

            {/* Login Form */}
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              onSubmit={handleLogin}
              className="space-y-4"
            >
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="rounded-lg bg-red-50 p-3 text-sm text-red-500 dark:bg-red-900/20 dark:text-red-400 border border-red-100 dark:border-red-900/30"
                >
                  {error}
                </motion.div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 ml-1">
                  User ID
                </label>
                <Input
                  type="text"
                  placeholder="Enter admin ID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                  className="bg-white/50 dark:bg-black/20 border-gray-200 dark:border-gray-700 focus:ring-cyan-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 ml-1">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white/50 dark:bg-black/20 border-gray-200 dark:border-gray-700 focus:ring-cyan-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-4 py-5 text-base font-medium text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                <span className="relative flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    "Access Dashboard"
                  )}
                </span>
              </Button>
            </motion.form>
          </div>

          {/* Decorative bottom bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500" />
        </motion.div>
      </div>
    </div>
  );
}
