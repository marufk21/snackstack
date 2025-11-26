"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { IconBrandGoogle } from "@tabler/icons-react";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn("google", { callbackUrl: "/app" });
    } catch (error) {
      console.error("Sign-in error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background selection:bg-primary/20">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 h-full w-full bg-background bg-grid-pattern [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      
      <div className="absolute top-0 left-0 z-0 h-full w-full overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] h-[500px] w-[500px] rounded-full bg-purple-500/20 blur-[100px] dark:bg-purple-900/20" />
        <div className="absolute top-[30%] -right-[10%] h-[400px] w-[400px] rounded-full bg-blue-500/20 blur-[100px] dark:bg-blue-900/20" />
        <div className="absolute -bottom-[10%] left-[20%] h-[600px] w-[600px] rounded-full bg-pink-500/20 blur-[100px] dark:bg-pink-900/20" />
      </div>

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
                className="relative mb-6 h-16 w-16 overflow-hidden rounded-2xl bg-gradient-to-br from-purple-100 to-blue-100 p-3 shadow-inner dark:from-gray-800 dark:to-gray-900"
              >
                <Image
                  src="/logo.svg"
                  alt="SnackStack Logo"
                  fill
                  className="object-contain p-2"
                  priority
                />
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mb-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white"
              >
                Welcome back
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mb-8 text-sm text-gray-500 dark:text-gray-400"
              >
                Sign in to SnackStack to continue your journey
              </motion.p>
            </div>

            {/* Sign-in Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="group relative w-full overflow-hidden rounded-xl bg-white px-4 py-6 text-base font-medium text-gray-900 shadow-lg transition-all hover:bg-gray-50 hover:shadow-xl dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                variant="outline"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-gray-100/50 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] dark:via-white/5" />
                <div className="relative flex items-center justify-center gap-3">
                  {isLoading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-900 border-t-transparent dark:border-white" />
                  ) : (
                    <IconBrandGoogle className="h-5 w-5 text-gray-900 dark:text-white" />
                  )}
                  <span>{isLoading ? "Signing in..." : "Continue with Google"}</span>
                </div>
              </Button>
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-800"
            >
              <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                By clicking continue, you agree to our{" "}
                <a href="#" className="underline hover:text-gray-900 dark:hover:text-white transition-colors">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="underline hover:text-gray-900 dark:hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </p>
            </motion.div>
          </div>
          
          {/* Decorative bottom bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500" />
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400"
        >
          New to SnackStack?{" "}
          <span className="font-medium text-purple-600 dark:text-purple-400">
            Just sign in to get started
          </span>
        </motion.p>
      </div>
    </div>
  );
}
