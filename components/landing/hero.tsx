"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Play,
  Sparkles as SparklesIcon,
  Bot,
  Upload,
  Loader2,
  FileText,
  RefreshCw,
  Tag,
  ChevronRight,
  Sparkles,
  Zap,
  CheckCircle2,
  Trash2,
  Cpu,
  MonitorPlay
} from "lucide-react";

import MistBackground from "@/components/ui/mist-background";
import { cn } from "@/lib/utils";
import { useGSAP } from "@/hooks/use-gsap";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePostHog } from "@/hooks/use-posthog";

// Dynamically import the advanced Dither wave component for performance toggle
const Dither = dynamic(() => import("@/components/landing/dither"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-gradient-to-b from-cyan-50 to-white dark:from-zinc-900 dark:to-black opacity-30" />
  ),
});

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const Hero = () => {
  const { capture } = usePostHog();

  // Reference elements for entrance & scroll-triggered animations
  const heroRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLSpanElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const ditherRef = useRef<HTMLDivElement>(null);

  // Performance-friendly visual states
  const [ditherEnabled, setDitherEnabled] = useState(false);
  const [activeDashboardTab, setActiveDashboardTab] = useState<"notes" | "capture" | "starred">("notes");
  const [copilotPanelOpen, setCopilotPanelOpen] = useState(true);

  // Simulated Interactive States for Card 1 (Note Editor)
  const [activeTag, setActiveTag] = useState<"strategy" | "pricing" | null>(null);

  // Simulated Interactive States for Card 2 (AI Assistant Chat)
  const [chatPrompt, setChatPrompt] = useState<"summary" | "actions" | "milestones" | null>(null);
  const [chatStatus, setChatStatus] = useState<"idle" | "typing" | "completed">("idle");
  const [typedText, setTypedText] = useState("");
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const chatResponses = {
    summary: "Sure! Q4 roadmap summarized:\n• Phoenix Beta set for Dec 1st.\n• Stripe billing integration ready.\n• Uptime target set to 99.9%.",
    actions: "Here are your action items:\n• Configure Clerk auth middlewares.\n• Deploy Postgres database backups.\n• Finalize subscription tier layout.",
    milestones: "Key project milestones:\n• Q4 Landing Overhaul: Nov 25.\n• Stripe Integration: Dec 5.\n• Public Launch: Dec 15."
  };

  const handleStartChatSim = (promptType: "summary" | "actions" | "milestones") => {
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    
    setChatPrompt(promptType);
    setChatStatus("typing");
    setTypedText("");
    
    const responseText = chatResponses[promptType];
    let index = 0;
    
    typingIntervalRef.current = setInterval(() => {
      if (index < responseText.length) {
        setTypedText((prev) => prev + responseText.charAt(index));
        index++;
      } else {
        if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
        setChatStatus("completed");
      }
    }, 15);
  };

  const handleResetChatSim = () => {
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    setChatPrompt(null);
    setChatStatus("idle");
    setTypedText("");
  };

  // Simulated Interactive States for Card 3 (Quick Capture Dropzone)
  const [captureState, setCaptureState] = useState<"empty" | "uploading" | "extracting" | "done">("empty");
  const [uploadPercent, setUploadPercent] = useState(0);

  const startCaptureSequence = () => {
    if (captureState !== "empty") return;
    setCaptureState("uploading");
    setUploadPercent(0);

    // Simulated upload progress counting to 100%
    let progress = 0;
    const uploadInterval = setInterval(() => {
      progress += Math.floor(Math.random() * 25) + 10;
      if (progress >= 100) {
        clearInterval(uploadInterval);
        setUploadPercent(100);
        
        // Transition to AI analysis stage after a brief delay
        setTimeout(() => {
          setCaptureState("extracting");
          
          // Transition to final result extraction after simulated analysis
          setTimeout(() => {
            setCaptureState("done");
          }, 1500);
        }, 300);
      } else {
        setUploadPercent(progress);
      }
    }, 120);
  };

  const resetCaptureSequence = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCaptureState("empty");
    setUploadPercent(0);
  };

  // Clean up timers on component unmount
  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    };
  }, []);

  // GSAP animations for entrance triggers and 3D tilting
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    // Background parallax scroll effect if dither is active
    if (ditherRef.current) {
      gsap.to(ditherRef.current, {
        y: 120,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }

    // Floating pill badge animation
    if (badgeRef.current) {
      tl.fromTo(
        badgeRef.current,
        { opacity: 0, y: -20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8 },
        0.1
      );
    }

    // Main heading entrance
    if (headingRef.current) {
      tl.fromTo(
        headingRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
        0.3
      );
    }

    // Subheading stagger
    if (subheadingRef.current) {
      tl.fromTo(
        subheadingRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        0.5
      );
    }

    // Description text
    if (descriptionRef.current) {
      tl.fromTo(
        descriptionRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        0.6
      );
    }

    // CTA buttons stagger
    if (buttonsRef.current) {
      const buttons = buttonsRef.current.querySelectorAll("button, a");
      tl.fromTo(
        buttons,
        { opacity: 0, y: 15, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1 },
        0.75
      );
    }

    // 3D Dashboard Mockup Scroll Trigger Animation
    if (mockupRef.current) {
      gsap.fromTo(
        mockupRef.current,
        {
          rotateX: 18,
          rotateY: -3,
          y: 80,
          scale: 0.93,
          transformPerspective: 1500,
        },
        {
          rotateX: 0,
          rotateY: 0,
          y: 0,
          scale: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: mockupRef.current,
            start: "top 95%",
            end: "top 45%",
            scrub: 1.2,
          },
        }
      );
    }
  }, []);

  return (
    <section className="relative w-full overflow-hidden" ref={heroRef}>
      {/* Dynamic 3D WebGL Background - Performance Switchable */}
      {ditherEnabled && (
        <div ref={ditherRef} className="absolute inset-0 z-0 opacity-40 dark:opacity-20 pointer-events-none transition-opacity duration-700">
          <Dither
            waveColor={[0.4, 0.1, 0.6]}
            disableAnimation={false}
            enableMouseInteraction={true}
            mouseRadius={0.35}
            colorNum={6}
            waveAmplitude={0.25}
            waveFrequency={2.5}
            waveSpeed={0.08}
          />
        </div>
      )}

      {/* Primary Landing Scaffold */}
      <div className="min-h-[900px] sm:min-h-screen w-full bg-white dark:bg-black relative overflow-hidden transition-colors duration-500 pb-12 sm:pb-20 pt-20 sm:pt-28">
        
        {/* Soft floating fluid color fields */}
        <MistBackground className="opacity-90 dark:opacity-60" />

        {/* Sophisticated fine mesh grid overlay */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_15%,#000_80%,transparent_100%)] pointer-events-none" />

        {/* Content & Interactive Features Layout Grid */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-12 items-center">
            
            {/* Left Side: Dynamic Copy & CTAs */}
            <div className="text-center lg:text-left flex flex-col justify-center lg:col-span-6 xl:col-span-7">
              
              {/* Premium Pill Badge */}
              <div 
                ref={badgeRef}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-600 dark:text-cyan-400 text-xs font-semibold shadow-[0_4px_15px_rgba(6,182,198,0.05)] hover:border-cyan-500/40 hover:bg-cyan-500/10 transition-all duration-300 backdrop-blur-md mb-6 w-fit mx-auto lg:mx-0 select-none cursor-pointer"
              >
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <span className="flex items-center gap-1">
                  Introducing SnackStack 2.0
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* Main Heading */}
              <h1
                ref={headingRef}
                className="text-3xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold mb-4 sm:mb-5 leading-[1.1] tracking-tight text-gray-900 dark:text-white"
              >
                <span className="bg-gradient-to-r from-cyan-600 via-teal-500 to-emerald-500 bg-clip-text text-transparent inline-block pb-1">
                  AI-Powered Notes
                </span>
                <br />
                <span ref={subheadingRef} className="inline-block mt-1">
                  for <span className="bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-400 bg-clip-text text-transparent font-extrabold">Modern Living</span>
                </span>
              </h1>

              {/* Description Paragraph */}
              <p
                ref={descriptionRef}
                className="text-sm sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light text-gray-600 dark:text-gray-300"
              >
                Capture, organize, and enhance your ideas with the fluid speed of Next.js and the cognitive power of Gemini AI. The aesthetic workspace designed for modern developers and creative squads.
              </p>

              {/* Action CTA Buttons */}
              <div
                ref={buttonsRef}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start items-center"
              >
                <Link href="/sign-in" className="w-full sm:w-auto">
                  <button
                    onClick={() =>
                      capture("get_started_clicked", {
                        button: "get_started",
                        location: "landing_page",
                      })
                    }
                    className="group relative w-full sm:w-auto px-5 py-2.5 sm:px-7 sm:py-3.5 text-sm sm:text-base bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-full font-bold shadow-[0_4px_20px_rgba(6,182,198,0.25)] hover:shadow-[0_4px_25px_rgba(6,182,198,0.45)] transition-all duration-300 hover:-translate-y-0.5 overflow-hidden flex items-center justify-center gap-2 cursor-pointer select-none"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Start for Free
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </Link>

                <a href="#workspace-preview" className="w-full sm:w-auto">
                  <button
                    className="group w-full sm:w-auto px-5 py-2.5 sm:px-7 sm:py-3.5 text-sm sm:text-base bg-white/50 dark:bg-zinc-900/50 hover:bg-white/70 dark:hover:bg-zinc-900/70 text-gray-800 dark:text-gray-200 border border-gray-200/60 dark:border-white/10 rounded-full font-bold shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer select-none"
                  >
                    <span>Explore Workspace</span>
                    <Play className="w-4 h-4 text-cyan-500 fill-cyan-500 group-hover:scale-110 transition-transform" />
                  </button>
                </a>
              </div>

              {/* Technologies / Integrations Microbar */}
              <div className="mt-10 pt-6 border-t border-gray-200/50 dark:border-white/5 flex flex-wrap items-center gap-3 justify-center lg:justify-start select-none">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Supercharged By</span>
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-zinc-900/40 px-2.5 py-1 rounded-full border border-black/5 dark:border-white/5 shadow-sm">
                    🤖 Gemini 1.5 Pro
                  </span>
                  <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-zinc-900/40 px-2.5 py-1 rounded-full border border-black/5 dark:border-white/5 shadow-sm">
                    ▲ Next.js 15
                  </span>
                  <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-zinc-900/40 px-2.5 py-1 rounded-full border border-black/5 dark:border-white/5 shadow-sm">
                    💳 Stripe
                  </span>
                </div>
              </div>

            </div>

            {/* Right Side: Interactive Visual Artifacts (Floating Workspace Elements) */}
            <div className="relative flex justify-center lg:justify-end items-center pt-4 sm:pt-8 perspective-1000 lg:col-span-6 xl:col-span-5 h-[380px] sm:h-[450px] md:h-[500px]">

              <div className="relative w-full max-w-[340px] sm:max-w-[420px] md:max-w-[480px] h-full scale-[0.82] sm:scale-100 origin-center lg:origin-right">
                
                {/* FLOATING CARD 1: Responsive Note Editor */}
                <div
                  className="absolute top-0 right-0 sm:right-6 w-[240px] sm:w-[280px] md:w-[310px] rounded-2xl sm:rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.07)] backdrop-blur-xl p-4 sm:p-5 border z-10 bg-white/80 border-black/5 shadow-black/5 dark:bg-zinc-900/70 dark:border-white/10 dark:shadow-none hover:border-cyan-500/30 transition-all duration-300 animate-float"
                  style={{ animationDelay: "0s" }}
                >
                  {/* Browser simulated controls */}
                  <div className="flex gap-1.5 mb-4 select-none">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                  </div>

                  {/* Header Title */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-500 font-bold text-xs">
                        ⚡
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-gray-800 dark:text-white truncate max-w-[130px] text-left">
                          Q4 Product Launch
                        </h3>
                        <p className="text-[9px] text-gray-400 dark:text-gray-500 text-left">
                          Last edited 2m ago
                        </p>
                      </div>
                    </div>
                    <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[9px] font-bold">
                      Active Note
                    </div>
                  </div>

                  {/* Interactive Tags - Toggling changes body highlights */}
                  <div className="space-y-3.5">
                    
                    {/* Tags block */}
                    <div className="flex flex-wrap gap-1.5">
                      <button 
                        onClick={() => setActiveTag(activeTag === "strategy" ? null : "strategy")}
                        className={cn(
                          "px-2 py-1 rounded-md text-[9px] font-bold tracking-wider uppercase transition-all flex items-center gap-1 border cursor-pointer",
                          activeTag === "strategy" 
                            ? "bg-cyan-500/20 text-cyan-600 border-cyan-500/40 dark:text-cyan-400" 
                            : "bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 text-gray-500 border-transparent"
                        )}
                      >
                        <Tag className="w-2.5 h-2.5" />
                        #strategy
                      </button>
                      <button 
                        onClick={() => setActiveTag(activeTag === "pricing" ? null : "pricing")}
                        className={cn(
                          "px-2 py-1 rounded-md text-[9px] font-bold tracking-wider uppercase transition-all flex items-center gap-1 border cursor-pointer",
                          activeTag === "pricing" 
                            ? "bg-teal-500/20 text-teal-600 border-teal-500/40 dark:text-teal-400" 
                            : "bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 text-gray-500 border-transparent"
                        )}
                      >
                        <Tag className="w-2.5 h-2.5" />
                        #pricing
                      </button>
                    </div>

                    {/* Note Content Area */}
                    <div className="space-y-2 text-[10px] text-gray-600 dark:text-gray-300 font-sans text-left leading-relaxed">
                      <p className={cn(
                        "rounded px-1.5 py-0.5 transition-all duration-300",
                        activeTag === "strategy" ? "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 font-medium shadow-[0_0_8px_rgba(6,182,198,0.1)] border-l-2 border-cyan-500" : ""
                      )}>
                        • Phoenix Beta release date scheduled for Dec 1st. Uptime target is 99.9%.
                      </p>
                      
                      <p className={cn(
                        "rounded px-1.5 py-0.5 transition-all duration-300",
                        activeTag === "pricing" ? "bg-teal-500/15 text-teal-700 dark:text-teal-300 font-medium shadow-[0_0_8px_rgba(20,184,166,0.1)] border-l-2 border-teal-500" : ""
                      )}>
                        • Setup subscription gates with Stripe: basic tier (₹749) & pro tier (₹1599) verified.
                      </p>
                    </div>

                    {/* Micro Instruction Badge */}
                    <div className="pt-2 border-t border-gray-100 dark:border-white/5 text-center">
                      <span className="text-[8px] text-gray-400 dark:text-gray-500 font-medium select-none animate-pulse">
                        💡 Click tag chips to highlight document sections
                      </span>
                    </div>

                  </div>
                </div>

                {/* FLOATING CARD 2: AI Assistant (SnackBot Chatbot Simulation) */}
                <div
                  className="absolute top-32 sm:top-44 left-0 sm:left-0 w-[230px] sm:w-[270px] md:w-[290px] rounded-2xl sm:rounded-3xl shadow-[0_20px_45px_-10px_rgba(0,0,0,0.08)] backdrop-blur-xl p-3.5 sm:p-4.5 border z-20 bg-white/90 border-black/5 shadow-black/10 dark:bg-zinc-900/85 dark:border-white/10 dark:shadow-none hover:border-emerald-500/30 transition-all duration-300 animate-float"
                  style={{ animationDelay: "1.8s" }}
                >
                  {/* Assistant Identity Header */}
                  <div className="flex items-center gap-2.5 mb-3.5 border-b border-gray-100 dark:border-white/5 pb-2.5">
                    <div className="relative">
                      <div className="w-8.5 h-8.5 rounded-full bg-gradient-to-br from-teal-500 via-cyan-500 to-emerald-500 flex items-center justify-center shadow-md">
                        <Bot className="w-4.5 h-4.5 text-white" />
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-zinc-900 rounded-full" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-[11px] font-bold text-gray-800 dark:text-white flex items-center gap-1 select-none">
                        SnackBot Copilot
                        <span className="px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-500 text-[7px] uppercase font-extrabold tracking-wider">Gemini API</span>
                      </h4>
                      <p className="text-[9px] text-gray-400 dark:text-gray-500">
                        Ask summaries, actions or guides
                      </p>
                    </div>
                  </div>

                  {/* Suggestion Prompt Buttons */}
                  {chatStatus === "idle" ? (
                    <div className="space-y-1.5 mb-1.5">
                      <span className="text-[8px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-bold block mb-2 text-left select-none">Simulate AI Actions:</span>
                      <button 
                        onClick={() => handleStartChatSim("summary")}
                        className="w-full text-left p-2 rounded-xl bg-gray-50 hover:bg-cyan-500/5 dark:bg-zinc-800/40 dark:hover:bg-cyan-500/10 border border-black/5 dark:border-white/5 text-[9px] font-semibold text-gray-700 dark:text-gray-200 transition-colors flex items-center justify-between cursor-pointer animate-pulse"
                      >
                        <span>⚡ Summarize yesterday's notes</span>
                        <ChevronRight className="w-3 h-3 text-cyan-500" />
                      </button>
                      <button 
                        onClick={() => handleStartChatSim("actions")}
                        className="w-full text-left p-2 rounded-xl bg-gray-50 hover:bg-cyan-500/5 dark:bg-zinc-800/40 dark:hover:bg-cyan-500/10 border border-black/5 dark:border-white/5 text-[9px] font-semibold text-gray-700 dark:text-gray-200 transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <span>📝 Extract Action Items</span>
                        <ChevronRight className="w-3 h-3 text-cyan-500" />
                      </button>
                      <button 
                        onClick={() => handleStartChatSim("milestones")}
                        className="w-full text-left p-2 rounded-xl bg-gray-50 hover:bg-cyan-500/5 dark:bg-zinc-800/40 dark:hover:bg-cyan-500/10 border border-black/5 dark:border-white/5 text-[9px] font-semibold text-gray-700 dark:text-gray-200 transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <span>🎯 Define Project Milestones</span>
                        <ChevronRight className="w-3 h-3 text-cyan-500" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* User Request Bubble */}
                      <div className="flex justify-end">
                        <div className="p-2.5 rounded-2xl rounded-tr-sm text-[9px] font-medium bg-cyan-600 text-white shadow-sm select-none">
                          {chatPrompt === "summary" && "Summarize yesterday's notes."}
                          {chatPrompt === "actions" && "Extract Action Items."}
                          {chatPrompt === "milestones" && "Define Project Milestones."}
                        </div>
                      </div>

                      {/* AI Typing and Response block */}
                      <div className="p-2.5 rounded-2xl rounded-tl-sm text-[9px] bg-gray-50 text-gray-700 dark:bg-zinc-800/40 dark:text-gray-200 border border-black/5 dark:border-white/5">
                        
                        {chatStatus === "typing" && (
                          <div className="flex gap-1 mb-2.5 items-center">
                            <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                            <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                            <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                          </div>
                        )}

                        <div className="whitespace-pre-line leading-relaxed font-mono text-[9px] text-left">
                          {typedText}
                          {chatStatus === "typing" && (
                            <span className="w-1 h-3 bg-cyan-500 inline-block animate-pulse ml-0.5" />
                          )}
                        </div>

                        {chatStatus === "completed" && (
                          <button
                            onClick={handleResetChatSim}
                            className="mt-2.5 w-full py-1.5 px-2.5 rounded-lg bg-gray-200/50 dark:bg-zinc-800 text-gray-600 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white border border-black/5 dark:border-white/5 transition-all text-[8px] font-bold flex items-center justify-center gap-1 cursor-pointer select-none"
                          >
                            <RefreshCw className="w-2.5 h-2.5 animate-spin-slow" />
                            Ask Another Question
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* FLOATING CARD 3: Quick Capture Uploader Pipeline */}
                <div
                  className="hidden sm:block absolute bottom-0 right-4 w-[210px] sm:w-[230px] rounded-3xl shadow-[0_15px_35px_-10px_rgba(0,0,0,0.06)] backdrop-blur-xl p-4.5 border z-30 bg-white/70 border-black/5 shadow-black/5 dark:bg-zinc-900/60 dark:border-white/10 dark:shadow-none hover:border-cyan-400/30 transition-all duration-300 animate-float"
                  style={{ animationDelay: "3.2s" }}
                >
                  <div className="flex items-center justify-between mb-3 select-none">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500 dark:text-white/60">
                        Quick Capture
                      </span>
                    </div>
                    <Zap className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
                  </div>
                  
                  {/* Sequence Pipeline Rendering */}
                  {captureState === "empty" && (
                    <div 
                      onClick={startCaptureSequence}
                      className="h-[95px] rounded-xl border border-dashed border-gray-300 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 flex flex-col items-center justify-center cursor-pointer hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all duration-300 group/capture p-2"
                    >
                      <Upload className="w-5 h-5 text-gray-400 group-hover/capture:text-cyan-500 group-hover/capture:scale-110 transition-all mb-1.5" />
                      <span className="text-[9px] font-bold text-cyan-600 dark:text-cyan-400">⚡ Click to Capture</span>
                      <span className="text-[8px] text-gray-400 dark:text-gray-500 mt-0.5">Drop text or image here</span>
                    </div>
                  )}

                  {captureState === "uploading" && (
                    <div className="h-[95px] rounded-xl border border-gray-200/50 dark:border-white/5 bg-gray-50/30 dark:bg-zinc-900/30 flex flex-col items-center justify-center p-3">
                      <Loader2 className="w-5 h-5 text-cyan-500 animate-spin mb-2" />
                      <span className="text-[9px] font-bold text-gray-700 dark:text-gray-300 mb-1.5">Uploading file...</span>
                      <div className="w-full h-1.5 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-cyan-600 rounded-full transition-all duration-100" 
                          style={{ width: `${uploadPercent}%` }}
                        />
                      </div>
                      <span className="text-[8px] text-gray-400 font-mono mt-1">{uploadPercent}%</span>
                    </div>
                  )}

                  {captureState === "extracting" && (
                    <div className="h-[95px] rounded-xl border border-cyan-500/30 bg-cyan-500/5 flex flex-col items-center justify-center p-3 text-center">
                      <SparklesIcon className="w-6 h-6 text-emerald-500 animate-bounce mb-1.5" />
                      <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 animate-pulse">Gemini OCR Parsing...</span>
                      <span className="text-[8px] text-gray-400 dark:text-gray-500 mt-1">Extracting visual structures</span>
                    </div>
                  )}

                  {captureState === "done" && (
                    <div className="rounded-xl border border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/20 p-2.5 flex flex-col justify-between hover:bg-emerald-500/15 transition-all duration-300 text-left">
                      <div className="flex items-center justify-between border-b border-emerald-500/20 pb-1.5">
                        <span className="text-[8.5px] font-bold text-emerald-600 dark:text-emerald-400 truncate w-32 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          wireframe_v2.png
                        </span>
                        <span className="text-[7.5px] text-gray-400 dark:text-zinc-500 font-mono">1.2 MB</span>
                      </div>
                      
                      <div className="my-1.5 text-[8px] leading-relaxed text-gray-600 dark:text-gray-300">
                        <span className="font-bold text-cyan-500 block">AI Structure Extracted:</span>
                        Dashboard mockup detailing collapsible side panels. Synced to <strong className="text-cyan-600 font-semibold dark:text-cyan-400">#strategy</strong> tag.
                      </div>

                      <button 
                        onClick={resetCaptureSequence}
                        className="py-1 rounded bg-zinc-200/50 hover:bg-red-500/10 hover:text-red-500 dark:bg-zinc-800 text-[8px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                        Clear & Reset
                      </button>
                    </div>
                  )}

                </div>

                {/* Aesthetic Backdrop Blur Blobs */}
                <div className="absolute top-16 right-16 w-32 h-32 rounded-full bg-cyan-500/10 blur-[60px] pointer-events-none" />
                <div className="absolute bottom-16 left-12 w-32 h-32 rounded-full bg-teal-500/10 blur-[60px] pointer-events-none" />

              </div>
            </div>

          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* INTERACTIVE 3D WORKSPACE PREVIEW MOCKUP SECTION */}
        {/* ---------------------------------------------------- */}
        <div id="workspace-preview" className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24 md:mt-32 pb-6 z-30 text-center">
          
          <div className="mb-6 sm:mb-10 md:mb-12 max-w-3xl mx-auto select-none">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold mb-3 sm:mb-4 tracking-tight text-gray-900 dark:text-white leading-tight">
              A Unified{" "}
              <span className="bg-gradient-to-r from-cyan-600 via-teal-500 to-emerald-500 bg-clip-text text-transparent">
                Productivity Canvas
              </span>
            </h2>
            <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 font-light leading-relaxed">
              Hover folder feeds, sync cloud nodes, and slide the context-aware AI Copilot panel. Experience visual and architectural harmony.
            </p>
          </div>

          <div className="perspective-1500 w-full flex justify-center relative">
            
            {/* Dither Performance Toggler Switch */}
            <div className="absolute -top-10 sm:-top-12 right-0 sm:right-4 z-40 select-none">
              <button
                onClick={() => setDitherEnabled(!ditherEnabled)}
                className={cn(
                  "px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[8px] sm:text-[10px] font-bold tracking-wider uppercase border flex items-center gap-1 sm:gap-1.5 shadow-sm transition-all duration-300 cursor-pointer",
                  ditherEnabled 
                    ? "bg-cyan-600 text-white border-cyan-500 shadow-cyan-500/20 shadow-lg" 
                    : "bg-white/70 dark:bg-zinc-950/70 border-gray-200 dark:border-white/10 text-gray-500 hover:text-gray-800 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-900"
                )}
              >
                {ditherEnabled ? <Cpu className="w-3.5 h-3.5 text-cyan-300 animate-spin" /> : <MonitorPlay className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />}
                🖥️ Ultra Visuals (WebGL): {ditherEnabled ? "ON" : "OFF"}
              </button>
            </div>

            {/* Main Interactive 3D Browser Mockup Container */}
            <div
              ref={mockupRef}
              className="w-full max-w-5xl rounded-3xl bg-white/80 dark:bg-zinc-950/85 border border-gray-200/80 dark:border-white/10 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.1)] dark:shadow-none backdrop-blur-2xl overflow-hidden transition-all duration-700 ease-out origin-top mockup-3d-tilt"
            >
              
              {/* Browser Window Header Navigation Bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-gray-100/90 dark:bg-zinc-900/90 border-b border-gray-200/50 dark:border-white/5 select-none">
                
                {/* Simulated window triggers */}
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/95" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/95" />
                  <div className="w-3 h-3 rounded-full bg-green-400/95" />
                </div>
                
                {/* Safe HTTPS browser URL input */}
                <div className="flex-1 max-w-[180px] sm:max-w-md mx-auto h-6 sm:h-6.5 bg-white/70 dark:bg-zinc-800/80 rounded-lg text-[8px] sm:text-[9.5px] text-gray-400 dark:text-zinc-500 flex items-center justify-center gap-1 sm:gap-1.5 border border-gray-200/30 dark:border-white/5 font-mono truncate px-2">
                  <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                  <span className="truncate">snackstack.com/app/dashboard</span>
                </div>
                
                {/* Sidebar Collapsible Trigger Action */}
                <button 
                  onClick={() => setCopilotPanelOpen(!copilotPanelOpen)}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-[9px] font-bold uppercase transition-all flex items-center gap-1 border cursor-pointer",
                    copilotPanelOpen 
                      ? "bg-cyan-500/10 text-cyan-500 border-cyan-500/20" 
                      : "bg-gray-200/50 text-gray-500 border-transparent dark:bg-zinc-800"
                  )}
                  title="Toggle AI Copilot"
                >
                  <SparklesIcon className="w-3 h-3 text-cyan-500 animate-pulse" />
                  <span className="hidden sm:inline">AI Drawer</span>
                </button>
              </div>

              {/* Inner Workspace Layout */}
              <div className="flex h-[260px] sm:h-[380px] md:h-[460px] overflow-hidden text-[10px] sm:text-sm font-sans select-none text-left">
                
                {/* COLUMN 1: SIDEBAR (Directories & Tags) */}
                <div className="hidden sm:flex w-1/4 min-w-[150px] md:min-w-[190px] bg-gray-50/50 dark:bg-zinc-900/30 p-3 md:p-4 border-r border-gray-200/50 dark:border-white/5 flex-col justify-between">
                  <div className="space-y-5">
                    
                    {/* Brand Banner */}
                    <div className="flex items-center gap-2 px-1 sm:px-1.5">
                      <div className="w-5.5 h-5.5 rounded bg-cyan-600 text-white flex items-center justify-center font-bold text-[10px]">
                        S
                      </div>
                      <span className="font-extrabold text-xs hidden sm:inline-block tracking-tight text-gray-800 dark:text-white">
                        SnackStack
                      </span>
                    </div>
                    
                    {/* Navigation Directories List */}
                    <div className="space-y-1">
                      <button 
                        onClick={() => setActiveDashboardTab("notes")}
                        className={cn(
                          "w-full flex items-center gap-2 p-2 rounded-lg text-left transition-colors cursor-pointer",
                          activeDashboardTab === "notes"
                            ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold"
                            : "text-gray-500 hover:bg-black/5 dark:hover:bg-white/5"
                        )}
                      >
                        <FileText className="w-4 h-4 text-cyan-500" />
                        <span className="hidden sm:inline-block text-[11px]">All Notes</span>
                      </button>

                      <button 
                        onClick={() => setActiveDashboardTab("capture")}
                        className={cn(
                          "w-full flex items-center gap-2 p-2 rounded-lg text-left transition-colors cursor-pointer",
                          activeDashboardTab === "capture"
                            ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold"
                            : "text-gray-500 hover:bg-black/5 dark:hover:bg-white/5"
                        )}
                      >
                        <Zap className="w-4 h-4 text-cyan-500" />
                        <span className="hidden sm:inline-block text-[11px]">Quick Capture</span>
                      </button>

                      <button 
                        onClick={() => setActiveDashboardTab("starred")}
                        className={cn(
                          "w-full flex items-center gap-2 p-2 rounded-lg text-left transition-colors cursor-pointer",
                          activeDashboardTab === "starred"
                            ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold"
                            : "text-gray-500 hover:bg-black/5 dark:hover:bg-white/5"
                        )}
                      >
                        <SparklesIcon className="w-4 h-4 text-cyan-500" />
                        <span className="hidden sm:inline-block text-[11px]">AI Starred</span>
                      </button>
                    </div>

                    {/* Tag Folders */}
                    <div className="space-y-2 pt-2 border-t border-gray-200/50 dark:border-white/5">
                      <span className="text-[9px] uppercase font-extrabold tracking-widest text-gray-400 dark:text-gray-500 px-2 hidden sm:inline-block">Tags</span>
                      <div className="space-y-1">
                        <div className={cn(
                          "flex items-center gap-2 px-2.5 py-1 text-xs transition-colors rounded-md",
                          activeTag === "strategy" ? "bg-cyan-500/10 font-bold animate-pulse" : ""
                        )}>
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                          <span className="hidden sm:inline-block truncate text-gray-500 dark:text-gray-400 text-[10px]">#strategy</span>
                        </div>
                        <div className={cn(
                          "flex items-center gap-2 px-2.5 py-1 text-xs transition-colors rounded-md",
                          activeTag === "pricing" ? "bg-teal-500/10 font-bold animate-pulse" : ""
                        )}>
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                          <span className="hidden sm:inline-block truncate text-gray-500 dark:text-gray-400 text-[10px]">#pricing</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cloud status footer indicator */}
                  <div className="p-2 rounded-lg border border-gray-200/50 dark:border-white/5 bg-white/40 dark:bg-zinc-800/10 text-center text-[9px] font-mono font-medium text-gray-400 dark:text-zinc-500 hidden sm:flex items-center gap-1.5 justify-center group cursor-pointer select-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform" />
                    ☁️ Cloud Synced
                  </div>
                </div>

                {/* COLUMN 2: NOTES LIST FEED */}
                <div className="hidden sm:flex w-1/4 min-w-[160px] md:min-w-[200px] bg-white/30 dark:bg-black/30 p-3 md:p-4 border-r border-gray-200/50 dark:border-white/5 flex-col gap-3">
                  <div className="flex items-center justify-between px-1 select-none">
                    <span className="font-extrabold text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500">Notes Feed</span>
                    <button className="w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-500 flex items-center justify-center font-bold text-xs select-none hover:bg-cyan-500 hover:text-white transition-all cursor-pointer">
                      +
                    </button>
                  </div>
                  
                  {/* Sidebar list items */}
                  <div className="space-y-2 overflow-y-auto pr-1 flex-1">
                    
                    <div className={cn(
                      "p-2.5 rounded-xl border text-left transition-all cursor-pointer",
                      activeDashboardTab === "notes" 
                        ? "border-cyan-500/30 bg-cyan-500/5 dark:bg-cyan-500/10 shadow-sm" 
                        : "border-gray-200/60 dark:border-white/5 bg-white/50 dark:bg-zinc-900/40"
                    )}>
                      <span className="font-bold block text-xs truncate text-gray-800 dark:text-white">Q4 Product Launch</span>
                      <span className="text-[9px] text-gray-400 dark:text-zinc-400 block mt-1 truncate">Drafting target deliverables and Stripe integrations...</span>
                      <span className="text-[8px] text-cyan-500 block mt-2 font-mono">Edited 2m ago</span>
                    </div>
                    
                    <div className={cn(
                      "p-2.5 rounded-xl border text-left transition-all cursor-pointer",
                      activeDashboardTab === "capture" 
                        ? "border-cyan-500/30 bg-cyan-500/5 dark:bg-cyan-500/10 shadow-sm" 
                        : "border-gray-200/60 dark:border-white/5 bg-white/50 dark:bg-zinc-900/40"
                    )}>
                      <span className="font-bold block text-xs truncate text-gray-800 dark:text-white">Quick Wireframe Scan</span>
                      <span className="text-[9px] text-gray-400 dark:text-zinc-400 block mt-1 truncate">Gemini AI identified wireframe nodes...</span>
                      <span className="text-[8px] text-cyan-500 block mt-2 font-mono">Uploaded 1h ago</span>
                    </div>

                    <div className={cn(
                      "p-2.5 rounded-xl border text-left transition-all cursor-pointer border-gray-200/60 dark:border-white/5 bg-white/50 dark:bg-zinc-900/40 hover:border-black/10 dark:hover:border-white/10"
                    )}>
                      <span className="font-bold block text-xs truncate text-gray-800 dark:text-white">Development Backlog</span>
                      <span className="text-[9px] text-gray-400 dark:text-zinc-400 block mt-1 truncate">Aligning engineering milestones and seeding Postgres...</span>
                      <span className="text-[8px] text-gray-400 dark:text-zinc-500 block mt-2 font-mono">Edited 1d ago</span>
                    </div>
                  </div>
                </div>

                {/* COLUMN 3: TEXT EDITOR & COLLAPSIBLE AI DRAWER */}
                <div className="flex-1 bg-white/10 dark:bg-black/10 flex overflow-hidden">
                  
                  {/* Rich Text Editor Area */}
                  <div className="flex-1 p-3 sm:p-4.5 flex flex-col gap-3 sm:gap-3.5 overflow-y-auto">

                    {/* Document Header */}
                    <div className="border-b border-gray-200/50 dark:border-white/5 pb-2 sm:pb-3 flex items-center justify-between">
                      <div>
                        <span className="font-extrabold text-sm sm:text-base text-gray-800 dark:text-white block">
                          {activeDashboardTab === "notes" && "Q4 Product Launch"}
                          {activeDashboardTab === "capture" && "Quick Wireframe Scan"}
                          {activeDashboardTab === "starred" && "Starred AI Suggestions"}
                        </span>
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[8.5px] font-bold tracking-wider">#strategy</span>
                          <span className="px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400 text-[8.5px] font-bold tracking-wider">#pricing</span>
                        </div>
                      </div>
                      <span className="text-[8px] text-gray-400 dark:text-zinc-500 font-mono hidden md:inline">Modified today, 5:48 PM</span>
                    </div>

                    {/* Rich text mock document */}
                    <div className="flex-1 font-mono text-[9px] sm:text-[10px] md:text-xs text-gray-700 dark:text-gray-300 leading-relaxed space-y-2.5 sm:space-y-3.5">
                      <p className="font-bold text-cyan-600 dark:text-cyan-400 text-left">## 1. Project Launch Specification</p>
                      <p className="text-left">
                        Our central focus for the upcoming quarter is deploying the responsive note-taking layout. Leveraging Next.js 15 capabilities alongside shadcn/ui components, we ensure a premium tactile layout suitable for creative crews.
                      </p>
                      
                      <p className="font-bold text-cyan-600 dark:text-cyan-400 text-left">## 2. Dynamic Integrations</p>
                      <p className="text-left">
                        • Integrated payment configurations are handled natively through <strong className="text-cyan-500 font-bold">Stripe billing gates</strong>. Basic (₹749/mo) and Pro (₹1599/mo) layers are initialized inside server actions.
                      </p>
                      <p className="text-left">
                        • Clerk authentication filters are active on all dynamic client workspaces to establish absolute tenant security.
                      </p>
                    </div>

                  </div>

                  {/* Reactive Collapsible AI Drawer Panel */}
                  <AnimatePresence>
                    {copilotPanelOpen && (
                      <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "35%", opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="hidden sm:flex sm:min-w-[140px] md:min-w-[170px] bg-gray-50/70 dark:bg-zinc-900/50 border-l border-gray-200/50 dark:border-white/5 flex-col gap-4 overflow-y-auto"
                      >
                        <div className="p-3.5 border-b border-gray-200/50 dark:border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 font-bold text-xs select-none">
                            <span>✨</span>
                            <span>AI Copilot</span>
                          </div>
                        </div>

                        <div className="px-3.5 pb-4 space-y-4">
                          
                          {/* Live Auto-Summary Card */}
                          <div className="p-2.5 rounded-xl border border-cyan-500/20 bg-cyan-500/5 dark:bg-cyan-500/10 space-y-1.5 text-left">
                            <span className="font-bold text-cyan-600 dark:text-cyan-400 block text-[9.5px]">Auto Summary</span>
                            <p className="text-[8.5px] leading-relaxed text-gray-500 dark:text-zinc-300">
                              Product roadmap prioritizing dynamic Clerk security, basic and pro pricing gates via Stripe, and Gemini structure scans. Uptime targeted at 99.9%.
                            </p>
                          </div>

                          {/* Live Tag suggestions */}
                          <div className="space-y-2 text-left">
                            <span className="font-bold block text-gray-700 dark:text-zinc-200 text-[9.5px]">Suggested Tags</span>
                            <div className="flex flex-wrap gap-1.5">
                              <span className="px-1.5 py-0.5 rounded-md border border-gray-200 dark:border-white/5 bg-white/50 dark:bg-zinc-800/40 hover:bg-cyan-500/10 cursor-pointer text-[8px] font-bold text-cyan-500 select-none">+ billing</span>
                              <span className="px-1.5 py-0.5 rounded-md border border-gray-200 dark:border-white/5 bg-white/50 dark:bg-zinc-800/40 hover:bg-cyan-500/10 cursor-pointer text-[8px] font-bold text-cyan-500 select-none">+ clerk</span>
                            </div>
                          </div>

                          {/* Quick AI Action tools */}
                          <div className="space-y-2 text-left">
                            <span className="font-bold block text-gray-700 dark:text-zinc-200 text-[9.5px]">Assistant Actions</span>
                            <button 
                              onClick={() => {
                                setActiveDashboardTab("starred");
                                handleStartChatSim("summary");
                              }}
                              className="w-full text-center py-1.5 px-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-[8px] font-bold transition-all shadow-sm cursor-pointer select-none"
                            >
                              Run Note Analysis
                            </button>
                          </div>

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Embedded CSS Animations for Premium Float Dynamics */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-12px) rotate(0.5deg);
          }
        }
        .animate-float {
          animation: float 7s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin 6s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};

export default Hero;
