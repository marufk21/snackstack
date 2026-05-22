"use client";

import React from "react";

export function DashboardBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Large animated gradient orbs with enhanced colors */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-cyan-600/30 dark:bg-cyan-500/20 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute top-1/4 right-1/4 w-[450px] h-[450px] bg-blue-600/30 dark:bg-blue-500/20 rounded-full blur-3xl animate-float-medium" />
      <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-emerald-600/30 dark:bg-emerald-500/20 rounded-full blur-3xl animate-float-fast" />
      
      {/* Additional medium orbs for depth */}
      <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-teal-600/25 dark:bg-teal-500/15 rounded-full blur-3xl animate-float-medium" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-1/3 right-1/3 w-72 h-72 bg-cyan-600/25 dark:bg-cyan-500/15 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: '1s' }} />
      
      {/* Accent orbs for richness */}
      <div className="absolute top-3/4 right-1/2 w-64 h-64 bg-cyan-600/20 dark:bg-cyan-500/12 rounded-full blur-2xl animate-float-fast" style={{ animationDelay: '3s' }} />
      <div className="absolute top-1/3 left-2/3 w-56 h-56 bg-emerald-600/20 dark:bg-emerald-500/12 rounded-full blur-2xl animate-float-medium" style={{ animationDelay: '1.5s' }} />
      <div className="absolute bottom-1/2 right-2/3 w-48 h-48 bg-emerald-600/18 dark:bg-emerald-500/10 rounded-full blur-xl animate-float-slow" style={{ animationDelay: '2.5s' }} />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 dark:opacity-10" />
      
      {/* Enhanced radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-background/50 to-background/90" />
      
      {/* Smooth gradient fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/70 to-background" />
    </div>
  );
}
