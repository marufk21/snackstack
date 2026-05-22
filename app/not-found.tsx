import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, FileQuestion } from "lucide-react";

// Disable static generation for this page
export const dynamic = "force-dynamic";

export const metadata = {
  title: "404 - Page Not Found | SnackStack",
  description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Number with Gradient */}
        <div className="mb-8">
          <h1 className="text-9xl sm:text-[12rem] font-bold leading-none">
            <span className="bg-gradient-to-r from-cyan-600 via-rose-500 to-blue-600 bg-clip-text text-transparent">
              404
            </span>
          </h1>
        </div>
        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Page Not Found</h2>

        {/* Description */}
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist. It might have been
          moved, deleted, or the URL might be incorrect.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg" className="min-w-[160px]">
            <Link href="/">
              <Home className="w-4 h-4" />
              Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
