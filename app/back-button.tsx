"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  };

  return (
    <Button
      variant="outline"
      size="lg"
      className="min-w-[160px]"
      onClick={handleGoBack}
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      Go Back
    </Button>
  );
}

