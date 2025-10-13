"use client";

import React from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

interface ThemeToggleAnimationProps {
  showLabel?: boolean;
}

export default function ThemeToggleButton({
  showLabel = false,
}: ThemeToggleAnimationProps) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = React.useCallback(() => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  }, [theme, setTheme]);

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size="icon"
      className="w-9 p-0 h-9 relative group text-muted-foreground hover:text-foreground hover:bg-accent"
      name="Theme Toggle Button"
    >
      <SunIcon className="size-[1rem] sm:size-[1.3rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <MoonIcon className="absolute size-[1rem] sm:size-[1.3rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      {showLabel && (
        <span className="hidden group-hover:block border rounded-full px-2 absolute -top-10">
          Theme: {theme}
        </span>
      )}
    </Button>
  );
}
