"use client";

import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

interface WelcomeHeaderProps {
  className?: string;
}

export function WelcomeHeader({ className = "" }: WelcomeHeaderProps) {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const firstName = user.firstName || "User";

  return (
    <div className={`${className}`}>
      <h1 className="text-2xl md:text-3xl font-bold text-foreground">
        Welcome back, {firstName}! 👋
      </h1>
      <p className="text-muted-foreground mt-1">
        Ready to capture your thoughts and ideas?
      </p>
    </div>
  );
}
