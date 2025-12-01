"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const random = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;

const Sparkle = ({ size, color, style }: { size: number; color: string; style: React.CSSProperties }) => {
    return (
        <motion.span
            initial={{ scale: 0, opacity: 0, rotate: 0 }}
            animate={{ scale: 1, opacity: 1, rotate: 180 }}
            exit={{ scale: 0, opacity: 0, rotate: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={style}
            className="absolute inline-block pointer-events-none z-10"
        >
            <svg
                width={size}
                height={size}
                viewBox="0 0 160 160"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M80 0C80 0 84.2846 41.2925 101.496 58.504C118.707 75.7154 160 80 160 80C160 80 118.707 84.2846 101.496 101.496C84.2846 118.707 80 160 80 160C80 160 75.7154 118.707 58.504 101.496C41.2925 84.2846 0 80 0 80C0 80 41.2925 75.7154 58.504 58.504C75.7154 41.2925 80 0 80 0Z"
                    fill={color}
                />
            </svg>
        </motion.span>
    );
};

export const GlitterText = ({
    text,
    className,
    textClassName,
    sparkleCount = 10,
    colors = ["#FFC700", "#FF0000", "#26D701", "#0054FF"],
}: {
    text: string;
    className?: string;
    textClassName?: string;
    sparkleCount?: number;
    colors?: string[];
}) => {
    const [sparkles, setSparkles] = useState<{ id: string; size: number; color: string; style: React.CSSProperties }[]>([]);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const generateSparkle = () => {
            const id = Math.random().toString(36).slice(2, 9);
            const size = random(10, 20);
            const color = colors[random(0, colors.length)];
            const style = {
                top: `${random(-20, 120)}%`,
                left: `${random(-10, 110)}%`,
            };
            return { id, size, color, style };
        };

        const interval = setInterval(() => {
            setSparkles((current) => {
                // Keep only the last few sparkles to avoid overflow
                const newSparkle = generateSparkle();
                const maxSparkles = isHovered ? sparkleCount * 2 : sparkleCount;
                const updated = [...current, newSparkle];
                if (updated.length > maxSparkles) {
                    return updated.slice(updated.length - maxSparkles);
                }
                return updated;
            });
        }, isHovered ? 100 : 400);

        return () => clearInterval(interval);
    }, [isHovered, sparkleCount, colors]);

    // Clean up old sparkles
    useEffect(() => {
        const interval = setInterval(() => {
            setSparkles((current) => {
                if (current.length === 0) return current;
                // Randomly remove some sparkles
                return current.filter(() => Math.random() > 0.1);
            });
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className={cn("relative inline-block cursor-default group", className)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <span className={cn("relative z-0", textClassName)}>{text}</span>
            <AnimatePresence>
                {sparkles.map((sparkle) => (
                    <Sparkle
                        key={sparkle.id}
                        size={sparkle.size}
                        color={sparkle.color}
                        style={sparkle.style}
                    />
                ))}
            </AnimatePresence>

            {/* Glitter overlay on text itself */}
            <span
                className={cn(
                    "absolute inset-0 bg-clip-text text-transparent opacity-0 group-hover:opacity-100 animate-shimmer pointer-events-none mix-blend-overlay transition-opacity duration-300",
                    textClassName
                )}
                style={{
                    backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)',
                    backgroundSize: '200% 100%',
                    animation: isHovered ? 'shimmer 2s infinite linear' : 'none'
                }}
            >
                {text}
            </span>
            <style jsx>{`
        @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
      `}</style>
        </div>
    );
};
