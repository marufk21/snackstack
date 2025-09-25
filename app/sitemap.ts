import type { MetadataRoute } from "next";
import { db } from "@/lib/database";

// Force nodejs runtime for database operations
export const runtime = "nodejs";

// Cache for sitemap generation (in production, consider using Redis)
let sitemapCache: {
  data: MetadataRoute.Sitemap;
  timestamp: number;
} | null = null;

const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

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

  // Check cache in production
  if (process.env.NODE_ENV === "production" && sitemapCache) {
    const isExpired = Date.now() - sitemapCache.timestamp > CACHE_DURATION;
    if (!isExpired) {
      return sitemapCache.data;
    }
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
    // Dashboard pages
    {
      url: `${normalizedBaseUrl}/app`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${normalizedBaseUrl}/app/new`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${normalizedBaseUrl}/app/pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${normalizedBaseUrl}/app/subscription`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${normalizedBaseUrl}/app/subscription/success`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Dynamic routes from database
  let dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    // Safety check for database availability
    if (!db) {
      console.warn("Database client not available, using static routes only");
      return staticRoutes;
    }

    // Fetch notes with better performance considerations
    const notes = await db.note.findMany({
      select: {
        slug: true,
        updatedAt: true,
        createdAt: true,
        title: true, // for better priority calculation
      },
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
      // Limit to prevent sitemap from becoming too large
      take: 5000, // Google recommends max 50,000 URLs per sitemap
    });

    // Generate dynamic routes for individual notes
    dynamicRoutes = notes
      .filter((note) => note.slug && typeof note.slug === "string") // Ensure slug exists and is valid
      .map((note, index) => {
        // Calculate priority based on recency and position
        const isRecent =
          new Date(note.updatedAt).getTime() >
          Date.now() - 30 * 24 * 60 * 60 * 1000; // 30 days
        const positionFactor = Math.max(0.3, 1 - (index / notes.length) * 0.3);
        const priority =
          Math.round((0.6 + (isRecent ? 0.2 : 0) + positionFactor * 0.2) * 10) /
          10;

        return {
          url: `${normalizedBaseUrl}/notes/${encodeURIComponent(note.slug)}`,
          lastModified: note.updatedAt,
          changeFrequency: "weekly" as const,
          priority: Math.min(priority, 1.0), // Ensure max priority is 1.0
        };
      });

    console.log(
      `Generated sitemap with ${staticRoutes.length} static and ${dynamicRoutes.length} dynamic routes`
    );
  } catch (error) {
    console.error("Error generating dynamic sitemap routes:", error);
    // Continue with static routes only if database fails
  }

  // Combine routes
  const allRoutes = [...staticRoutes, ...dynamicRoutes];

  // Cache in production
  if (process.env.NODE_ENV === "production") {
    sitemapCache = {
      data: allRoutes,
      timestamp: Date.now(),
    };
  }

  return allRoutes;
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
 * - Ensure no private user data is exposed in sitemap URLs
 */
