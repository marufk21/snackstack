"use client";

import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="border-t border-border" style={{
        background: `
        radial-gradient(
          circle at center,
          rgba(168, 85, 247, 0.12) 0%,
          rgba(168, 85, 247, 0.06) 20%,
          rgba(0, 0, 0, 0.0) 60%
        )
      `,
      }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="relative w-16 h-8 opacity-80">
              <Image
                src="/logo.svg"
                alt="SnackStack Logo"
                fill
                className="object-contain"
              />
            </div>
            <span>
              © {currentYear} SnackStack. All rights reserved.
            </span>
          </div>
          <nav className="flex gap-4">
            <div className="hover:text-foreground transition-colors">Terms</div>
            <div className="hover:text-foreground transition-colors">
              Policies
            </div>
            <Link
              href="/sitemap.xml"
              className="hover:text-foreground transition-colors"
            >
              Sitemaps
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
