"use client";

import React, { useRef } from "react";
import { useGSAP } from "@/hooks/use-gsap";
import gsap from "gsap";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import PageWrapper from "./page-wrapper";

const testimonials = [
  {
    quote:
      "Just started using SnackStack for my daily standup notes and it's honestly a game changer. The AI suggestions actually connect dots I didn't even see.",
    name: "Sarah Chen",
    title: "Product Manager, TechCorp",
    avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&auto=format&fit=crop&w=240&q=80",
  },
  {
    quote:
      "As someone who deals with massive amounts of unstructured data, the relationship mapping in SnackStack is impressive. It's replaced three other tools in my workflow.",
    name: "Marcus Rodriguez",
    title: "Research Scientist, InnovateLabs",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=240&q=80",
  },
  {
    quote:
      "Finally found a note-taking app that doesn't feel like a chore. SnackStack is clean, fast, and the dark mode is absolutely stunning.",
    name: "Alex Rivera",
    title: "Senior Developer, CreativeStudio",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=240&q=80",
  },
  {
    quote:
      "The collaborative features are outstanding. My team uses SnackStack to brainstorm, and the AI suggestions spark new creative directions constantly.",
    name: "Emily Johnson",
    title: "Content Creator, CreativeStudio",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=240&q=80",
  },
  {
    quote:
      "The UI details are top tier. Smooth animations, zero lag, thoughtful micro-interactions. It just feels good to use every day.",
    name: "David Park",
    title: "Design Lead, TechCorp",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=240&q=80",
  },
  {
    quote:
      "I've tried Notion, Obsidian, Evernote — SnackStack is the first one that actually helps me think better, not just store text.",
    name: "Lisa Wang",
    title: "Founder, StartUp Inc",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=240&q=80",
  },
  {
    quote:
      "A must-have tool for any professional. The auto-tagging and smart search alone have saved us countless hours across the entire team.",
    name: "James Kim",
    title: "Engineering Manager, ScaleUp",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=240&q=80",
  },
  {
    quote:
      "The AI-powered suggestions are remarkably accurate. It's like having a brilliant research assistant who knows exactly what context I need.",
    name: "Rachel O'Brien",
    title: "Data Scientist, InsightAI",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=240&q=80",
  },
];

const Testimonials = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 80%",
          },
        }
      );
    }
  }, []);

  return (
    <PageWrapper ref={sectionRef} id="testimonials" className="!px-0 py-16 sm:py-24 md:py-28">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-6 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
            <span className="text-cyan-600 dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider">
              Testimonials
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-3 sm:mb-6 tracking-tight">
            Loved by{" "}
            <span className="bg-gradient-to-r from-cyan-600 via-emerald-500 to-teal-600 bg-clip-text text-transparent">
              builders & thinkers
            </span>
          </h2>
          <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed">
            Join thousands of users who have transformed their workflow with
            SnackStack. Real stories from real people.
          </p>
        </div>
      </div>

      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="normal"
        pauseOnHover={true}
      />
    </PageWrapper>
  );
};

export default Testimonials;
