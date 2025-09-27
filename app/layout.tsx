import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { QueryProvider } from "@/providers/query-provider";
import { PostHogProvider } from "@/providers/posthog-provider";
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
  title: "SnackStack - Modern Development Solutions",
  description:
    "Transform your development workflow with SnackStack. Build faster, scale better, and deliver exceptional digital experiences with our cutting-edge platform.",
  keywords: [
    "web development",
    "full-stack development", 
    "React",
    "Next.js",
    "TypeScript",
    "modern development",
    "scalable solutions",
    "developer tools"
  ],
  authors: [{ name: "SnackStack Team" }],
  creator: "SnackStack",
  publisher: "SnackStack",
  openGraph: {
    title: "SnackStack - Modern Development Solutions",
    description: "Transform your development workflow with SnackStack. Build faster, scale better, and deliver exceptional digital experiences.",
    siteName: "SnackStack",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SnackStack - Modern Development Solutions",
    description: "Transform your development workflow with SnackStack. Build faster, scale better, and deliver exceptional digital experiences.",
    creator: "@snackstack",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
            signInFallbackRedirectUrl="/app"
            signUpFallbackRedirectUrl="/app"
            publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
            dynamic
          >
            <PostHogProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
              >
                <QueryProvider>
                  <RedirectHandler>
                    {children}
                    <NotificationContainer />
                  </RedirectHandler>
                </QueryProvider>
              </ThemeProvider>
            </PostHogProvider>
          </ClerkProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}