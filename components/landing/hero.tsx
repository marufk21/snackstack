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
            <h1
              ref={headingRef}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-[1.1] tracking-tight"
            >
              <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent whitespace-nowrap inline-block">
                AI-Powered Notes
              </span>
              <br />
              <span
                ref={subheadingRef}
                className="gradient-text bg-gradient-to-r from-violet-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent whitespace-nowrap inline-block"
              >
                Modern Living
              </span>
            </h1>
            <p
              ref={descriptionRef}
              className={cn(
                "text-lg sm:text-xl md:text-2xl mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light",
                isDark ? "text-gray-200" : "text-gray-600"
              )}
            >
              Capture, organize, and enhance your ideas with the power of artificial
              intelligence. The smart way to take notes for individuals and teams.
            </p>
            <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
              <Link href="/sign-in">
                <button
                  onClick={() =>
                    capture("get_started_clicked", {
                      button: "get_started",
                      location: "landing_page",
                    })
                  }
                  className="group relative px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start for Free
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
                    "px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:-translate-y-1 backdrop-blur-md border",
                    isDark
                      ? "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20"
                      : "bg-white/60 border-gray-200 text-gray-800 hover:bg-white/80 hover:border-gray-300"
                  )}
                >
                  Sign In
                </button>
              </Link>
            </div>
          </div>

          {/* Right Side - Visual Element */}
          <div className="relative hidden lg:flex justify-end items-center pt-12 perspective-1000">
            <div className="relative w-full max-w-lg h-[550px]">
              {/* Floating Card 1 - Main Note Editor */}
              <div
                className={cn(
                  "absolute top-0 right-4 w-80 h-[420px] rounded-3xl shadow-2xl backdrop-blur-xl p-6 transform hover:scale-[1.02] transition-all duration-500 animate-float border z-10",
                  isDark
                    ? "bg-gray-900/60 border-white/10"
                    : "bg-white/60 border-white/60"
                )}
                style={{ animationDelay: "0s" }}
              >
                {/* Window Controls */}
                <div className="flex gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-500">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                    </div>
                    <div>
                      <h3 className={cn("text-sm font-bold", isDark ? "text-white" : "text-gray-900")}>Project Phoenix</h3>
                      <p className="text-xs text-muted-foreground">Last edited just now</p>
                    </div>
                  </div>
                  <div className="px-2 py-1 rounded-md bg-green-500/10 text-green-500 text-xs font-medium">
                    Active
                  </div>
                </div>

                {/* Content Area */}
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 rounded-md bg-violet-500/10 text-violet-500 text-xs font-medium">#strategy</span>
                    <span className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-500 text-xs font-medium">#q4-goals</span>
                  </div>

                  <div className="space-y-3">
                    <div className={cn("h-4 rounded w-3/4", isDark ? "bg-white/10" : "bg-gray-100")} />
                    <div className={cn("h-4 rounded w-full", isDark ? "bg-white/10" : "bg-gray-100")} />
                    <div className={cn("h-4 rounded w-5/6", isDark ? "bg-white/10" : "bg-gray-100")} />
                  </div>

                  {/* AI Suggestion Block */}
                  <div className={cn(
                    "mt-6 p-4 rounded-xl border backdrop-blur-md",
                    isDark ? "bg-violet-500/10 border-violet-500/20" : "bg-violet-50/50 border-violet-100"
                  )}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      </div>
                      <span className="text-xs font-semibold text-violet-600 dark:text-violet-400">AI Insight</span>
                    </div>
                    <p className={cn("text-xs leading-relaxed", isDark ? "text-violet-200/80" : "text-violet-700/80")}>
                      Based on your recent notes, consider exploring the market expansion strategy for Q1 2025.
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Card 2 - AI Chat Assistant */}
              <div
                className={cn(
                  "absolute top-40 left-0 w-72 rounded-3xl shadow-2xl backdrop-blur-xl p-5 transform hover:scale-[1.02] transition-all duration-500 animate-float border z-20",
                  isDark
                    ? "bg-gray-900/70 border-white/10"
                    : "bg-white/70 border-white/60"
                )}
                style={{ animationDelay: "1.5s" }}
              >
                <div className="flex items-center gap-3 mb-4 border-b border-gray-200/10 pb-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full" />
                  </div>
                  <div>
                    <h4 className={cn("text-sm font-bold", isDark ? "text-white" : "text-gray-900")}>SnackBot</h4>
                    <p className="text-xs text-muted-foreground">Online • Helping you</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className={cn("self-end p-3 rounded-2xl rounded-tr-sm text-xs ml-8", isDark ? "bg-violet-600 text-white" : "bg-violet-600 text-white")}>
                    Summarize the meeting notes from yesterday.
                  </div>
                  <div className={cn("self-start p-3 rounded-2xl rounded-tl-sm text-xs mr-4", isDark ? "bg-white/10 text-gray-200" : "bg-gray-100 text-gray-700")}>
                    <div className="flex gap-1 mb-2">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                    </div>
                    Processing your request...
                  </div>
                </div>
              </div>

              {/* Floating Card 3 - Quick Capture */}
              <div
                className={cn(
                  "absolute bottom-0 right-12 w-64 rounded-3xl shadow-2xl backdrop-blur-xl p-5 transform hover:scale-[1.02] transition-all duration-500 animate-float border z-30",
                  isDark
                    ? "bg-gray-900/50 border-white/10"
                    : "bg-white/50 border-white/60"
                )}
                style={{ animationDelay: "2.5s" }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                    <span className={cn("text-xs font-bold uppercase tracking-wider", isDark ? "text-white/60" : "text-gray-500")}>Quick Capture</span>
                  </div>
                  <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                </div>
                <div className={cn("h-20 rounded-xl border border-dashed flex items-center justify-center", isDark ? "border-white/20 bg-white/5" : "border-gray-300 bg-gray-50")}>
                  <span className="text-xs text-muted-foreground">Drop images or text here</span>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-20 right-20 w-32 h-32 rounded-full bg-violet-500/20 blur-[80px] pointer-events-none" />
              <div className="absolute bottom-20 left-10 w-40 h-40 rounded-full bg-indigo-500/20 blur-[80px] pointer-events-none" />
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
