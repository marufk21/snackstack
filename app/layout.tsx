import "lenis/dist/lenis.css";
import "./globals.css";
import type { Metadata, Viewport } from "next";

// ======================
//  FONTS
// ======================
import { Inter, Space_Grotesk, Geist_Mono } from "next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// ======================
//  PROVIDERS
// ======================
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { QueryProvider } from "@/providers/query-provider";
import { PostHogProvider } from "@/providers/posthog-provider";
import { LenisProvider } from "@/providers/lenis-provider";
import { FramerProvider } from "@/providers/framer-provider";
import { NotificationContainer } from "@/components/ui/notification";
import { RedirectHandler } from "@/components/auth/redirect-handler";
import ErrorBoundary from "@/components/auth/error-boundary";

// ======================
//  SITE CONFIGURATION
// ======================
const siteConfig = {
  name: "SnackStack",
  title: "SnackStack - AI-Powered Notes",
  description:
    "Transform your development workflow with SnackStack. AI-powered note-taking, blog management, and cutting-edge SaaS platform built with Next.js 15, React 19, and TypeScript.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "/og-image.png",
  keywords: [
    "AI-powered notes",
    "web development",
    "full-stack development",
    "SaaS platform",
    "React",
    "Next.js 15",
    "TypeScript",
    "modern development",
    "scalable solutions",
    "developer tools",
    "blog management",
    "note-taking app",
  ],
  authors: [{ name: "SnackStack Team", url: "https://github.com/marufk21" }],
  creator: "SnackStack",
  publisher: "SnackStack",
  twitter: {
    handle: "@snackstack",
    site: "@snackstack",
    cardType: "summary_large_image" as const,
  },
};

// ======================
//  VIEWPORT
// ======================
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

// ======================
//  METADATA
// ======================
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  publisher: siteConfig.publisher,

  // Manifest
  manifest: "/manifest.json",

  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },

  // Twitter
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    creator: siteConfig.twitter.handle,
    site: siteConfig.twitter.site,
    images: [siteConfig.ogImage],
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Verification
  verification: {
    google: "Ysm8E85NBMbEc6pCcFY5rAo5Rywetd3NSzEe5PDZiE0",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },

  // Category
  category: "technology",

  // Alternate Languages (if you support multiple languages)
  alternates: {
    canonical: siteConfig.url,
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
  // JSON-LD Structured Data for Organization and WebSite
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.svg`,
    description: siteConfig.description,
    sameAs: [
      "https://github.com/marufk21",
      // Add other social media profiles here
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      url: `${siteConfig.url}/#contact`,
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/blogs?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${geistMono.variable}`}
    >
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://cloud.appwrite.io" />
        <link rel="dns-prefetch" href="https://js.stripe.com" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body
        className="antialiased bg-background"
        suppressHydrationWarning
        style={{ backgroundColor: "var(--background)" }}
      >
        <LenisProvider>
          <ErrorBoundary>
            <SessionProvider>
              <PostHogProvider>
                <FramerProvider>
                  <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                  >
                    <QueryProvider>
                      <RedirectHandler>
                        {children}
                        <NotificationContainer />
                      </RedirectHandler>
                    </QueryProvider>
                  </ThemeProvider>
                </FramerProvider>
              </PostHogProvider>
            </SessionProvider>
          </ErrorBoundary>
        </LenisProvider>
      </body>
    </html>
  );
}
