"use client";

import { useSession } from "next-auth/react";
import { Loader2, Sparkles } from "lucide-react";

interface WelcomeHeaderProps {
  className?: string;
}

export function WelcomeHeader({ className = "" }: WelcomeHeaderProps) {
  const { data: session, status } = useSession();
  const isLoaded = status !== "loading";

  if (!isLoaded) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const firstName = session.user.name?.split(" ")[0] || "User";

  return (
    <div className={`relative ${className} animate-fade-in-up`}>
      {/* Subtle gradient background */}
      <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/5 via-teal-500/5 to-emerald-500/5 dark:from-cyan-500/10 dark:via-teal-500/10 dark:to-emerald-500/10 rounded-2xl blur-2xl -z-10 opacity-50" />

      <div className="relative">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground transition-all duration-300">
            Welcome back, <span className="gradient-text">{firstName}</span>! 👋
          </h1>
          <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-cyan-500 animate-pulse-glow" />
        </div>
        <p className="text-sm md:text-base text-muted-foreground transition-colors duration-300">
          Ready to capture and enhance your ideas with AI?
        </p>
      </div>
    </div>
  );
}
