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
    label: "Product",
    href: "/app", // Main dashboard/notes app
  },
  {
    label: "Pricing",
    href: "/app/pricing", // Pricing page
  },
  {
    label: "Teams",
    href: "/app/new", // Create new note (collaborate)
  },
  {
    label: "Resources",
    href: "/app", // Notes library/resources
  },
  {
    label: "Community",
    href: "/", // Landing page/community
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
        className="block px-6 py-4 text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 border-b border-border last:border-b-0 text-base font-medium"
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
      <nav
        className={cn(
          "navbar fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled ? "" : ""
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">S</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                </div>
                <div className="hidden sm:block">
                  <span className="text-foreground font-bold text-xl">
                    SnackStack
                  </span>
                  <div className="text-xs text-muted-foreground">
                    Modern Solutions
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            {!isInAppRoutes && (
              <div className="hidden lg:flex items-center gap-1">
                {navItems.map((item) => (
                  <NavItem key={item.href} item={item} />
                ))}
              </div>
            )}

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <div className="hidden sm:block items-center gap-2">
                <ThemeToggleButton />
              </div>

              {/* Authentication Buttons */}
              <SignedOut>
                <SignInButton>
                  <Button className="hidden sm:flex bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl">
                    Sign In
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>

              {/* Mobile Menu Button */}
              <div className="sm:hidden">
                <ThemeToggleButton />
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg p-2"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  {isOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </Button>
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
              className="lg:hidden overflow-hidden bg-gradient-to-r from-background/98 via-background/95 to-background/98 backdrop-blur-xl border-t border-border"
            >
              <div className="px-4 py-6 space-y-2">
                {!isInAppRoutes &&
                  navItems.map((item) => (
                    <MobileNavItem key={item.href} item={item} />
                  ))}

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
      </nav>

      {/* Spacer to prevent content from being hidden behind fixed navbar */}
      <div className="h-16 lg:h-20" />
    </>
  );
}
