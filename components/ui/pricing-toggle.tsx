import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PricingToggleProps {
  isYearly: boolean;
  onToggle: (isYearly: boolean) => void;
}

export function PricingToggle({ isYearly, onToggle }: PricingToggleProps) {
  return (
    <div className="flex items-center justify-center p-1.5 bg-white/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 rounded-full backdrop-blur-sm">
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "px-6 py-2.5 rounded-full transition-all duration-300 font-medium",
          !isYearly
            ? "bg-white dark:bg-white/10 shadow-md text-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-white/5"
        )}
        onClick={() => onToggle(false)}
      >
        Monthly
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "px-6 py-2.5 rounded-full transition-all duration-300 font-medium",
          isYearly
            ? "bg-white dark:bg-white/10 shadow-md text-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-white/5"
        )}
        onClick={() => onToggle(true)}
      >
        Yearly
        <span className="ml-2 text-xs bg-gradient-to-r from-cyan-600 to-teal-600 text-white px-2 py-0.5 rounded-full font-bold">
          -33%
        </span>
      </Button>
    </div>
  );
}
