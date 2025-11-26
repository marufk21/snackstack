import React, { forwardRef } from "react";

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
      style={{
        background: `
        radial-gradient(
          circle at center,
          rgba(168, 85, 247, 0.12) 0%,
          rgba(168, 85, 247, 0.06) 20%,
          rgba(0, 0, 0, 0.0) 60%
        )
      `,
      }}
      className={`max-w-screen mx-auto px-4 min-h-screen flex flex-col py-12 pointer-events-none ${className}`}
      {...props}
    >
      {children}
    </section>
  );
});

PageWrapper.displayName = "PageWrapper";

export default PageWrapper;



<div className="min-h-screen w-full bg-black relative">
  {/* Dark Noise Colored Background */}
  <div
    className="absolute inset-0 z-0"
   
  />
     {/* Your Content/Components */}
</div>