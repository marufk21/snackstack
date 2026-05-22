"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import ThemeToggleButton from "@/components/ui/theme-toggle-button";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  {
    label: "About",
    href: "#about",
  },
  {
    label: "Services",
    href: "#services",
  },
  {
    label: "Pricing",
    href: "#pricing",
  },
  {
    label: "Contact",
    href: "#contact",
  },
  {
    label: "Blogs",
    href: "/blogs",
  },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const pathname = usePathname();
  const { data: session } = useSession();

  // Show navbar only on landing pages (home and /blogs)
  const shouldShowNavbar =
    pathname === "/" ||
    pathname === "/blogs" ||
    pathname?.startsWith("/blogs/");
  const isInAppRoutes = !shouldShowNavbar;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer for scroll-active section highlighting
  useEffect(() => {
    if (pathname !== "/") return;

    const sections = ["about", "services", "pricing", "contact"];
    const handleObserver = () => {
      const scrollPosition = window.scrollY + 180; // Offset navbar height
      
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(`#${section}`);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleObserver);
    return () => window.removeEventListener("scroll", handleObserver);
  }, [pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".navbar")) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    // Only handle smooth scroll for anchor links
    if (href.startsWith("#")) {
      e.preventDefault();

      // If we're not on the home page, navigate to home with the anchor
      if (pathname !== "/") {
        window.location.href = `/${href}`;
        return;
      }

      const element = document.querySelector(href);
      if (element) {
        const navbarHeight = 90; // Balanced navbar offset height
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - navbarHeight;

        // Use Lenis for smooth scrolling if active
        const lenis = (window as any).lenis;
        if (lenis) {
          lenis.scrollTo(offsetPosition, {
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        } else {
          // Fallback to native scrollTo if Lenis is not available
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }
    }
    setIsOpen(false);
  };

  const NavItemComponent = ({ item }: { item: NavItem }) => {
    const isActive = activeSection === item.href || pathname === item.href;
    
    return (
      <Link
        href={item.href}
        className={cn(
          "relative text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-full transition-all duration-300 group cursor-pointer select-none",
          isActive
            ? "text-gray-900 dark:text-white font-bold"
            : "text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        )}
        onClick={(e) => handleNavClick(e, item.href)}
      >
        <span className="relative z-10 flex items-center gap-1">{item.label}</span>
        
        {/* Elastic sliding pill backing */}
        <span className="absolute inset-0 rounded-full bg-gray-100 dark:bg-white/5 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 -z-0" />
        
        {isActive && (
          <motion.span 
            layoutId="activeNavbarIndicator"
            className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-cyan-600 to-emerald-500 rounded-full"
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
          />
        )}
      </Link>
    );
  };

  const MobileNavItemComponent = ({ item }: { item: NavItem }) => {
    const isActive = activeSection === item.href || pathname === item.href;

    const icons: Record<string, React.ReactNode> = {
      About: <span className="text-base">💡</span>,
      Services: <span className="text-base">⚡</span>,
      Pricing: <span className="text-base">💎</span>,
      Contact: <span className="text-base">💬</span>,
      Blogs: <span className="text-base">📝</span>,
    };

    return (
      <motion.div variants={{
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0 }
      }}>
        <Link
          href={item.href}
          className={cn(
            "flex items-center gap-3 px-5 py-3.5 rounded-2xl text-base font-semibold transition-all duration-300",
            isActive
              ? "bg-gradient-to-r from-cyan-500/15 to-emerald-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 shadow-[0_2px_10px_rgba(6,182,198,0.08)]"
              : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-50/80 dark:hover:bg-white/5 border border-transparent"
          )}
          onClick={(e) => handleNavClick(e, item.href)}
        >
          <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center">
            {icons[item.label]}
          </span>
          <span className="flex-1">{item.label}</span>
          {isActive && (
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0" />
          )}
        </Link>
      </motion.div>
    );
  };

  if (!shouldShowNavbar) {
    return null;
  }

  return (
    <>
      <div className="w-full overflow-hidden">
        <div
          className={cn(
            "navbar fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out lg:mt-2.5",
            scrolled ? "mx-2 my-2 lg:mx-6 lg:my-3" : "my-3 lg:my-0"
          )}
        >
          <div
            className={cn(
              "w-full mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-500 ease-in-out",
              scrolled
                ? "max-w-6xl py-2 bg-white/80 dark:bg-zinc-950/70 backdrop-blur-2xl rounded-2xl border border-gray-200/50 dark:border-white/10 shadow-lg dark:shadow-2xl shadow-black/5"
                : "max-w-8xl rounded-2xl border-none bg-transparent"
            )}
          >
            <div
              className={cn(
                "flex items-center justify-between transition-all duration-500 ease-in-out",
                scrolled ? "h-13 px-2 sm:px-4" : "h-16 md:h-18 lg:h-20 px-4"
              )}
            >
              {/* BRAND LOGO */}
              <Link href="/" className="flex items-center gap-3 flex-shrink-0">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 sm:gap-2.5"
                >
                  <div className="relative">
                    <div
                      className={cn(
                        "relative transition-all duration-500 ease-in-out flex items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-500/20 dark:border-white/5",
                        scrolled ? "w-8.5 h-8.5 p-1.5" : "w-10 h-10 p-2"
                      )}
                    >
                      <Image
                        src="/logo.svg"
                        alt="SnackStack Logo"
                        width={scrolled ? 22 : 26}
                        height={scrolled ? 22 : 26}
                        className="object-contain dark:brightness-110"
                      />
                    </div>
                  </div>
                  <div>
                    <span
                      className={cn(
                        "font-black tracking-tight text-gray-900 dark:text-white transition-all duration-500 ease-in-out",
                        scrolled ? "text-lg" : "text-xl sm:text-2xl"
                      )}
                    >
                      Snack<span className="bg-gradient-to-r from-cyan-600 via-emerald-500 to-teal-600 bg-clip-text text-transparent">Stack</span>
                    </span>
                  </div>
                </motion.div>
              </Link>

              {/* DESKTOP NAVIGATION LINKS */}
              {!isInAppRoutes && (
                <div
                  className={cn(
                    "hidden lg:flex items-center justify-center flex-1 transition-all duration-500 ease-in-out",
                    scrolled ? "gap-1" : "gap-2"
                  )}
                >
                  {navItems.map((item) => (
                    <NavItemComponent key={item.href} item={item} />
                  ))}
                </div>
              )}

              {/* RIGHT SIDE ACTIONS */}
              <div
                className={cn(
                  "flex items-center transition-all duration-500 ease-in-out",
                  scrolled ? "gap-2.5" : "gap-4"
                )}
              >
                {/* Theme Toggle Button */}
                <ThemeToggleButton />

                {/* Authentication Dynamic Buttons */}
                {!session ? (
                  <Link href="/sign-in">
                    <button
                      className={cn(
                        "group relative hidden lg:flex items-center gap-1.5 bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-600 text-white rounded-full font-bold shadow-[0_4px_15px_rgba(6,182,198,0.15)] hover:shadow-[0_4px_20px_rgba(6,182,198,0.35)] transition-all duration-500 hover:-translate-y-0.5 overflow-hidden cursor-pointer select-none",
                        scrolled ? "px-5 py-2 text-xs" : "px-6 py-2.5 text-sm"
                      )}
                    >
                      <span className="relative z-10 flex items-center gap-1">
                        Sign In
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </button>
                  </Link>
                ) : (
                  <Link href="/app" className="flex items-center gap-2.5">
                    <button
                      className={cn(
                        "group relative hidden lg:flex items-center gap-1 bg-gray-50 dark:bg-zinc-900/60 border border-gray-200/60 dark:border-white/10 text-gray-800 dark:text-gray-200 rounded-full font-bold shadow-sm transition-all duration-300 hover:-translate-y-0.5 cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-zinc-800/80",
                        scrolled ? "px-4 py-1.5 text-xs" : "px-5 py-2 text-sm"
                      )}
                    >
                      <span>Dashboard</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <Avatar className="w-8.5 h-8.5 cursor-pointer ring-2 ring-cyan-500/20 hover:ring-cyan-500 transition-all duration-350">
                      <AvatarImage src={session.user?.image || undefined} />
                      <AvatarFallback className="bg-cyan-500/10 text-cyan-600 font-black">
                        {session.user?.name?.charAt(0)?.toUpperCase() || (
                          <User className="w-4 h-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                )}

                {/* MOBILE MENU TOGGLER */}
                <div className="flex items-center lg:hidden">
                  <button
                    className={cn(
                      "relative rounded-full p-2.5 transition-all duration-300 cursor-pointer overflow-hidden",
                      isOpen
                        ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30"
                        : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white bg-gray-50 hover:bg-gray-100 dark:bg-zinc-900/60 dark:hover:bg-zinc-800 border border-gray-200/50 dark:border-white/5"
                    )}
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                  >
                    {isOpen ? <X size={18} /> : <Menu size={18} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* MOBILE DRAWER WINDOW */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "lg:hidden overflow-hidden backdrop-blur-2xl mt-2 rounded-3xl transition-all duration-500 ease-in-out",
                  "bg-white/90 dark:bg-zinc-950/95",
                  "border border-gray-200/50 dark:border-white/10",
                  "shadow-[0_20px_50px_-12px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.4)]"
                )}
              >
                {/* Subtle gradient accent at top */}
                <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

                <motion.div
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.05 }
                    }
                  }}
                  initial="hidden"
                  animate="visible"
                  className="px-4 sm:px-6 py-6 space-y-5"
                >
                  {/* Navigation links */}
                  <div className="space-y-1">
                    {!isInAppRoutes &&
                      navItems.map((item) => (
                        <MobileNavItemComponent key={item.href} item={item} />
                      ))}
                  </div>

                  {/* Bottom actions area */}
                  <div className="pt-5 border-t border-gray-200/60 dark:border-white/10 space-y-3">
                    {!session ? (
                      <>
                        <Link href="/sign-in" className="w-full block">
                          <button className="w-full py-3.5 bg-gradient-to-r from-cyan-600 via-emerald-500 to-teal-600 text-white rounded-2xl font-bold shadow-[0_4px_20px_rgba(6,182,198,0.3)] hover:shadow-[0_4px_25px_rgba(6,182,198,0.5)] transition-all duration-300 active:scale-[0.98] cursor-pointer select-none text-sm tracking-wide">
                            Sign In
                            <ArrowRight className="w-4 h-4 inline ml-1.5 -mt-0.5" />
                          </button>
                        </Link>
                        <p className="text-center text-[11px] text-muted-foreground">
                          New here?{" "}
                          <Link href="/sign-in" className="text-cyan-600 dark:text-cyan-400 font-semibold hover:underline">
                            Start for free →
                          </Link>
                        </p>
                      </>
                    ) : (
                      <Link href="/app" className="w-full block">
                        <button className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 active:scale-[0.98] cursor-pointer select-none text-sm tracking-wide">
                          My Notes Dashboard
                          <ChevronRight className="w-4 h-4 inline ml-1.5 -mt-0.5" />
                        </button>
                      </Link>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default Navbar;
