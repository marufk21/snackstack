"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Sparkles, Brain, FileText, ArrowRight, Wand2, Zap, Star, Layers } from "lucide-react";
import { useGSAP } from "@/hooks/use-gsap";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const Features = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const services = [
    {
      icon: <Wand2 className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: "AI-Powered Suggestions",
      description:
        "Get intelligent suggestions and insights as you write. Our AI helps you organize thoughts, find connections, and enhance your notes.",
      features: [
        "Smart Summarization",
        "Content Enhancement",
        "Related Ideas",
        "Grammar & Style",
      ],
      accent: "cyan",
      image: "/features/ai-suggestions.png",
    },
    {
      icon: <Brain className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: "Intelligent Organization",
      description:
        "Automatically categorize and tag your notes with AI. Find what you need instantly with powerful search and smart filters.",
      features: [
        "Auto-Tagging",
        "Smart Categories",
        "Quick Search",
        "Relationship Mapping",
      ],
      accent: "teal",
      image: "/features/smart-organization.png",
    },
    {
      icon: <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: "Collaborative Features",
      description:
        "Work together seamlessly with real-time collaboration. Share notes, get feedback, and build on each other's ideas.",
      features: [
        "Real-time Editing",
        "Commenting",
        "Sharing Controls",
        "Version History",
      ],
      accent: "emerald",
      image: "/features/collaboration.png",
    },
    {
      icon: <FileText className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: "Rich Note-Taking",
      description:
        "Create beautiful, rich notes with markdown support, images, and embedded content. All your information in one place.",
      features: [
        "Markdown Support",
        "Image Uploads",
        "Embed Content",
        "Custom Templates",
      ],
      accent: "sky",
      image: "/features/rich-notes.png",
    },
  ];

  const accentMap: Record<string, { bg: string; border: string; text: string; glow: string; dot: string }> = {
    cyan: {
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/30",
      text: "text-cyan-600 dark:text-cyan-400",
      glow: "bg-cyan-500/10",
      dot: "bg-cyan-500",
    },
    teal: {
      bg: "bg-teal-500/10",
      border: "border-teal-500/30",
      text: "text-teal-600 dark:text-teal-400",
      glow: "bg-teal-500/10",
      dot: "bg-teal-500",
    },
    emerald: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      text: "text-emerald-600 dark:text-emerald-400",
      glow: "bg-emerald-500/10",
      dot: "bg-emerald-500",
    },
    sky: {
      bg: "bg-sky-500/10",
      border: "border-sky-500/30",
      text: "text-sky-600 dark:text-sky-400",
      glow: "bg-sky-500/10",
      dot: "bg-sky-500",
    },
  };

  useGSAP(() => {
    const track = trackRef.current;
    const container = containerRef.current;

    if (track && container) {
      ScrollTrigger.matchMedia({
        "(min-width: 768px)": () => {
          gsap.to(track, {
            x: () => -(track.scrollWidth - window.innerWidth),
            ease: "none",
            scrollTrigger: {
              trigger: container,
              start: "top top",
              end: () => `+=${track.scrollWidth}`,
              pin: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
        },
        "(max-width: 767px)": () => {
          gsap.to(track, {
            x: () => -(track.scrollWidth - window.innerWidth),
            ease: "power1.out",
            scrollTrigger: {
              trigger: container,
              start: "top top",
              end: () => `+=${track.scrollWidth}`,
              pin: true,
              scrub: 0.6,
              anticipatePin: 0.5,
              invalidateOnRefresh: true,
            },
          });
        },
      });
    }
  }, []);

  return (
    <section
      id="services"
      ref={containerRef}
      className="relative w-full overflow-hidden bg-background z-0"
    >
      <div ref={trackRef} className="flex w-fit h-screen">
        <h2 className="sr-only">Features</h2>

        {services.map((service, index) => {
          const accent = accentMap[service.accent];

          return (
            <div
              key={index}
              className="w-screen h-screen flex items-center justify-center px-4 sm:px-10 md:px-14 lg:px-20 shrink-0 relative"
            >
              {/* Ambient glow orb — lighter on mobile */}
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] ${accent.glow} blur-[60px] sm:blur-[120px] rounded-full opacity-30 sm:opacity-50`} />

              <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-16 items-center relative z-10">
                {/* Left: Content */}
                <div className="space-y-4 sm:space-y-7 order-2 md:order-1">
                  {/* Step indicator */}
                  <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border ${accent.border} ${accent.bg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${accent.dot}`} />
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Feature {index + 1} of {services.length}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2 sm:space-y-4">
                    <h3 className="text-xl sm:text-4xl md:text-5xl font-extrabold text-foreground leading-[1.1] tracking-tight">
                      {service.title}
                    </h3>
                    <p className="text-xs sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg">
                      {service.description}
                    </p>
                  </div>

                  {/* Feature grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {service.features.map((feature, fIndex) => (
                      <div
                        key={fIndex}
                        className="flex items-center gap-2.5 px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl bg-white/40 dark:bg-white/[0.03] border border-gray-200/30 dark:border-white/[0.06]"
                      >
                        <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg ${accent.bg} flex items-center justify-center flex-shrink-0`}>
                          <Zap className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${accent.text}`} />
                        </div>
                        <span className="text-xs sm:text-sm font-medium sm:font-semibold text-foreground/80">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Visual */}
                <div className="order-1 md:order-2 flex justify-center relative w-full mb-2 md:mb-0">
                  <div className="relative w-full max-w-[260px] sm:max-w-[340px] md:max-w-[440px] aspect-[4/3]">
                    {/* Main visual card */}
                    <div className="relative h-full rounded-2xl md:rounded-3xl bg-white/[0.03] border border-white/[0.08] overflow-hidden shadow-xl sm:shadow-2xl shadow-black/10 dark:shadow-black/30">
                      <div className={`absolute inset-0 bg-gradient-to-br ${accent.bg} opacity-40`} />

                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        sizes="(max-width: 640px) 260px, (max-width: 768px) 340px, 440px"
                        className="object-cover opacity-90"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

                      {/* Floating badge */}
                      <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 p-2.5 sm:p-3.5 rounded-lg sm:rounded-xl bg-white/90 dark:bg-zinc-900/90 border border-white/20 dark:border-white/[0.08] shadow-lg">
                        <div className="flex items-center gap-2.5 sm:gap-3">
                          <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl ${accent.bg} ${accent.border} border flex items-center justify-center`}>
                            {React.cloneElement(service.icon as React.ReactElement<any>, { className: `w-3.5 h-3.5 sm:w-4 sm:h-4 ${accent.text}` })}
                          </div>
                          <div className="text-left flex-1 min-w-0">
                            <div className="text-[11px] sm:text-xs font-bold text-foreground truncate">{service.title}</div>
                            <div className="text-[9px] sm:text-[10px] text-muted-foreground flex items-center gap-1">
                              <Star className="w-2 h-2 sm:w-2.5 sm:h-2.5 fill-amber-500 text-amber-500 flex-shrink-0" />
                              {service.features.length} capabilities
                            </div>
                          </div>
                          <ArrowRight className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${accent.text} opacity-50 flex-shrink-0`} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Features;
