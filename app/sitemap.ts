import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.NODE_ENV === "development"
      ? "http://localhost:3001"
      : "https://localhost:3000");

  // Ensure baseUrl is properly formatted
  const normalizedBaseUrl = baseUrl?.startsWith("http")
    ? baseUrl
    : `https://${baseUrl || "localhost:3000"}`;

  // Static routes
  return [
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
}

/**
 * Sitemap SEO Configuration Notes
 *
 * Dynamic Website (with DB):
 * 1. Dynamic Sitemap: sitemap.ts now generates dynamic URLs from database
 * 2. Robots.txt: Automatically served at /robots.txt
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
 * For production:
 * - Ensure NEXT_PUBLIC_APP_URL is set correctly
 * - Submit sitemap to Google Search Console
 * - Monitor indexing status regularly
 * - SECURITY: Only public notes (isPublic: true) are included in sitemap
 * - SECURITY: Dashboard routes are excluded from sitemap and robots.txt
 */
