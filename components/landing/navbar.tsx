"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import ThemeToggleButton from "@/components/ui/theme-toggle-button";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    label: "How Its Works",
    href: "/app",
  },
  {
    label: "Pricing",
    href: "/app/pricing",
  },
  {
    label: "Blogs",
    href: "/app",
  },
  {
    label: "Contact Us",
    href: "/app/new",
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { theme } = useTheme();
  const pathname = usePathname();

  // Hide navigation items when in app routes
  const isInAppRoutes = pathname?.startsWith("/app");

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".navbar")) {
        setIsOpen(false);
        setActiveDropdown(null);
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

  const NavItem = ({ item }: { item: NavItem }) => {
    return (
      <Link
        href={item.href}
        className="relative text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm font-medium px-4 py-2 rounded-lg hover:bg-accent group"
        onClick={() => {
          setIsOpen(false);
          setActiveDropdown(null);
        }}
      >
        {item.label}
        <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </Link>
    );
  };

  const MobileNavItem = ({ item }: { item: NavItem }) => {
    return (
      <Link
        href={item.href}
        className="block px-6 py-4 text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 border-b border-border last:border-b-0 text-base font-medium sm:text-lg"
        onClick={() => {
          setIsOpen(false);
          setActiveDropdown(null);
        }}
      >
        {item.label}
      </Link>
    );
  };

  return (
    <>
      <div className="w-full overflow-hidden">
        <div
          className={cn(
            "navbar fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out lg:mt-2.5",
            scrolled ? "lg:mx-6 lg:my-3" : "my-3 lg:my-0"
          )}
        >
          <div
            className={cn(
              "w-full mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-600 ease-in-out",
              scrolled
                ? "max-w-6xl py-2 bg-gray-100/10 dark:bg-gray-800/40 backdrop-blur-[50px] lg:rounded-full border border-gray-200/30 dark:border-gray-700/80 shadow-2xl "
                : "max-w-screen rounded-3xl border-none"
            )}
          >
            <div
              className={cn(
                "flex items-center justify-between transition-all duration-500 ease-in-out",
                scrolled ? "h-14 px-4" : "h-16 md:h-18 lg:h-20 px-4"
              )}
            >
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3 flex-shrink-0">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3"
                >
                  <div className="relative">
                    <div
                      className={cn(
                        "bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 ease-in-out",
                        scrolled ? "w-8 h-8" : "w-10 h-10"
                      )}
                    >
                      <span
                        className={cn(
                          "text-white font-bold transition-all duration-500 ease-in-out",
                          scrolled ? "text-lg" : "text-xl"
                        )}
                      >
                        S
                      </span>
                    </div>
                  </div>
                  <div className="block sm:block">
                    <span
                      className={cn(
                        "text-foreground font-bold transition-all duration-500 ease-in-out",
                        scrolled ? "text-lg" : "text-xl"
                      )}
                    >
                      SnackStack
                    </span>
                    {/* <div className="text-xs text-muted-foreground hidden sm:block">
                      Modern Solutions
                    </div> */}
                  </div>
                </motion.div>
              </Link>

              {/* Desktop Navigation */}
              {!isInAppRoutes && (
                <div
                  className={cn(
                    "hidden lg:flex items-center justify-center flex-1 transition-all duration-500 ease-in-out",
                    scrolled ? "gap-2" : "gap-3"
                  )}
                >
                  {navItems.map((item) => (
                    <NavItem key={item.href} item={item} />
                  ))}
                </div>
              )}

              {/* Right side actions */}
              <div
                className={cn(
                  "flex items-center transition-all duration-500 ease-in-out",
                  scrolled ? "gap-2" : "gap-3"
                )}
              >
                {/* Theme Toggle */}
                <div className="flex items-center gap-2">
                  <ThemeToggleButton />
                </div>

                {/* Authentication Buttons */}
                <SignedOut>
                  <SignInButton>
                    <Button
                      className={cn(
                        "hidden lg:flex bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-500 ease-in-out shadow-lg hover:shadow-xl",
                        scrolled ? "px-3 py-1.5 text-sm" : "px-4 py-2 text-sm"
                      )}
                    >
                      Sign In
                    </Button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>

                {/* Mobile Menu Button */}
                <div className="flex items-center gap-2 lg:hidden">
                  <button
                    className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg p-2 mb-0.5"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    {isOpen ? <X size={22} /> : <Menu size={22} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={cn(
                  "lg:hidden overflow-hidden backdrop-blur-sm border-t transition-all duration-500 ease-in-out",
                  scrolled
                    ? "bg-gray-100/30 dark:bg-gray-800/40 backdrop-blur-[50px] border-gray-200/30 dark:border-gray-700/30 mx-0.5 lg:mx-8 rounded-b-lg"
                    : "bg-gradient-to-r from-background/98 via-background/95 to-background/98 border-border"
                )}
              >
                <div className="px-4 sm:px-6 py-6 space-y-2">
                  <div className="">
                    {!isInAppRoutes &&
                      navItems.map((item) => (
                        <MobileNavItem key={item.href} item={item} />
                      ))}
                  </div>

                  {/* Mobile Actions */}
                  <div className="pt-6">
                    <SignedOut>
                      <div className="space-y-2">
                        <SignInButton>
                          <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200">
                            Sign In
                          </Button>
                        </SignInButton>
                      </div>
                    </SignedOut>
                    <SignedIn>
                      <div className="space-y-2">
                        <Link href="/app">
                          <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200">
                            My Notes
                          </Button>
                        </Link>
                      </div>
                    </SignedIn>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Spacer to prevent content from being hidden behind fixed navbar */}
      <div className="h-16 md:h-18 lg:h-20" />
    </>
  );
}
