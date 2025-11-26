import "./globals.css";
import type { Metadata } from "next";

// ======================
//  FONTS
// ======================
import { Inter, Space_Grotesk, Geist_Mono } from "next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ======================
//  PROVIDERS
// ======================
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { QueryProvider } from "@/providers/query-provider";
import { PostHogProvider } from "@/providers/posthog-provider";
import { LenisProvider } from "@/providers/lenis-provider";
import { NotificationContainer } from "@/components/ui/notification";
import { RedirectHandler } from "@/components/auth/redirect-handler";
import ErrorBoundary from "@/components/auth/error-boundary";

// ======================
//  METADATA
// ======================
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
    "developer tools",
  ],
  authors: [{ name: "SnackStack Team" }],
  creator: "SnackStack",
  publisher: "SnackStack",
  openGraph: {
    title: "SnackStack - Modern Development Solutions",
    description:
      "Transform your development workflow with SnackStack. Build faster, scale better, and deliver exceptional digital experiences.",
    siteName: "SnackStack",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SnackStack - Modern Development Solutions",
    description:
      "Transform your development workflow with SnackStack. Build faster, scale better, and deliver exceptional digital experiences.",
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

// ======================
//  LAYOUT
// ======================
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${geistMono.variable}`}
    >
      <body className="antialiased" suppressHydrationWarning>
        <LenisProvider>
          <ErrorBoundary>
            <SessionProvider>
              <PostHogProvider>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                  <QueryProvider>
                    <RedirectHandler>
                      {children}
                      <NotificationContainer />
                    </RedirectHandler>
                  </QueryProvider>
                </ThemeProvider>
              </PostHogProvider>
            </SessionProvider>
          </ErrorBoundary>
        </LenisProvider>
      </body>
    </html>
  );
}
