"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Twitter, Github, Linkedin, ArrowUp } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const bigTextRef = useRef<HTMLDivElement>(null);
  const textElementRef = useRef<HTMLHeadingElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const [bigTextHeight, setBigTextHeight] = useState(0);

  // Measure the height of the fixed Big Text container to set the spacer height
  useEffect(() => {
    if (!bigTextRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setBigTextHeight(entry.contentRect.height);
      }
    });
    resizeObserver.observe(bigTextRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // GSAP Animation for the Big Text
  useEffect(() => {
    if (!spacerRef.current || !textElementRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(textElementRef.current,
        { y: "50%", opacity: 0.2, scale: 0.8 },
        {
          y: "0%",
          opacity: 1,
          scale: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: spacerRef.current,
            start: "top bottom", // When top of spacer hits bottom of viewport
            end: "bottom bottom", // When bottom of spacer hits bottom of viewport
            scrub: 1,
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();

      if (pathname !== "/") {
        window.location.href = `/${href}`;
        return;
      }

      const element = document.querySelector(href);
      if (element) {
        const navbarHeight = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

        const lenis = (window as any).lenis;
        if (lenis) {
          lenis.scrollTo(offsetPosition, {
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        } else {
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }
    }
  };

  const scrollToTop = () => {
    const lenis = (window as any).lenis;
    if (lenis) {
      lenis.scrollTo(0, {
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* 
        Links & Content Section 
        This part scrolls normally with the page content.
        bg-background ensures it covers the fixed text behind it.
      */}
      <div className="relative z-10 bg-background border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 lg:pt-16 pb-6 md:pb-8 lg:pb-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 lg:gap-10 mb-6 md:mb-12 lg:mb-16">
            <div className="col-span-2 md:col-span-2 text-center md:text-left">
              <Link href="/" className="flex items-center gap-2 mb-6 group justify-center md:justify-start">
                <div className="relative w-8 h-8 transition-transform group-hover:scale-110 duration-300">
                  <Image
                    src="/logo.svg"
                    alt="SnackStack Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  SnackStack
                </span>
              </Link>
              <p className="text-muted-foreground max-w-sm leading-relaxed text-base mx-auto md:mx-0">
                AI-powered note-taking for modern teams. Capture, organize, and enhance your ideas with the power of artificial intelligence.
              </p>
            </div>

            <div className="text-center md:text-left">
              <h4 className="font-semibold text-foreground mb-6">Product</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                {['Features', 'Pricing', 'Testimonials', 'Blog'].map((item) => (
                  <li key={item}>
                    <Link
                      href={item === 'Blog' ? '/blogs' : `#${item.toLowerCase()}`}
                      onClick={(e) => handleLinkClick(e, item === 'Blog' ? '/blogs' : `#${item.toLowerCase()}`)}
                      className="hover:text-violet-600 transition-colors relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-px after:bg-violet-600 after:transition-all hover:after:w-full"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center md:text-left">
              <h4 className="font-semibold text-foreground mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                {['About Us', 'Contact', 'Privacy Policy', 'Terms of Service'].map((item) => {
                  const isPlaceholder = item === 'Privacy Policy' || item === 'Terms of Service';
                  const href = item === 'About Us' ? '#about' : item === 'Contact' ? '#contact' : '#';
                  return (
                    <li key={item}>
                      <Link
                        href={href}
                        onClick={(e) => {
                          if (isPlaceholder) {
                            e.preventDefault();
                          } else {
                            handleLinkClick(e, href);
                          }
                        }}
                        className="hover:text-violet-600 transition-colors relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-px after:bg-violet-600 after:transition-all hover:after:w-full"
                      >
                        {item}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 text-sm text-muted-foreground pt-8 border-t border-white/10">
            <div className="flex items-center gap-4">
              <p>© {currentYear} SnackStack. All rights reserved.</p>
              <span className="hidden sm:inline text-muted-foreground/30">|</span>
              <Link href="/sitemap.xml" className="hover:text-violet-600 transition-colors">
                Sitemap
              </Link>
            </div>

            <div className="flex items-center gap-8">
              <div className="flex gap-4">
                {[
                  { icon: Twitter, label: 'Twitter' },
                  { icon: Github, label: 'GitHub' },
                  { icon: Linkedin, label: 'LinkedIn' }
                ].map(({ icon: Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="text-muted-foreground hover:text-violet-600 transition-all p-2 hover:bg-violet-500/10 rounded-full hover:scale-110"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="sr-only">{label}</span>
                  </a>
                ))}
              </div>

              <button
                onClick={scrollToTop}
                className="flex items-center gap-2 hover:text-foreground transition-colors group px-4 py-2 rounded-full hover:bg-white/5"
              >
                Back to top
                <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 
        Spacer Div 
        This creates the "window" for the fixed text to be revealed.
        It is transparent and sits after the links content.
      */}
      <div
        ref={spacerRef}
        style={{ height: bigTextHeight }}
        className="relative z-10 w-full pointer-events-none"
      />

      {/* 
        Big Text Feature 
        Fixed at the bottom, z-index -10.
        Revealed when the user scrolls past the opaque Links section into the transparent Spacer.
      */}
      <div
        ref={bigTextRef}
        className="fixed bottom-0 left-0 w-full -z-10 bg-black/5 dark:bg-white/5 backdrop-blur-lg border-t border-white/5"
      >
        {/* Background Glow for the Big Text area */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl">
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
          </div>
        </div>

        <div className="w-full h-full flex justify-center items-end pt-8 md:pt-12 lg:pt-20 pb-4 md:pb-6 lg:pb-10">
          <h1
            ref={textElementRef}
            className="text-[16vw] font-black leading-[0.75] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-foreground/10 to-foreground/0 select-none pointer-events-none translate-y-2 md:translate-y-4"
          >
            SNACKSTACK
          </h1>
        </div>
      </div>
    </>
  );
};

export default Footer;
