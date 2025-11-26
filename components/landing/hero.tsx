"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import Dither from "@/components/landing/dither";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useGSAP } from "@/hooks/use-gsap";
import gsap from "gsap";


import { usePostHog } from "@/hooks/use-posthog";

const Hero = () => {
  const { capture } = usePostHog();
  const { theme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || theme === "dark";

  const heroRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLSpanElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const ditherRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Animate dither background with parallax
    if (ditherRef.current) {
      gsap.to(ditherRef.current, {
        y: 100,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }

    // Main heading animation with stagger
    if (headingRef.current) {
      const gradientSpan = headingRef.current.querySelector(".gradient-text");

      tl.fromTo(
        gradientSpan,
        { opacity: 0, y: 50, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: "back.out(1.7)" },
        0.2
      );
    }

    // Subheading animation
    if (subheadingRef.current) {
      tl.fromTo(
        subheadingRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        0.5
      );
    }

    // Description animation
    if (descriptionRef.current) {
      tl.fromTo(
        descriptionRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        0.7
      );
    }

    // Buttons animation with stagger
    if (buttonsRef.current) {
      const buttons = buttonsRef.current.querySelectorAll("a");
      tl.fromTo(
        buttons,
        { opacity: 0, y: 20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1 },
        0.9
      );
    }
  }, []);

  return (
    <section className="relative w-full overflow-hidden ">
      <div ref={ditherRef} className="absolute inset-0 z-0">
        <Dither
          waveColor={[0.4, 0.1, 0.6]}
          disableAnimation={false}
          enableMouseInteraction={true}
          mouseRadius={0.3}
          colorNum={8}
          waveAmplitude={0.3}
          waveFrequency={3}
          waveSpeed={0.1}
        />
      </div>

      <div
        ref={heroRef}
        className="relative z-10 min-h-screen flex items-center justify-center py-12 lg:py-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center w-full max-w-7xl mx-auto px-4">
          {/* Left Side - Text Content */}
          <div className="text-center lg:text-left flex flex-col justify-center">
            <h1 ref={headingRef} className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent whitespace-nowrap">
                AI-Powered Notes
              </span>
              <br />
              <span
                ref={subheadingRef}
                className={cn(
                  "text-2xl sm:text-3xl lg:text-4xl font-light drop-shadow-lg",
                  isDark ? "text-white" : "text-gray-900 dark:text-white"
                )}
              >
                for Modern Teams
              </span>
            </h1>
            <p
              ref={descriptionRef}
              className={cn(
                "text-lg sm:text-xl mb-8 max-w-xl mx-auto lg:mx-0 drop-shadow-md leading-relaxed",
                isDark ? "text-white/90" : "text-gray-800 dark:text-white/90"
              )}
            >
              Capture, organize, and enhance your ideas with the power of artificial
              intelligence. The smart way to take notes for individuals and teams.
            </p>
            <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/sign-in">
                <button
                  onClick={() =>
                    capture("get_started_clicked", {
                      button: "get_started",
                      location: "landing_page",
                    })
                  }
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  Start for Free
                </button>
              </Link>
              <Link href="/sign-in">
                <button
                  onClick={() =>
                    capture("sign_in_clicked", {
                      button: "sign_in",
                      location: "landing_page",
                    })
                  }
                  className={cn(
                    "backdrop-blur-sm px-8 py-4 rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg",
                    isDark
                      ? "border border-white/30 bg-white/10 text-white hover:text-white hover:border-white/60 hover:bg-white/20"
                      : "border border-gray-300/80 bg-white/80 text-gray-900 hover:text-gray-900 hover:border-gray-400/80 hover:bg-white/90 dark:border-white/30 dark:bg-white/10 dark:text-white dark:hover:text-white dark:hover:border-white/60 dark:hover:bg-white/20"
                  )}
                >
                  Sign In
                </button>
              </Link>
            </div>
          </div>

          {/* Right Side - Visual Element */}
          <div className="relative hidden lg:flex justify-end items-center pt-12">
            <div className="relative w-full max-w-lg h-[550px]">
              {/* Floating Card 1 - Main Note */}
              <div
                className={cn(
                  "absolute top-0 right-0 w-72 h-80 rounded-2xl shadow-2xl backdrop-blur-md p-6 transform hover:scale-105 transition-all duration-300 animate-float",
                  isDark
                    ? "bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/20"
                    : "bg-gradient-to-br from-purple-100/80 to-blue-100/80 border border-purple-200/50"
                )}
                style={{ animationDelay: "0s" }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse" />
                  <span
                    className={cn(
                      "text-sm font-medium",
                      isDark ? "text-white/80" : "text-gray-700"
                    )}
                  >
                    AI Enhanced
                  </span>
                </div>
                <h3
                  className={cn(
                    "text-xl font-bold mb-3",
                    isDark ? "text-white" : "text-gray-900"
                  )}
                >
                  Project Ideas
                </h3>
                <div className="space-y-2">
                  <div
                    className={cn(
                      "h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500",
                      "w-full"
                    )}
                  />
                  <div
                    className={cn(
                      "h-2 rounded-full",
                      isDark ? "bg-white/20" : "bg-gray-300/50",
                      "w-4/5"
                    )}
                  />
                  <div
                    className={cn(
                      "h-2 rounded-full",
                      isDark ? "bg-white/20" : "bg-gray-300/50",
                      "w-3/5"
                    )}
                  />
                </div>
                <div className="absolute bottom-6 right-6">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center shadow-lg">
                      <span className="text-white text-xl">✨</span>
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-pink-500 animate-ping" />
                  </div>
                </div>
              </div>

              {/* Floating Card 2 - AI Assistant */}
              <div
                className={cn(
                  "absolute top-40 left-0 w-64 h-48 rounded-2xl shadow-2xl backdrop-blur-md p-5 transform hover:scale-105 transition-all duration-300 animate-float",
                  isDark
                    ? "bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/20"
                    : "bg-gradient-to-br from-blue-100/80 to-purple-100/80 border border-blue-200/50"
                )}
                style={{ animationDelay: "0.5s" }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <span className="text-white text-sm">🤖</span>
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium",
                      isDark ? "text-white/80" : "text-gray-700"
                    )}
                  >
                    AI Assistant
                  </span>
                </div>
                <p
                  className={cn(
                    "text-sm mb-3",
                    isDark ? "text-white/70" : "text-gray-600"
                  )}
                >
                  Summarizing your notes...
                </p>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0s" }} />
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: "0.2s" }} />
                  <div className="w-2 h-2 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: "0.4s" }} />
                </div>
              </div>

              {/* Floating Card 3 - Quick Note */}
              <div
                className={cn(
                  "absolute bottom-0 right-16 w-56 h-40 rounded-2xl shadow-2xl backdrop-blur-md p-4 transform hover:scale-105 transition-all duration-300 animate-float",
                  isDark
                    ? "bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-white/20"
                    : "bg-gradient-to-br from-pink-100/80 to-purple-100/80 border border-pink-200/50"
                )}
                style={{ animationDelay: "1s" }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-pink-500" />
                  <span
                    className={cn(
                      "text-xs font-medium",
                      isDark ? "text-white/80" : "text-gray-700"
                    )}
                  >
                    Quick Note
                  </span>
                </div>
                <div className="space-y-2">
                  <div
                    className={cn(
                      "h-1.5 rounded-full",
                      isDark ? "bg-white/20" : "bg-gray-300/50",
                      "w-full"
                    )}
                  />
                  <div
                    className={cn(
                      "h-1.5 rounded-full",
                      isDark ? "bg-white/20" : "bg-gray-300/50",
                      "w-3/4"
                    )}
                  />
                  <div
                    className={cn(
                      "h-1.5 rounded-full",
                      isDark ? "bg-white/20" : "bg-gray-300/50",
                      "w-1/2"
                    )}
                  />
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-2xl animate-pulse" />
              <div className="absolute bottom-32 right-10 w-32 h-32 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};


export default Hero;
