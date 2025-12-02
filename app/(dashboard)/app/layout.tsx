import React from "react";
import type { Metadata } from "next";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { DashboardBackground } from "@/components/dashboard/dashboard-background";

export const metadata: Metadata = {
  title: "Notes - SnackStack",
  description: "AI-powered note editor with markdown support",
};

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "14rem",
          "--sidebar-width-icon": "3rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        {/* Animated Background - applies to all dashboard routes */}
        <DashboardBackground />

        {/* Enhanced Header */}
        <header className="sticky top-0 flex h-14 md:h-16 shrink-0 items-center gap-2 border-b border-purple-300/40 dark:border-white/5 bg-white/80 dark:bg-background/80 backdrop-blur-xl px-3 md:px-4 z-50 transition-all duration-300 shadow-md shadow-purple-500/10">
          <SidebarTrigger aria-label="Toggle sidebar" />
          <div className="flex items-center gap-2">
            <h1 className="text-base md:text-lg font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Dashboard
            </h1>
          </div>
        </header>

        {/* Content Area with relative positioning */}
        <div className="relative flex-1 p-3 md:p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
