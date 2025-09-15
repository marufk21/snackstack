import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notes - SnackStack",
  description: "AI-powered note editor with markdown support",
};

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-background">{children}</div>;
}
