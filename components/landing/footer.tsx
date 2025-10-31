"use client";

import React from "react";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <span>
            © {currentYear} SnackStack. All rights reserved.
          </span>
          <nav className="flex gap-4">
            <div className="hover:text-foreground transition-colors">Terms</div>
            <div className="hover:text-foreground transition-colors">
              Policy
            </div>
            <Link
              href="/sitemap.xml"
              className="hover:text-foreground transition-colors"
            >
              Sitemap
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
