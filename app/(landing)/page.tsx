import Hero from "@/components/landing/hero";
import About from "@/components/landing/about";
import Services from "@/components/landing/features";
import Footer from "@/components/landing/footer";
import dynamic from "next/dynamic";
import type { Metadata } from "next";

const Pricing = dynamic(() => import("@/components/landing/pricing"));
const Testimonials = dynamic(() => import("@/components/landing/testimonials"));
const Contact = dynamic(() => import("@/components/landing/contact"));

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.NODE_ENV === "development"
      ? "http://localhost:3001"
      : "https://localhost:3000");

  // Enforce HTTPS in production
  const normalizedBaseUrl =
    process.env.NODE_ENV === "production"
      ? baseUrl?.startsWith("https://")
        ? baseUrl
        : `https://${baseUrl?.replace(/^https?:\/\//, "")}`
      : baseUrl;

  const canonicalUrl = normalizedBaseUrl;

  return {
    title: "SnackStack - AI-Powered Notes & Blog Management",
    description:
      "Transform your development workflow with SnackStack. AI-powered note-taking, blog management, and cutting-edge SaaS platform built with Next.js 15, React 19, and TypeScript.",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: "SnackStack - AI-Powered Notes & Blog Management",
      description:
        "Transform your development workflow with SnackStack. AI-powered note-taking, blog management, and cutting-edge SaaS platform.",
      url: canonicalUrl,
      siteName: "SnackStack",
      type: "website",
      locale: "en_US",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "SnackStack - AI-Powered Notes",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "SnackStack - AI-Powered Notes & Blog Management",
      description:
        "Transform your development workflow with SnackStack. AI-powered note-taking and blog management platform.",
      images: ["/og-image.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

export default function Page() {
  // JSON-LD Structured Data for WebPage
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.NODE_ENV === "development"
      ? "http://localhost:3001"
      : "https://localhost:3000");

  const normalizedBaseUrl =
    process.env.NODE_ENV === "production"
      ? baseUrl?.startsWith("https://")
        ? baseUrl
        : `https://${baseUrl?.replace(/^https?:\/\//, "")}`
      : baseUrl;

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "SnackStack - AI-Powered Notes & Blog Management",
    description:
      "Transform your development workflow with SnackStack. AI-powered note-taking, blog management, and cutting-edge SaaS platform.",
    url: normalizedBaseUrl,
    mainEntity: {
      "@type": "SoftwareApplication",
      name: "SnackStack",
      applicationCategory: "ProductivityApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      <div
        className="relative z-10 bg-background"
        style={{ backgroundColor: "var(--background)" }}
      >
        <Hero />
        <About />
        <Services />
        <Pricing />
        <Testimonials />
        <Contact />
      </div>
      <Footer />
    </>
  );
}
