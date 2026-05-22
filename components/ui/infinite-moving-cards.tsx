"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";

interface InfiniteMovingCardsProps {
  items: {
    quote: string;
    name: string;
    title: string;
    avatar?: string;
  }[];
  direction?: "left" | "right";
  speed?: "slow" | "normal" | "fast";
  pauseOnHover?: boolean;
  className?: string;
}

export function InfiniteMovingCards({
  items,
  direction = "left",
  speed = "normal",
  pauseOnHover = true,
  className,
}: InfiniteMovingCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    addDuplicates();
  }, []);

  function addDuplicates() {
    if (!scrollerRef.current) return;
    const scrollerContent = Array.from(scrollerRef.current.children);
    scrollerContent.forEach((item) => {
      const duplicated = item.cloneNode(true);
      scrollerRef.current?.appendChild(duplicated);
    });
    setStart(true);
  }

  const directionValue = direction === "left" ? "forwards" : "reverse";
  const speedMap = { slow: "80s", normal: "50s", fast: "25s" };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex min-w-full w-max shrink-0 flex-nowrap gap-5 py-4",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
        style={{
          "--animation-direction": directionValue,
          "--animation-duration": speedMap[speed],
        } as React.CSSProperties}
      >
        {items.map((item) => (
          <li
            key={item.name}
            className="relative w-[350px] max-w-full shrink-0 rounded-2xl border border-border bg-card/60 px-8 py-6 backdrop-blur-sm md:w-[420px]"
          >
            <blockquote className="flex h-full flex-col justify-between">
              <div>
                <svg
                  className="mb-3 h-5 w-5 text-cyan-400 dark:text-cyan-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11H10v10H0z" />
                </svg>
                <p className="relative z-20 text-sm leading-[1.6] text-muted-foreground font-light">
                  {item.quote}
                </p>
              </div>
              <footer className="relative z-20 mt-6 flex items-center gap-3">
                {item.avatar && (
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="h-9 w-9 rounded-full object-cover ring-1 ring-border"
                  />
                )}
                <div>
                  <span className="text-sm font-semibold text-foreground">
                    {item.name}
                  </span>
                  <span className="block text-xs text-muted-foreground/70">
                    {item.title}
                  </span>
                </div>
              </footer>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
}
