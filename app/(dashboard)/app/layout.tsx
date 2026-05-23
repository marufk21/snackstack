import React from "react";
import type { Metadata } from "next";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { DashboardBackground } from "@/components/dashboard/dashboard-background";
import { DashboardHeaderTitle } from "@/components/dashboard/dashboard-header-title";

export const metadata: Metadata = {
  title: "Notes - SnackStack",
  description: "AI-powered note editor with markdown support",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
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
        <header className="sticky top-0 flex h-14 md:h-16 shrink-0 items-center gap-2 border-b border-cyan-200/30 dark:border-white/[0.06] bg-white/80 dark:bg-background/80 backdrop-blur-xl px-3 md:px-4 z-50 transition-all duration-300 shadow-md shadow-cyan-500/10">
          <SidebarTrigger aria-label="Toggle sidebar" />
          <div className="flex items-center gap-2">
            <DashboardHeaderTitle />
          </div>
        </header>

        {/* Content Area with relative positioning */}
        <div className="relative flex-1 p-3 md:p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
