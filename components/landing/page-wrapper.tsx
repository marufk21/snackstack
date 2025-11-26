import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface PageWrapperProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
}

const PageWrapper = forwardRef<HTMLElement, PageWrapperProps>(({
  children,
  className = "",
  ...props
}, ref) => {
  return (
    <section
      ref={ref}
      className={cn(
        "relative w-full max-w-screen mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col justify-center py-8 md:py-12 lg:py-16 overflow-hidden",
        className
      )}
      {...props}
    >
      {/* Subtle background gradient for depth */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-500/5 via-transparent to-transparent opacity-50" style={{
        background: `
        radial-gradient(
          circle at center,
          rgba(168, 85, 247, 0.12) 0%,
          rgba(168, 85, 247, 0.06) 20%,
          rgba(0, 0, 0, 0.0) 60%
        )
      `,
      }}
      />
      <div className="relative z-10 w-full">
        {children}
      </div>
    </section>
  );
});

PageWrapper.displayName = "PageWrapper";

export default PageWrapper;



