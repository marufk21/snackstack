"use client";

import React, { useRef } from "react";
import {
  Lightbulb,
  Sparkles,
  Brain,
  FileText,
  ArrowRight,
  Wand2,
} from "lucide-react";
import { useGSAP } from "@/hooks/use-gsap";
import gsap from "gsap";
import PageWrapper from "./page-wrapper";

const Services = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
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
    },
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

    // Service cards animation
    if (cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll(".service-card");

      cards.forEach((card, index) => {
        // Card entrance
        gsap.fromTo(
          card,
          { opacity: 0, y: 60, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: index * 0.15,
            ease: "back.out(1.3)",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Icon animation
        const icon = card.querySelector(".service-icon");
        if (icon) {
          gsap.fromTo(
            icon,
            { rotation: -15, scale: 0.8 },
            {
              rotation: 0,
              scale: 1,
              duration: 0.6,
              delay: index * 0.15 + 0.3,
              ease: "back.out(1.7)",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
              },
            }
          );
        }

        // Feature items stagger
        const features = card.querySelectorAll(".feature-item");
        gsap.fromTo(
          features,
          { opacity: 0, x: -10 },
          {
            opacity: 1,
            x: 0,
            duration: 0.4,
            stagger: 0.08,
            delay: index * 0.15 + 0.5,
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
            },
          }
        );

        // Parallax effect
        gsap.to(card, {
          y: -15 * (index % 2 === 0 ? 1 : -1),
          ease: "none",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    }
  }, []);

  return (
    <PageWrapper ref={sectionRef} id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            <span className="text-violet-600 dark:text-violet-400 text-sm font-medium">
              Powerful Features
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 tracking-tight">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent">
              Capture Ideas
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
            From simple notes to complex knowledge bases, our AI-powered
            platform helps you capture, organize, and enhance your thoughts like
            never before.
          </p>
        </div>

        {/* Services Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className={`service-card group relative ${
                index === 0 || index === 3 ? "md:col-span-2" : "md:col-span-1"
              }`}
            >
              <div className="bg-white/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 rounded-3xl p-8 h-full hover:shadow-2xl transition-all duration-500 hover:border-violet-500/30 hover:-translate-y-2 backdrop-blur-sm overflow-hidden">
                {/* Background Gradient Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                <div className="relative z-10 flex flex-col h-full">
                  {/* Icon with gradient background */}
                  <div className="mb-6">
                    <div
                      className={`service-icon bg-gradient-to-br ${service.gradient} rounded-2xl p-4 text-white w-fit shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      {service.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-4 flex-grow">
                    <h3 className="text-2xl font-bold text-foreground group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {service.description}
                    </p>

                    {/* Features List */}
                    <div className={`grid gap-3 pt-6 ${
                      index === 0 || index === 3 ? "grid-cols-2" : "grid-cols-1"
                    }`}>
                      {service.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="feature-item flex items-center gap-2 text-sm font-medium text-muted-foreground"
                        >
                          <div
                            className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.gradient}`}
                          />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Learn More Button */}
                  <div className="pt-8 mt-auto">
                    <button className="group/btn flex items-center gap-2 text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 font-semibold transition-colors duration-200">
                      Learn More
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
};

export default Services;
