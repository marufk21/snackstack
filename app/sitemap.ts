import type { MetadataRoute } from "next";
import { getBlogs } from "@/lib/appwrite/services";

// Helper function to generate SEO-friendly slug from title
function generateSlug(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .substring(0, 50) || "untitled"
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.NODE_ENV === "development"
      ? "http://localhost:3001"
      : "https://localhost:3000");

  // SECURITY: Enforce HTTPS in production for SEO best practices
  const normalizedBaseUrl =
    process.env.NODE_ENV === "production"
      ? baseUrl?.startsWith("https://")
        ? baseUrl
        : `https://${baseUrl?.replace(/^https?:\/\//, "") || "localhost:3000"}`
      : baseUrl?.startsWith("http")
      ? baseUrl
      : `http://${baseUrl || "localhost:3001"}`;

  // Fetch all blogs for dynamic sitemap generation
  let blogs: Awaited<ReturnType<typeof getBlogs>> = [];
  try {
    blogs = await getBlogs();
  } catch (error) {
    console.error("Error fetching blogs for sitemap:", error);
    // Continue with static routes even if blog fetching fails
  }

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    // Landing page
    {
      url: normalizedBaseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    // About page
    {
      url: `${normalizedBaseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // Blogs listing page
    {
      url: `${normalizedBaseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    // Authentication pages
    {
      url: `${normalizedBaseUrl}/sign-in`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${normalizedBaseUrl}/sign-up`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  // Dynamic blog routes with SEO-friendly slugs
  const blogRoutes: MetadataRoute.Sitemap = blogs.map((blog) => {
    const slug = generateSlug(blog.title);
    return {
      url: `${normalizedBaseUrl}/blogs/blog-details/${slug}-${blog.id}`,
      lastModified: blog.date ? new Date(blog.date) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    };
  });

  return [...staticRoutes, ...blogRoutes];
}

/**
 * Sitemap SEO Configuration Notes
 *
 * Dynamic Website (with DB):
 * 1. Dynamic Sitemap: sitemap.ts generates dynamic URLs from Appwrite database
 * 2. Blog Pages: All published blogs are automatically included
 * 3. Robots.txt: Automatically served at /robots.txt
 *
 * Static Site (without DB):
 * 1. Alternative: Use xml-sitemaps.com for static site generation
 * 2. Place files in public folder:
 *    - /public/sitemap.xml
 *    - /public/robots.txt (optional, but recommended)
 *
 * Example robots.txt:
 * ```
 * User-agent: *
 * Allow: /
 * Sitemap: https://example.com/sitemap.xml
 * ```
 *
 * SEO Best Practices Implemented:
 * - HTTPS Enforcement: All production URLs use HTTPS protocol
 * - Canonical URLs: Proper canonical tags on all blog pages
 * - Priority Levels: Landing (1.0), Blogs (0.9), Blog Details (0.7)
 * - Change Frequency: Optimized for each page type
 * - Last Modified: Uses actual blog publication dates
 *
 * For production:
 * - Ensure NEXT_PUBLIC_APP_URL is set correctly with HTTPS
 * - Submit sitemap to Google Search Console
 * - Monitor indexing status regularly
 * - SECURITY: Only public content is included in sitemap
 * - SECURITY: Dashboard routes (/app/*) are excluded from sitemap and robots.txt
 * - SECURITY: API routes are excluded from indexing
 */
