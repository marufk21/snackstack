import React from "react";
import type { Metadata } from "next";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";

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
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 flex h-14 md:h-16 shrink-0 items-center gap-2 border-b bg-background px-3 md:px-4 z-10">
          <SidebarTrigger aria-label="Toggle sidebar" />
          <div className="flex items-center gap-2">
            <h1 className="text-base md:text-lg font-semibold">Dashboard</h1>
          </div>
        </header>
        <div className="flex-1 p-3 md:p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
