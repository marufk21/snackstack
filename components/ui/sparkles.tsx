"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const random = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;

const Sparkle = ({ style }: { style: React.CSSProperties }) => (
  <motion.span
    initial={{ scale: 0, rotate: 0, opacity: 0 }}
    animate={{ scale: 1, rotate: 180, opacity: 1 }}
    exit={{ scale: 0, rotate: 0, opacity: 0 }}
    transition={{ duration: 0.5 }}
    style={{
      position: "absolute",
      display: "block",
      pointerEvents: "none",
      zIndex: 2,
      ...style,
    }}
  >
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"
        fill="currentColor"
        className="text-yellow-400"
      />
    </svg>
  </motion.span>
);

export const Sparkles = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const [sparkles, setSparkles] = useState<{ id: string; style: React.CSSProperties }[]>([]);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!isHovering) {
      setSparkles([]);
      return;
    }

    const interval = setInterval(() => {
      const id = Math.random().toString(36).slice(2, 9);
      const style = {
        top: `${random(0, 100)}%`,
        left: `${random(0, 100)}%`,
        width: `${random(10, 20)}px`,
        height: `${random(10, 20)}px`,
      };

      setSparkles((prev) => [...prev, { id, style }]);

      setTimeout(() => {
        setSparkles((prev) => prev.filter((s) => s.id !== id));
      }, 500);
    }, 50);

    return () => clearInterval(interval);
  }, [isHovering]);

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {children}
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <Sparkle key={sparkle.id} style={sparkle.style} />
        ))}
      </AnimatePresence>
    </div>
  );
};
