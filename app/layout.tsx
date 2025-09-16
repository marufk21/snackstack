import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { QueryProvider } from "@/providers/query-provider";
import { NotificationContainer } from "@/components/ui/notification";
import { RedirectHandler } from "@/components/auth/redirect-handler";
import ErrorBoundary from "@/components/auth/error-boundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SnackStack - Modern Web App Starter",
  description:
    "A production-ready Next.js starter template with authentication, database integration, state management, and beautiful UI components.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>{/* Add your meta tags, title, etc. here */}</head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ErrorBoundary>
          <ClerkProvider
            appearance={{
              elements: {
                formButtonPrimary:
                  "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700",
              },
            }}
            afterSignInUrl="/app"
            afterSignUpUrl="/app"
            publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
            dynamic
          >
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <QueryProvider>
                <RedirectHandler>
                  {children}
                  <NotificationContainer />
                </RedirectHandler>
              </QueryProvider>
            </ThemeProvider>
          </ClerkProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
