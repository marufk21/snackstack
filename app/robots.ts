import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // Use the current request URL if NEXT_PUBLIC_APP_URL is not set in development
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.NODE_ENV === "development"
      ? "http://localhost:3001"
      : "https://localhost:3000");

  // Ensure baseUrl is properly formatted and safe
  const normalizedBaseUrl = baseUrl?.startsWith("http")
    ? baseUrl
    : `https://${baseUrl || "localhost:3000"}`;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/*",
          "/app/subscription/success",
          "/_next/",
          "/.well-known/",
          "/sign-in",
          "/sign-up",
          "/app/new",
          "/app/subscription",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/*", "/_next/", "/app/subscription/success"],
      },
    ],
    sitemap: `${normalizedBaseUrl}/sitemap.xml`,
    host: normalizedBaseUrl,
  };
}
