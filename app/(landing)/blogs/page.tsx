import { getBlogs } from "@/lib/appwrite/services";
import { Blog } from "@/lib/appwrite/config";
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

  return (
    <section className="relative py-12 md:py-20 min-h-screen overflow-hidden" style={{
      background: `
        radial-gradient(
          circle at center,
          rgba(168, 85, 247, 0.12) 0%,
          rgba(168, 85, 247, 0.06) 20%,
          rgba(0, 0, 0, 0.0) 60%
        )
      `,
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6 backdrop-blur-sm mt-6">
            <span className="text-purple-600 dark:text-purple-400 text-sm font-medium ">
              Blogs
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 tracking-tight">
            Latest{" "}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
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
  );
}
