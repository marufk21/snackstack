import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PricingToggleProps {
  isYearly: boolean;
  onToggle: (isYearly: boolean) => void;
}

export function PricingToggle({ isYearly, onToggle }: PricingToggleProps) {
  return (
    <div className="flex items-center justify-center p-1 bg-muted rounded-lg">
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "px-4 py-2 rounded-md transition-all",
          !isYearly ? "bg-background shadow-sm" : "text-muted-foreground"
        )}
        onClick={() => onToggle(false)}
      >
        Monthly
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "px-4 py-2 rounded-md transition-all",
          isYearly ? "bg-background shadow-sm" : "text-muted-foreground"
        )}
        onClick={() => onToggle(true)}
      >
        Yearly
        <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
          Save 20%
        </span>
      </Button>
    </div>
  );
}
