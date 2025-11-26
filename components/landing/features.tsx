"use client";

import React, { useRef } from "react";
import Image from "next/image";
import {
  Sparkles,
  Brain,
  FileText,
  ArrowRight,
  Wand2,
} from "lucide-react";
import { useGSAP } from "@/hooks/use-gsap";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const Features = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const services = [
    {
      icon: <Wand2 className="w-8 h-8" />,
      title: "AI-Powered Suggestions",
      description:
        "Get intelligent suggestions and insights as you write. Our AI helps you organize thoughts, find connections, and enhance your notes.",
      features: [
        "Smart Summarization",
        "Content Enhancement",
        "Related Ideas",
        "Grammar & Style",
      ],
      gradient: "from-purple-500 to-pink-500",
      image: "/features/ai-suggestions.png",
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Intelligent Organization",
      description:
        "Automatically categorize and tag your notes with AI. Find what you need instantly with powerful search and smart filters.",
      features: [
        "Auto-Tagging",
        "Smart Categories",
        "Quick Search",
        "Relationship Mapping",
      ],
      gradient: "from-blue-500 to-cyan-500",
      image: "/features/smart-organization.png",
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Collaborative Features",
      description:
        "Work together seamlessly with real-time collaboration. Share notes, get feedback, and build on each other's ideas.",
      features: [
        "Real-time Editing",
        "Commenting",
        "Sharing Controls",
        "Version History",
      ],
      gradient: "from-green-500 to-emerald-500",
      image: "/features/collaboration.png",
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Rich Note-Taking",
      description:
        "Create beautiful, rich notes with markdown support, images, and embedded content. All your information in one place.",
      features: [
        "Markdown Support",
        "Image Uploads",
        "Embed Content",
        "Custom Templates",
      ],
      gradient: "from-orange-500 to-red-500",
      image: "/features/rich-notes.png",
    },
  ];

  useGSAP(() => {
    const track = trackRef.current;
    const container = containerRef.current;

    if (track && container) {
      const getScrollAmount = () => {
        return -(track.scrollWidth - window.innerWidth);
      };

      gsap.to(track, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }
  }, []);

  return (
    <section ref={containerRef} className="relative w-full overflow-hidden bg-background z-0">
      <div ref={trackRef} className="flex w-fit h-screen">
        {/* Slide 1: Header */}
        <div className="w-screen h-screen flex flex-col items-center justify-center p-8 shrink-0 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-500/10 via-transparent to-transparent opacity-50" />

          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              <span className="text-violet-600 dark:text-violet-400 text-sm font-medium">
                Powerful Features
              </span>
            </div>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-foreground mb-8 tracking-tight">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent">
                Capture Ideas
              </span>
            </h2>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
              From simple notes to complex knowledge bases, our AI-powered
              platform helps you capture, organize, and enhance your thoughts like
              never before.
            </p>
          </div>
        </div>

        {/* Slides 2+: Services */}
        {services.map((service, index) => (
          <div
            key={index}
            className="w-screen h-screen flex items-center justify-center p-4 sm:p-8 shrink-0 relative"
          >
            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
              {/* Left: Content */}
              <div className="space-y-8 order-2 md:order-1">
                <div
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${service.gradient} p-5 text-white shadow-2xl`}
                >
                  {React.cloneElement(service.icon as React.ReactElement<any>, {
                    className: "w-full h-full",
                  })}
                </div>
                <div className="space-y-4">
                  <h3 className="text-4xl sm:text-5xl font-bold text-foreground">
                    {service.title}
                  </h3>
                  <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                    {service.description}
                  </p>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.features.map((feature, fIndex) => (
                    <li
                      key={fIndex}
                      className="flex items-center gap-3 text-lg font-medium text-muted-foreground"
                    >
                      <div
                        className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.gradient}`}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right: Visual */}
              <div className="order-1 md:order-2 flex justify-center relative w-full">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-20 blur-[100px] rounded-full`}
                />
                <div className="relative w-full max-w-[500px] aspect-[5/4] bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-10 mix-blend-overlay`} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;

