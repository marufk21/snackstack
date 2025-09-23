import React from "react";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  className = "",
}) => {
  return (
    <section
      className={`max-w-screen-lg mx-auto px-4 min-h-screen flex flex-col${className}`}
    >
      {children}
    </section>
  );
};

export default PageWrapper;
