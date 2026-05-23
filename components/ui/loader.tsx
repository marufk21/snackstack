import { cn } from "@/lib/cn";

interface LoaderProps {
    className?: string;
}

export function Loader({ className }: LoaderProps) {
    return (
        <div className={cn("flex items-center justify-center min-h-[60vh]", className)}>
            <div className="relative flex items-center justify-center">
                {/* Outer Ring */}
                <div className="h-16 w-16 rounded-full border-4 border-cyan-200 dark:border-cyan-900 opacity-30"></div>

                {/* Spinning Gradient Ring */}
                <div className="absolute h-16 w-16 rounded-full border-4 border-t-cyan-600 border-r-teal-600 border-b-emerald-600 border-l-transparent animate-spin"></div>

                {/* Inner Pulse */}
                <div className="absolute h-8 w-8 rounded-full bg-cyan-500/20 animate-pulse"></div>
            </div>
        </div>
    );
}
