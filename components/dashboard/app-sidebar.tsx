"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  CreditCard,
  CheckCircle,
  LogOut,
  User,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import ThemeToggleButton from "@/components/ui/theme-toggle-button";

const navigationItems = [
  {
    title: "My Notes",
    url: "/app",
    icon: Home,
  },
  {
    title: "My Subscription",
    url: "/app/subscription",
    icon: CheckCircle,
  },
  {
    title: "Pricing",
    url: "/app/pricing",
    icon: CreditCard,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { toggleSidebar } = useSidebar();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <Sidebar
      collapsible="icon"
      style={
        {
          "--sidebar-width": "14rem",
          "--sidebar-width-icon": "3rem",
        } as React.CSSProperties
      }
      className="border-r border-cyan-200/40 dark:border-white/[0.06] bg-white/70 dark:bg-black/40 backdrop-blur-2xl shadow-2xl shadow-cyan-500/[0.03] dark:shadow-black/20"
    >
      {/* Logo Header */}
      <SidebarHeader className="border-b border-cyan-200/30 dark:border-white/[0.05] h-14 md:h-16 flex items-center">
        <div className="flex items-center gap-4 px-2 overflow-hidden w-full group-data-[collapsible=icon]:justify-center">
          <div className="relative flex items-center justify-center w-8 h-8 shrink-0 mt-2">
            <Image
              src="/logo.svg"
              alt="SnackStack Logo"
              width={32}
              height={32}
              className="w-full h-full"
              priority
            />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden transition-all duration-300 ease-in-out opacity-100 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:w-0">
            <span className="text-zinc-900 dark:text-white font-bold text-lg whitespace-nowrap">
              SnackStack
            </span>
            <span className="text-xs text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
              AI Notes
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-zinc-500 dark:text-zinc-600">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive =
                  pathname === item.url ||
                  (item.url !== "/app" && pathname?.startsWith(item.url));

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={`relative overflow-hidden transition-all duration-200 group-data-[collapsible=icon]:!p-2 ${
                        isActive
                          ? "bg-cyan-100 dark:bg-white/5 text-cyan-700 dark:text-white hover:bg-cyan-100 dark:hover:bg-white/5 hover:text-cyan-700 dark:hover:text-white"
                          : "hover:bg-cyan-50 dark:hover:bg-white/5 hover:text-cyan-600 dark:hover:text-white"
                      }`}
                    >
                      <Link
                        href={item.url}
                        className="flex items-center gap-3 w-full"
                      >
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-gradient-to-b from-cyan-600 to-blue-600 rounded-r-full shadow-[0_0_8px_rgba(6,182,198,0.4)]" />
                        )}
                        <item.icon
                          className={`w-5 h-5 transition-colors ${
                            isActive
                              ? "text-cyan-600 dark:text-white"
                              : "text-zinc-500 dark:text-zinc-400 group-hover:text-cyan-600 dark:group-hover:text-white"
                          }`}
                        />
                        <span
                          className={`transition-colors ${
                            isActive ? "font-medium" : ""
                          }`}
                        >
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="bg-cyan-200/30 dark:bg-white/[0.05]" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-zinc-500 dark:text-zinc-600">
            Settings
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <div className="flex items-center justify-between px-2 py-2 group-data-[collapsible=icon]:justify-center rounded-md transition-colors text-zinc-600 dark:text-zinc-400">
                  <span className="text-sm group-data-[collapsible=icon]:hidden">
                    Theme
                  </span>
                  <ThemeToggleButton />
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-cyan-200/30 dark:border-white/[0.05] mt-auto">
        <div className="p-2 space-y-2">
          {!session ? (
            <Link
              href="/sign-in"
              className="group-data-[collapsible=icon]:hidden"
            >
              <Button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white">
                Sign In
              </Button>
            </Link>
          ) : (
            <div className="flex items-center justify-between gap-2 group-data-[collapsible=icon]:justify-center">
              <div className="flex items-center gap-2 flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                <Avatar className="w-8 h-8 border border-white/10">
                  <AvatarImage src={session.user?.image || undefined} />
                  <AvatarFallback className="bg-zinc-800 text-zinc-400">
                    {session.user?.name?.charAt(0)?.toUpperCase() || (
                      <User className="w-4 h-4" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-sm font-medium truncate text-zinc-900 dark:text-zinc-200">
                    {session.user?.name || "Account"}
                  </span>
                  <span className="text-xs text-zinc-600 dark:text-zinc-400 truncate">
                    {session.user?.email}
                  </span>
                </div>
              </div>

              {/* Collapsed View User Icon */}
              <div className="hidden group-data-[collapsible=icon]:flex items-center justify-center w-full">
                <Avatar className="w-8 h-8 border border-white/10">
                  <AvatarImage src={session.user?.image || undefined} />
                  <AvatarFallback className="bg-zinc-800 text-zinc-400">
                    {session.user?.name?.charAt(0)?.toUpperCase() || (
                      <User className="w-4 h-4" />
                    )}
                  </AvatarFallback>
                </Avatar>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                className="shrink-0 group-data-[collapsible=icon]:hidden text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5"
                title="Sign Out"
                aria-label="Sign out of your account"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
