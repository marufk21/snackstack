"use client";

import React, { useRef } from "react";
import { Star, Quote } from "lucide-react";
import Image from "next/image";
import { useGSAP } from "@/hooks/use-gsap";
import gsap from "gsap";
import PageWrapper from "./page-wrapper";

const Testimonials = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const testimonials = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Product Manager",
      company: "TechCorp",
      avatar:
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      content:
        "SnackStack has completely transformed how I capture and organize my thoughts. The AI suggestions help me express ideas more clearly and find connections I would have otherwise missed. It's like having a thinking partner!",
      rating: 5,
      featured: false,
    },
    {
      id: 2,
      name: "Marcus Rodriguez",
      role: "Research Scientist",
      company: "InnovateLabs",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      content:
        "As someone who takes thousands of notes, SnackStack's AI-powered organization has saved me countless hours. The automatic tagging and relationship mapping features are game-changers for research work.",
      rating: 5,
      featured: false,
    },
    {
      id: 3,
      name: "Emily Johnson",
      role: "Content Creator",
      company: "CreativeStudio",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      content:
        "The collaborative features are outstanding. My team and I use SnackStack to brainstorm ideas, and the AI suggestions often spark new creative directions we hadn't considered. It's become essential to our workflow.",
      rating: 5,
      featured: false,
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

    // Testimonial cards animation
    if (cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll(".testimonial-card");

      cards.forEach((card, index) => {
        // Card entrance
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

        // Horizontal parallax effect
        gsap.to(card, {
          x: (index % 2 === 0 ? -10 : 10),
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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating
          ? "text-yellow-400 fill-yellow-400 dark:text-yellow-500 dark:fill-yellow-500"
          : "text-gray-300 dark:text-gray-600"
          }`}
      />
    ));
  };

  return (
    <PageWrapper ref={sectionRef} id="testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
            <Quote className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            <span className="text-violet-600 dark:text-violet-400 text-sm font-medium">
              Testimonials
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 tracking-tight">
            What Our{" "}
            <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent">
              Users Say
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
            Don't just take our word for it. See how SnackStack is helping
            individuals and teams capture and enhance their ideas.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="testimonial-card group relative"
            >
              <div className="bg-white/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 rounded-3xl p-8 h-full hover:shadow-2xl transition-all duration-500 hover:border-violet-500/30 hover:-translate-y-2 relative overflow-hidden backdrop-blur-sm flex flex-col">
                {/* Background Gradient Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Quote Icon */}
                <div className="absolute top-6 right-6 text-violet-500/10 group-hover:text-violet-500/20 transition-colors duration-300">
                  <Quote className="w-10 h-10" />
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-6 relative z-10">
                  {renderStars(testimonial.rating)}
                </div>

                {/* Testimonial Content */}
                <div className="relative z-10 flex flex-col flex-grow">
                  <blockquote className="text-foreground leading-relaxed text-lg font-medium mb-8 flex-grow">
                    "{testimonial.content}"
                  </blockquote>

                  {/* Author Info */}
                  <div className="flex items-center gap-4 pt-6 border-t border-gray-200/50 dark:border-white/10 mt-auto">
                    <div className="relative">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        width={56}
                        height={56}
                        className="rounded-full object-cover ring-2 ring-violet-500/20 group-hover:ring-violet-500/40 transition-all duration-300"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                    </div>
                    <div>
                      <div className="font-bold text-foreground text-lg">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">
                        {testimonial.role}
                      </div>
                      <div className="text-xs text-violet-600 dark:text-violet-400 font-bold uppercase tracking-wider mt-1">
                        {testimonial.company}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Featured Badge */}
                {testimonial.featured && (
                  <div className="absolute top-0 right-0 bg-gradient-to-bl from-violet-600 to-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-bl-2xl rounded-tr-2xl shadow-lg">
                    Featured
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
};

export default Testimonials;
