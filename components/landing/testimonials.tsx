"use client";

import React, { useRef } from "react";
import { Star, Quote, CheckCircle2, Linkedin, Twitter, MessageCircle } from "lucide-react";
import Image from "next/image";
import { useGSAP } from "@/hooks/use-gsap";
import gsap from "gsap";
import PageWrapper from "./page-wrapper";
import { cn } from "@/lib/utils";

type Testimonial = {
  id: string;
  name: string;
  handle?: string;
  role?: string;
  company?: string;
  avatar: string;
  content: React.ReactNode;
  date: string;
  platform: "twitter" | "linkedin" | "producthunt" | "direct";
  verified?: boolean;
  rating?: number;
  size?: "normal" | "large";
  highlight?: boolean;
};

const Testimonials = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const testimonials: Testimonial[] = [
    {
      id: "t1",
      name: "Sarah Chen",
      handle: "@sarahchen_pm",
      role: "Product Manager",
      company: "TechCorp",
      avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      content: "Just started using SnackStack for my daily standup notes and it's honestly a game changer. The AI suggestions are actually useful?? 🤯 Like it connects dots I didn't even see.",
      date: "2h ago",
      platform: "twitter",
      verified: true,
      rating: 5,
    },
    {
      id: "t2",
      name: "Marcus Rodriguez",
      role: "Research Scientist",
      company: "InnovateLabs",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
      content: "As someone who deals with massive amounts of unstructured data, the relationship mapping in SnackStack is impressive. It's replaced three other tools in my workflow.",
      date: "Nov 12",
      platform: "linkedin",
      verified: true,
      rating: 5,
    },
    {
      id: "t3",
      name: "Alex Rivera",
      handle: "@arivera_dev",
      company: "CreativeStudio",

      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      content: (
        <>
          Finally found a note-taking app that doesn't feel like a chore. <span className="text-violet-600 dark:text-violet-400 font-medium">#SnackStack</span> is clean, fast, and the dark mode is 🤌
        </>
      ),
      date: "5h ago",
      platform: "twitter",
      verified: false,
      size: "large",
      rating: 4,
    },
    {
      id: "t4",
      name: "Emily Johnson",
      role: "Content Creator",
      company: "CreativeStudio",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
      content: "The collaborative features are outstanding. My team and I use SnackStack to brainstorm ideas, and the AI suggestions often spark new creative directions we hadn't considered. It's become essential to our workflow.",
      date: "Yesterday",
      platform: "direct",
      rating: 5,
    },
    {
      id: "t5",
      name: "David Park",
      handle: "@dpark_design",
      company: "TechCorp",

      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      content: "The UI details in SnackStack are top tier. Smooth animations, zero lag. It just feels good to use.",
      date: "Nov 18",
      platform: "twitter",
      verified: true,
      size: "large",
      rating: 5,
    },
    {
      id: "t6",
      name: "Lisa Wang",
      role: "Founder",
      company: "StartUp Inc",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      content: "I've tried Notion, Obsidian, Evernote... SnackStack is the first one that actually helps me THINK better, not just store text.",
      date: "1d ago",
      platform: "producthunt",
      verified: true,
      rating: 5,
    },
  ];

  useGSAP(() => {
    // Header animation
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

    // Testimonial cards animation
    if (cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll(".testimonial-card");

      gsap.fromTo(
        cards,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 85%",
          },
        }
      );
    }
  }, []);

  const PlatformIcon = ({ platform }: { platform: Testimonial["platform"] }) => {
    switch (platform) {
      case "twitter":
        return <Twitter className="w-4 h-4 text-[#1DA1F2] fill-current" />;
      case "linkedin":
        return <Linkedin className="w-4 h-4 text-[#0A66C2] fill-current" />;
      case "producthunt":
        return <span className="text-[#DA552F] font-bold text-xs">P</span>;
      default:
        return <Quote className="w-4 h-4 text-violet-500" />;
    }
  };

  return (
    <PageWrapper ref={sectionRef} id="testimonials" className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 mb-6 backdrop-blur-sm">
            <MessageCircle className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            <span className="text-violet-600 dark:text-violet-400 text-sm font-medium">
              Testimonials
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
            Loved by{" "}
            <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent">
              builders & thinkers
            </span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Join thousands of users who have transformed their workflow with SnackStack.
            Real stories from real people.
          </p>
        </div>

        {/* Grid Layout (Fixed Heights) */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="testimonial-card h-full"
            >
              <div className={cn(
                "group relative bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col",
                testimonial.highlight && "dark:bg-violet-900/10 border-violet-500/20 dark:border-violet-500/20"
              )}>
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        width={44}
                        height={44}
                        className="rounded-full object-cover ring-2 ring-white dark:ring-zinc-800"
                      />
                      {testimonial.platform === "twitter" && (
                        <div className="absolute -bottom-1 -right-1 bg-black dark:bg-white rounded-full p-0.5 border-2 border-white dark:border-zinc-900">
                          <Twitter className="w-2.5 h-2.5 text-white dark:text-black fill-current" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-foreground text-sm">
                          {testimonial.name}
                        </span>
                        {testimonial.verified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500/10" />
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {testimonial.handle || testimonial.role}
                      </div>
                    </div>
                  </div>
                  <div className="text-muted-foreground/50 group-hover:text-violet-500 transition-colors">
                    <PlatformIcon platform={testimonial.platform} />
                  </div>
                </div>

                {/* Content */}
                <div className="mb-4 flex-grow">
                  {testimonial.rating && (
                    <div className="flex gap-0.5 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-3.5 h-3.5",
                            i < testimonial.rating!
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-zinc-200 dark:text-zinc-700"
                          )}
                        />
                      ))}
                    </div>
                  )}
                  <p className={cn(
                    "text-foreground/90 leading-relaxed",
                    testimonial.size === "large" ? "text-lg font-medium" : "text-base"
                  )}>
                    {testimonial.content}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800/50 mt-auto">
                  <span className="text-xs text-muted-foreground font-medium">
                    {testimonial.date}
                  </span>
                  {testimonial.company && (
                    <span className="text-xs font-semibold text-foreground/70 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-full">
                      {testimonial.company}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
};

export default Testimonials;

