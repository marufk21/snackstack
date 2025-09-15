"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2, StickyNote, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Props {
  params: Promise<{ userId: string }>;
}

export default function UserDashboard({ params }: Props) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [resolvedParams, setResolvedParams] = React.useState<{
    userId: string;
  } | null>(null);

  // Resolve params Promise
  React.useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  useEffect(() => {
    if (isLoaded && user && resolvedParams) {
      // Verify the userId in URL matches the authenticated user
      if (user.id !== resolvedParams.userId) {
        router.replace(`/${user.id}`);
      }
    }
  }, [isLoaded, user, resolvedParams, router]);

  if (!isLoaded || !resolvedParams) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (!user || user.id !== resolvedParams.userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground">
            You don't have access to this dashboard.
          </p>
        </div>
      </div>
    );
  }

  const firstName = user.firstName || "User";
  const displayName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.firstName || user.username || "User";

  return (
    <div className="min-h-screen bg-background">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {firstName}! 👋
          </h1>
          <p className="text-purple-100">
            Ready to capture your thoughts and ideas?
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/notes")}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <StickyNote className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">My Notes</h3>
                <p className="text-sm text-muted-foreground">
                  View and manage your notes
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Card>

          <Card
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/notes/new")}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Plus className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">New Note</h3>
                <p className="text-sm text-muted-foreground">
                  Create a new note
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <StickyNote className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Quick Stats</h3>
                <p className="text-sm text-muted-foreground">
                  View your writing progress
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Getting Started */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              <span>
                Create your first note to get started with AI-powered writing
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              <span>Use markdown formatting for rich text editing</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              <span>Try AI suggestions to improve and expand your writing</span>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <Button onClick={() => router.push("/notes/new")}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Note
            </Button>
            <Button variant="outline" onClick={() => router.push("/notes")}>
              Browse Notes
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
