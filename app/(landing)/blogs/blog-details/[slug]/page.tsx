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

      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/blogs"
            className="inline-flex items-center mb-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Blogs
          </Link>

          {/* Article Content */}
          <article className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden p-8 md:p-12">
            <BlogContentView blog={blog} />

            {/* Next/Previous navigation */}
            <div className="mt-12 border-t border-border pt-8 flex justify-between gap-4">
              {prevBlog ? (
                <Link
                  href={`/blogs/blog-details/${generateSlug(prevBlog.title)}-${prevBlog.id}`}
                  className="group inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors max-w-[45%]"
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  <span className="truncate">Previous: {prevBlog.title}</span>
                </Link>
              ) : (
                <div></div>
              )}

              {nextBlog && (
                <Link
                  href={`/blogs/blog-details/${generateSlug(nextBlog.title)}-${nextBlog.id}`}
                  className="group inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors max-w-[45%] ml-auto"
                >
                  <span className="truncate">Next: {nextBlog.title}</span>
                  <ArrowRightIcon className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
