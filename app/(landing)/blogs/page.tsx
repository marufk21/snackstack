import { getBlogs } from "@/server/integrations/appwrite/services";
import { Blog } from "@/server/integrations/appwrite/config";
import Blogs from "@/components/landing/blog-showcase";
import { Metadata } from "next";

export const revalidate = 3600; // Revalidate every hour

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.NODE_ENV === "development"
      ? "http://localhost:3001"
      : "https://localhost:3000");

  // SECURITY: Enforce HTTPS in production
  const normalizedBaseUrl =
    process.env.NODE_ENV === "production"
      ? baseUrl?.startsWith("https://")
        ? baseUrl
        : `https://${baseUrl?.replace(/^https?:\/\//, "")}`
      : baseUrl;

  const canonicalUrl = `${normalizedBaseUrl}/blogs`;

  return {
    title: "Blog - Latest Insights & Updates | SnackStack",
    description:
      "Discover expert insights, innovative strategies, and the latest trends to help you stay ahead in your journey. Read our latest blog posts.",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: "Blog - Latest Insights & Updates | SnackStack",
      description:
        "Discover expert insights, innovative strategies, and the latest trends to help you stay ahead in your journey.",
      url: canonicalUrl,
      siteName: "SnackStack",
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: "Blog - Latest Insights & Updates | SnackStack",
      description:
        "Discover expert insights, innovative strategies, and the latest trends to help you stay ahead in your journey.",
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

export default async function BlogsPage() {
  let blogs: Blog[] = [];

  try {
    blogs = await getBlogs();
  } catch (error) {
    console.error("Failed to load blogs:", error);
    // Continue with empty array to allow build to succeed
    blogs = [];
  }

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

  // Helper function to generate slug
  const generateSlug = (title: string): string => {
    return (
      title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .substring(0, 50) || "untitled"
    );
  };

  // BreadcrumbList structured data
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: normalizedBaseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${normalizedBaseUrl}/blogs`,
      },
    ],
  };

  // ItemList structured data for blog listing
  const publishedBlogs = blogs.filter((blog) => blog.status === "published");
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: publishedBlogs.map((blog, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${normalizedBaseUrl}/blogs/blog-details/${generateSlug(blog.title)}-${blog.id}`,
      name: blog.title,
    })),
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <section className="relative pt-24 pb-12 md:py-20 min-h-screen overflow-hidden" style={{
      background: `
        radial-gradient(
          circle at center,
          rgba(6, 182, 198, 0.12) 0%,
          rgba(6, 182, 198, 0.06) 20%,
          rgba(0, 0, 0, 0.0) 60%
        )
      `,
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-6 backdrop-blur-sm mt-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
            <span className="text-cyan-600 dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider">
              Blogs
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 tracking-tight">
            Latest{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Insights & Updates
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover expert insights, innovative strategies, and the latest
            trends to help you stay ahead in your journey.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="mt-8">
          <Blogs blogs={blogs.filter((blog) => blog.status === "published")} />
        </div>
      </div>
    </section>
    </>
  );
}
