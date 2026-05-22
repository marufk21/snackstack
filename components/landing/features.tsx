"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Sparkles, Brain, FileText, ArrowRight, Wand2 } from "lucide-react";
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
        {/* Feature Slides */}
        {services.map((service, index) => (
          <div
            key={index}
            className="w-screen h-screen flex items-center justify-center px-4 py-6 sm:p-8 md:p-10 lg:p-12 shrink-0 relative"
          >
            {/* Slide background glow */}
            <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-[0.03] dark:opacity-[0.05]`} />
            <div className={`absolute top-1/3 left-1/4 w-96 h-96 bg-gradient-to-br ${service.gradient} opacity-[0.06] blur-[120px] rounded-full`} />

            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 lg:gap-14 items-center relative z-10">
              {/* Left: Content */}
              <div className="space-y-4 sm:space-y-6 md:space-y-8 order-2 md:order-1">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
                  <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.gradient}`} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Feature {index + 1} of {services.length}
                  </span>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg font-light">
                    {service.description}
                  </p>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {service.features.map((feature, fIndex) => (
                    <li
                      key={fIndex}
                      className="flex items-center gap-3 text-sm font-medium text-foreground/80 bg-white/40 dark:bg-white/5 border border-gray-200/40 dark:border-white/5 rounded-xl px-4 py-3 backdrop-blur-sm hover:border-violet-500/30 transition-all duration-300"
                    >
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${service.gradient} flex-shrink-0`} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right: Visual */}
              <div className="order-1 md:order-2 flex justify-center relative w-full mb-4 md:mb-0">
                <div className="relative w-full max-w-[420px] md:max-w-[460px] aspect-[5/4]">
                  {/* Glowing backdrop */}
                  <div className={`absolute -inset-6 bg-gradient-to-br ${service.gradient} opacity-10 blur-[80px] rounded-full`} />

                  {/* Main visual card */}
                  <div className="relative h-full rounded-2xl md:rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-15 mix-blend-overlay`} />

                    {/* Floating badge on the visual */}
                    <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-lg">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${service.gradient} flex items-center justify-center text-white text-sm`}>
                          {React.cloneElement(service.icon as React.ReactElement<any>, { className: "w-4 h-4" })}
                        </div>
                        <div className="text-left">
                          <div className="text-xs font-bold text-foreground">{service.title}</div>
                          <div className="text-[10px] text-muted-foreground">{service.features.length} capabilities</div>
                        </div>
                      </div>
                    </div>
                  </div>
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
