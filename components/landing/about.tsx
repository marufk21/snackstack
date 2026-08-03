"use client";

import React, { useRef } from "react";
import {
  CheckCircle2,
  Zap,
  Shield,
  Brain,
  Sparkles,
  Cpu,
  ArrowRight,
} from "lucide-react";
import { useGSAP } from "@/hooks/use-gsap";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PageWrapper from "./page-wrapper";


const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const leftContentRef = useRef<HTMLDivElement>(null);
  const rightContentRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Lightning Fast",
      description: "Optimized for speed and performance across all devices with edge-rendered pages.",
      gradient: "from-amber-500 to-orange-600",
      bg: "bg-amber-500/10",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Secure & Reliable",
      description: "End-to-end encrypted with Google OAuth secure authentication and automatic data backups.",
      gradient: "from-emerald-500 to-teal-600",
      bg: "bg-emerald-500/10",
    },
    {
      icon: <Brain className="w-5 h-5" />,
      title: "AI-Powered",
      description: "Gemini 2.5 Flash drives intelligent suggestions, summaries, and content enhancement.",
      gradient: "from-cyan-500 to-cyan-600",
      bg: "bg-cyan-500/10",
    },
  ];

  const stats = [
    { number: "GPT-5", label: "AI Model", icon: <Brain className="w-4 h-4" /> },
    { number: "Gemini 2.5", label: "Fallback Model", icon: <Cpu className="w-4 h-4" /> },
    { number: "∞", label: "AI Actions", icon: <Sparkles className="w-4 h-4" /> },
    { number: "Secure", label: "Google OAuth", icon: <Shield className="w-4 h-4" /> },
  ];

  useGSAP(() => {
    // Header animation
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // Left content animation
    if (leftContentRef.current) {
      const checkItems = leftContentRef.current.querySelectorAll(".check-item");

      gsap.fromTo(
        leftContentRef.current.querySelector("h3"),
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: leftContentRef.current,
            start: "top 75%",
          },
        }
      );

      gsap.fromTo(
        leftContentRef.current.querySelector("p"),
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          delay: 0.2,
          scrollTrigger: {
            trigger: leftContentRef.current,
            start: "top 75%",
          },
        }
      );

      gsap.fromTo(
        checkItems,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.1,
          scrollTrigger: {
            trigger: leftContentRef.current,
            start: "top 70%",
          },
        }
      );
    }

    // Right content - feature cards with parallax
    if (rightContentRef.current) {
      const cards = rightContentRef.current.querySelectorAll(".feature-card");

      cards.forEach((card, index) => {
        // Card entrance animation
        gsap.fromTo(
          card,
          { opacity: 0, y: 50, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: index * 0.15,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Parallax effect on cards
        gsap.to(card, {
          y: -20 * (index + 1),
          ease: "none",
          scrollTrigger: {
            trigger: rightContentRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    }

    // Stats counter animation
    if (statsRef.current) {
      const statNumbers = statsRef.current.querySelectorAll(".stat-number");

      statNumbers.forEach((stat, index) => {
        gsap.fromTo(
          stat,
          { opacity: 0, scale: 0.5 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            delay: index * 0.1,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }
  }, []);

  return (
    <PageWrapper ref={sectionRef} id="about">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-8 sm:mb-12 md:mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
            <span className="text-cyan-600 dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider">
              About SnackStack
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-3 sm:mb-5 tracking-tight leading-tight">
            Built for{" "}
            <span className="bg-gradient-to-r from-cyan-600 via-emerald-500 to-teal-600 bg-clip-text text-transparent">
              Modern Thinkers
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
            We are redefining how ideas are captured, organized, and enhanced —
            blending cutting-edge AI with an intuitive design language built for speed and clarity.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-8 sm:mb-14 md:mb-18">
          {/* Left Content */}
          <div ref={leftContentRef} className="space-y-6 sm:space-y-8">
            <div className="space-y-3 sm:space-y-5">
              <h3 className="text-xl sm:text-3xl font-bold text-foreground leading-tight">
                More than just{" "}
                <span className="bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">notes</span>
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                SnackStack fuses a rich editing surface with Gemini AI to surface connections,
                automate tagging, and transform raw thoughts into structured insight — without
                breaking your flow.
              </p>
            </div>

            <div className="space-y-2 sm:space-y-4">
              {[
                { title: "AI suggestions", desc: "Context-aware content enhancement, summaries, and rewrites" },
                { title: "Smart organization", desc: "Auto-tagging, instant search, and relationship mapping" },
                { title: "Secure by default", desc: "Google OAuth authentication with encrypted data storage" },
                { title: "Flexible plans", desc: "Free tier with 5 notes and 30 AI suggestions per month" },
              ].map((item, index) => (
                <div key={index} className="check-item flex items-start gap-4 p-3.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-200">
                  <div className="bg-emerald-500/10 rounded-lg p-1.5 flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-foreground block">{item.title}</span>
                    <span className="text-xs text-muted-foreground">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Features Grid */}
          <div ref={rightContentRef} className="grid gap-3 sm:gap-5">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card group relative bg-white dark:bg-zinc-900/60 border border-gray-200/60 dark:border-white/10 rounded-2xl p-6 hover:shadow-xl hover:shadow-cyan-500/5 transition-all duration-500 hover:border-cyan-500/30 hover:-translate-y-0.5 backdrop-blur-sm overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-emerald-500/0 to-teal-500/0 group-hover:from-cyan-500/[0.02] group-hover:via-emerald-500/[0.02] group-hover:to-teal-500/[0.02] transition-all duration-500 rounded-2xl" />
                <div className="relative flex items-start gap-4">
                  <div className={`bg-gradient-to-br ${feature.gradient} rounded-xl p-3 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <div className="flex-1 pt-0.5">
                    <h4 className="text-lg font-bold text-foreground mb-1.5">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0 mt-2" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 pt-8 sm:pt-12 md:pt-16 border-t border-gray-200/60 dark:border-white/10"
        >
          {stats.map((stat, index) => (
            <div key={index} className="relative text-center group p-3 sm:p-6 rounded-2xl hover:bg-white/50 dark:hover:bg-white/5 border border-transparent hover:border-gray-200/60 dark:hover:border-white/10 transition-all duration-300">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-cyan-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex flex-col items-center gap-2">
                <div className="text-cyan-500/60 group-hover:text-cyan-500 transition-colors duration-300">
                  {stat.icon}
                </div>
                <div className="stat-number text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-medium text-xs sm:text-sm tracking-wide">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
};

export default About;
