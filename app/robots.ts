import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // Use the current request URL if NEXT_PUBLIC_APP_URL is not set in development
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

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/*",
          "/app/*", // SECURITY: Disallow all dashboard routes to prevent indexing
          "/_next/",
          "/.well-known/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/api/*",
          "/app/*", // SECURITY: Disallow all dashboard routes
          "/_next/",
        ],
      },
    ],
    sitemap: `${normalizedBaseUrl}/sitemap.xml`, // SECURITY: Always HTTPS in production
    host: normalizedBaseUrl,
  };
}
