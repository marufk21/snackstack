"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Sparkles, Brain, FileText, ArrowRight, Wand2, Zap, Star, Layers } from "lucide-react";
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
      icon: <Wand2 className="w-5 h-5" />,
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
      icon: <Brain className="w-5 h-5" />,
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
      icon: <Sparkles className="w-5 h-5" />,
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
      icon: <FileText className="w-5 h-5" />,
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
      const getScrollAmount = () => {
        return -(track.scrollWidth - window.innerWidth);
      };

      gsap.to(track, {
        x: getScrollAmount,
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
              className="w-screen h-screen flex items-center justify-center px-6 sm:px-10 md:px-14 lg:px-20 shrink-0 relative"
            >
              {/* Subtle background texture */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_40%,transparent_100%)]" />

              {/* Ambient glow orb */}
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] ${accent.glow} blur-[120px] rounded-full opacity-50`} />

              <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center relative z-10">
                {/* Left: Content */}
                <div className="space-y-5 sm:space-y-7 order-2 md:order-1">
                  {/* Step indicator */}
                  <div className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border ${accent.border} ${accent.bg} backdrop-blur-sm`}>
                    <span className={`w-2 h-2 rounded-full ${accent.dot}`} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Feature {index + 1} of {services.length}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-4">
                    <h3 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-foreground leading-[1.1] tracking-tight">
                      {service.title}
                    </h3>
                    <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg font-light">
                      {service.description}
                    </p>
                  </div>

                  {/* Feature grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {service.features.map((feature, fIndex) => (
                      <div
                        key={fIndex}
                        className="group flex items-center gap-3 px-4 py-3 rounded-xl bg-white/40 dark:bg-white/[0.03] border border-gray-200/30 dark:border-white/[0.06] backdrop-blur-sm hover:border-white/20 dark:hover:border-white/15 transition-all duration-300 hover:bg-white/60 dark:hover:bg-white/[0.06] hover:-translate-y-0.5"
                      >
                        <div className={`w-8 h-8 rounded-lg ${accent.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                          <Zap className={`w-3.5 h-3.5 ${accent.text}`} />
                        </div>
                        <span className="text-sm font-semibold text-foreground/80 group-hover:text-foreground transition-colors">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Visual */}
                <div className="order-1 md:order-2 flex justify-center relative w-full mb-2 md:mb-0">
                  <div className="relative w-full max-w-[340px] sm:max-w-[400px] md:max-w-[440px] aspect-[4/3]">
                    {/* Layered glow orbs behind the visual */}
                    <div className={`absolute -inset-10 ${accent.glow} blur-[100px] rounded-full opacity-60`} />
                    <div className="absolute -inset-4 bg-gradient-to-br from-background/80 via-transparent to-background/80 blur-3xl rounded-full" />

                    {/* Main visual card */}
                    <div className="relative h-full rounded-2xl md:rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/10 dark:shadow-black/30">
                      {/* Inner glow */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${accent.bg} opacity-40`} />

                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover opacity-90"
                      />

                      {/* Gradient overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent`} />

                      {/* Floating stats badge */}
                      <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-white/20 dark:border-white/[0.08] shadow-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl ${accent.bg} ${accent.border} border flex items-center justify-center`}>
                            {React.cloneElement(service.icon as React.ReactElement<any>, { className: `w-4 h-4 ${accent.text}` })}
                          </div>
                          <div className="text-left flex-1">
                            <div className="text-xs font-bold text-foreground">{service.title}</div>
                            <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                              {service.features.length} powerful capabilities
                            </div>
                          </div>
                          <ArrowRight className={`w-4 h-4 ${accent.text} opacity-50`} />
                        </div>
                      </div>
                    </div>

                    {/* Floating decorative element */}
                    <div className={`absolute -top-3 -right-3 w-12 h-12 rounded-xl ${accent.bg} ${accent.border} border backdrop-blur-xl flex items-center justify-center shadow-lg rotate-12`}>
                      <Layers className={`w-5 h-5 ${accent.text}`} />
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
