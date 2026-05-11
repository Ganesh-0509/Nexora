import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/opportunities/"],
        disallow: ["/dashboard/", "/onboarding/", "/api/", "/saved/"],
      },
    ],
    sitemap: "https://nexora.app/sitemap.xml",
    host: "https://nexora.app",
  };
}
