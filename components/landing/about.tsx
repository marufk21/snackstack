"use client";

import React, { useRef } from "react";
import {
  CheckCircle2,
  Zap,
  Shield,
  Rocket,
  Brain,
  Sparkles,
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
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Optimized for speed and performance across all devices",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with 99.9% uptime guarantee",
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered",
      description: "Intelligent suggestions and organization powered by AI",
    },
  ];

  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" },
    { number: "50+", label: "Countries" },
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
        <div ref={headerRef} className="text-center mb-10 md:mb-14 lg:mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-5 md:mb-6">
            <Rocket className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-purple-600 dark:text-purple-400 text-xs sm:text-sm font-medium">
              About Us
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-foreground mb-4 md:mb-5 lg:mb-6 tracking-tight leading-tight">
            About{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              SnackStack
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We're revolutionizing how people capture and organize their ideas.
            Our AI-powered note-taking platform combines cutting-edge technology
            with intuitive design to deliver powerful solutions that enhance
            your thinking.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center mb-10 md:mb-14 lg:mb-16">
          {/* Left Content */}
          <div ref={leftContentRef} className="space-y-6 md:space-y-8">
            <div className="space-y-4 md:space-y-6">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground leading-tight">
                AI-Powered Note-Taking
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
                SnackStack was built for the modern need to capture and enhance
                ideas. Our team of experienced engineers and AI specialists have
                crafted a platform that uses artificial intelligence to help you
                organize thoughts, find connections, and express ideas more
                effectively.
              </p>
            </div>

            <div className="space-y-3 md:space-y-4">
              {[
                "AI-powered suggestions and content enhancement",
                "Intelligent organization and automatic tagging",
                "Seamless collaboration with real-time editing",
                "Powerful search and relationship mapping",
              ].map((item, index) => (
                <div key={index} className="check-item flex items-start gap-2 sm:gap-3">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Features Grid */}
          <div ref={rightContentRef} className="grid gap-5 md:gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card group bg-white/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 rounded-xl md:rounded-2xl p-5 md:p-6 hover:shadow-xl transition-all duration-300 hover:border-violet-500/30 backdrop-blur-sm"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="bg-gradient-to-br from-violet-500 to-indigo-500 rounded-lg sm:rounded-xl p-2.5 sm:p-3 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg sm:text-xl font-bold text-foreground mb-1.5 sm:mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6 pt-10 md:pt-14 lg:pt-16 border-t border-border"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center group p-4 sm:p-5 md:p-6 rounded-xl md:rounded-2xl bg-white/50 dark:bg-white/5 border border-transparent hover:border-violet-500/20 transition-all duration-300">
              <div className="stat-number text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.number}
              </div>
              <div className="text-muted-foreground font-medium text-xs sm:text-sm md:text-base lg:text-lg">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
};

export default About;
