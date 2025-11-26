import { cn } from "@/lib/utils";

interface LoaderProps {
    className?: string;
}

export function Loader({ className }: LoaderProps) {
    return (
        <div className={cn("flex items-center justify-center min-h-[60vh]", className)}>
            <div className="relative flex items-center justify-center">
                {/* Outer Ring */}
                <div className="h-16 w-16 rounded-full border-4 border-indigo-200 dark:border-indigo-900 opacity-30"></div>

                {/* Spinning Gradient Ring */}
                <div className="absolute h-16 w-16 rounded-full border-4 border-t-indigo-600 border-r-purple-600 border-b-pink-600 border-l-transparent animate-spin"></div>

                {/* Inner Pulse */}
                <div className="absolute h-8 w-8 rounded-full bg-indigo-500/20 animate-pulse"></div>
            </div>
        </div>
    );
}
