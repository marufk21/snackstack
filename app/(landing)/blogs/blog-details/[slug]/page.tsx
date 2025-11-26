import Link from "next/link";
import { getBlogs } from "@/lib/appwrite/services";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import BlogContentView from "@/components/landing/blog-content-view";
import { Blog } from "@/lib/appwrite/config";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

// Disable static generation for this page
export const dynamic = "force-dynamic";

// Generate metadata for SEO with canonical URLs and structured data
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
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

  // Helper function to generate slug
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .substring(0, 50) || "untitled";
  };

  // Extract blog ID from slug parameter
  const slugParam = resolvedParams.slug;
  const blogId = slugParam.includes('-')
    ? slugParam.split('-').pop() || slugParam
    : slugParam;

  try {
    const blogs = await getBlogs();
    const blog = blogs.find((b) => b.id === blogId);

    if (!blog) {
      return {
        title: "Blog Not Found | SnackStack",
        description: "The requested blog post could not be found.",
      };
    }

    const blogSlug = generateSlug(blog.title);
    const canonicalUrl = `${normalizedBaseUrl}/blogs/blog-details/${blogSlug}-${blog.id}`;

    return {
      title: `${blog.title} | SnackStack Blog`,
      description: blog.excerpt,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: blog.title,
        description: blog.excerpt,
        url: canonicalUrl,
        siteName: "SnackStack",
        type: "article",
        publishedTime: blog.date,
        authors: [blog.author],
        images: blog.coverImage
          ? [
            {
              url: blog.coverImage,
              alt: blog.title,
            },
          ]
          : undefined,
        locale: "en_US",
      },
      twitter: {
        card: "summary_large_image",
        title: blog.title,
        description: blog.excerpt,
        images: blog.coverImage ? [blog.coverImage] : undefined,
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
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Blog | SnackStack",
      description: "Read our latest blog posts and insights.",
    };
  }
}

export default async function BlogDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;

  // Extract blog ID from slug parameter
  // Slug format: "blog-title-slug-{id}" or just "{id}" for backward compatibility
  const slugParam = resolvedParams.slug;
  const blogId = slugParam.includes('-')
    ? slugParam.split('-').pop() || slugParam  // Get last part after last dash (the ID)
    : slugParam;  // Use as-is if no dashes (backward compatibility)

  let blog: Blog | null = null;
  let nextBlog: Blog | null = null;
  let prevBlog: Blog | null = null;

  try {
    const blogs = await getBlogs();
    const blogData = blogs.find((b) => b.id === blogId);

    if (blogData) {
      // Find next and previous blogs
      const currentIndex = blogs.findIndex((b) => b.id === blogData.id);

      // Set next blog (if not the last blog)
      if (currentIndex < blogs.length - 1) {
        nextBlog = blogs[currentIndex + 1];
      }

      // Set previous blog (if not the first blog)
      if (currentIndex > 0) {
        prevBlog = blogs[currentIndex - 1];
      }

      blog = blogData;
    }
  } catch (error) {
    console.error("Error loading blog:", error);
  }

  if (!blog) {
    notFound();
  }

  // Generate JSON-LD structured data for SEO
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
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .substring(0, 50) || "untitled";
  };

  const blogSlug = generateSlug(blog.title);
  const canonicalUrl = `${normalizedBaseUrl}/blogs/blog-details/${blogSlug}-${blog.id}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.excerpt,
    image: blog.coverImage,
    datePublished: blog.date,
    author: {
      "@type": "Person",
      name: blog.author,
    },
    publisher: {
      "@type": "Organization",
      name: "SnackStack",
      logo: {
        "@type": "ImageObject",
        url: `${normalizedBaseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Back Button */}
          <Link
            href="/blogs"
            className="group inline-flex items-center mb-8 px-4 py-2 rounded-full bg-white/50 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/10 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/80 dark:hover:bg-black/40 transition-all hover:scale-105 shadow-sm"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Blogs
          </Link>

          {/* Article Content */}
          <article className="bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden p-8 md:p-12 relative">
            {/* Decorative top gradient */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-50" />

            <BlogContentView blog={blog} />

            {/* Next/Previous navigation */}
            <div className="mt-16 border-t border-gray-200/50 dark:border-gray-800/50 pt-10 flex flex-col sm:flex-row justify-between gap-6">
              {prevBlog ? (
                <Link
                  href={`/blogs/blog-details/${generateSlug(prevBlog.title)}-${prevBlog.id}`}
                  className="group flex flex-col gap-2 p-4 rounded-xl hover:bg-white/50 dark:hover:bg-white/5 transition-all border border-transparent hover:border-white/10 max-w-full sm:max-w-[45%]"
                >
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <ArrowLeftIcon className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
                    Previous Article
                  </span>
                  <span className="text-sm sm:text-base font-semibold text-foreground line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {prevBlog.title}
                  </span>
                </Link>
              ) : (
                <div className="hidden sm:block"></div>
              )}

              {nextBlog && (
                <Link
                  href={`/blogs/blog-details/${generateSlug(nextBlog.title)}-${nextBlog.id}`}
                  className="group flex flex-col gap-2 p-4 rounded-xl hover:bg-white/50 dark:hover:bg-white/5 transition-all border border-transparent hover:border-white/10 max-w-full sm:max-w-[45%] text-right items-end"
                >
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    Next Article
                    <ArrowRightIcon className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="text-sm sm:text-base font-semibold text-foreground line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {nextBlog.title}
                  </span>
                </Link>
              )}
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
