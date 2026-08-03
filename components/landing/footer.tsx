"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Linkedin, ArrowUp, Instagram, Youtube, Facebook } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const TiktokIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

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
      gsap.fromTo(
        textElementRef.current,
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
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
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
        const offsetPosition =
          elementPosition + window.pageYOffset - navbarHeight;

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 md:pt-14 pb-4 sm:pb-6 md:pb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 lg:gap-10 mb-4 sm:mb-8 md:mb-12">
            <div className="col-span-2 md:col-span-2 text-center md:text-left">
              <Link
                href="/"
                className="flex items-center gap-2 mb-6 group justify-center md:justify-start"
              >
                <div className="relative w-8 h-8 transition-transform group-hover:scale-110 duration-300">
                  <Image
                    src="/logo.svg"
                    alt="SnackStack Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                  SnackStack
                </span>
              </Link>
              <p className="text-muted-foreground max-w-sm leading-relaxed text-base mx-auto md:mx-0">
                AI-powered note-taking for modern teams. Capture, organize, and
                enhance your ideas with the power of artificial intelligence.
              </p>

              <div className="flex flex-wrap gap-3 mt-8 justify-center md:justify-start">
                {[
                  { icon: Instagram, label: "Instagram" },
                  { icon: TiktokIcon, label: "TikTok" },
                  { icon: Youtube, label: "YouTube" },
                  { icon: Facebook, label: "Facebook" },
                  { icon: XIcon, label: "X" },
                  { icon: Linkedin, label: "LinkedIn" },
                ].map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="flex items-center justify-center w-10 h-10 rounded-xl border border-white/10 text-muted-foreground hover:text-white hover:border-white/20 hover:bg-white/5 transition-all duration-300 cursor-default"
                    title={`Follow SnackStack on ${label}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="sr-only">{label}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="text-center md:text-left">
              <h4 className="font-semibold text-foreground mb-6">Product</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                {["About", "Pricing", "Testimonials", "Blog"].map((item) => (
                  <li key={item}>
                    <Link
                      href={
                        item === "Blog" ? "/blogs" : `#${item.toLowerCase()}`
                      }
                      onClick={(e) =>
                        handleLinkClick(
                          e,
                          item === "Blog" ? "/blogs" : `#${item.toLowerCase()}`
                        )
                      }
                      className="hover:text-cyan-600 transition-colors relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-px after:bg-cyan-600 after:transition-all hover:after:w-full"
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
                {[
                  "Terms of Service",
                  "Privacy Policy",
                  "Contact",
                  "Sitemap",
                ].map((item) => {
                  const isPlaceholder =
                    item === "Privacy Policy" || item === "Terms of Service";
                  const href =
                    item === "Sitemap"
                      ? "/sitemap.xml"
                      : item === "Contact"
                      ? "#contact"
                      : "#";
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
                        className="hover:text-cyan-600 transition-colors relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-px after:bg-cyan-600 after:transition-all hover:after:w-full"
                      >
                        {item}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 text-sm text-muted-foreground pt-5 sm:pt-8 border-t border-white/10">
            <div className="flex items-center gap-4">
              <p>© {currentYear} SnackStack. All rights reserved.</p>
            </div>

            <div className="flex items-center gap-8">
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
        style={{ height: bigTextHeight * 0.7 }}
        className="relative z-10 w-full pointer-events-none"
      />

      {/*
        Big Text Feature
        Fixed at the bottom, z-index -10.
        Revealed when the user scrolls past the opaque Links section into the transparent Spacer.
      */}
      <div
        ref={bigTextRef}
        className="fixed bottom-0 left-0 w-full -z-10 bg-background backdrop-blur-sm border-t border-border/50"
      >
        <div className="w-full h-full flex justify-center items-end px-4 sm:px-6 md:px-8 pt-10 sm:pt-16 md:pt-24 pb-3 sm:pb-4 md:pb-6">
          <div
            ref={textElementRef}
            className="text-[14vw] sm:text-[15vw] md:text-[12vw] font-black leading-[0.75] tracking-[-0.05em] text-transparent bg-clip-text bg-gradient-to-b from-cyan-500/40 via-teal-500/20 to-transparent select-none pointer-events-none"
          >
            SNACKSTACK
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
