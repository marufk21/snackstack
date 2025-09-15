import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - SnackStack",
  description: "Your personal dashboard with notes and productivity tools",
};

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-background">{children}</div>;
}
