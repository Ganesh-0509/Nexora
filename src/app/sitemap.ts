import type { MetadataRoute } from "next";
import { db } from "@/server/db";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Regenerate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://nexora.app";

  // Static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "weekly", priority: 1.0, lastModified: new Date() },
    { url: `${baseUrl}/opportunities`, changeFrequency: "hourly", priority: 0.9, lastModified: new Date() },
    { url: `${baseUrl}/sign-in`, changeFrequency: "yearly", priority: 0.3, lastModified: new Date() },
    { url: `${baseUrl}/sign-up`, changeFrequency: "yearly", priority: 0.3, lastModified: new Date() },
  ];

  // Dynamic opportunity pages
  let opportunityRoutes: MetadataRoute.Sitemap = [];
  try {
    const opportunities = await db.opportunity.findMany({
      select: { id: true, updatedAt: true },
      where: { deadline: { gte: new Date() } },
      orderBy: { createdAt: "desc" },
      take: 1000,
    });
    opportunityRoutes = opportunities.map((opp) => ({
      url: `${baseUrl}/opportunities/${opp.id}`,
      changeFrequency: "daily",
      priority: 0.7,
      lastModified: opp.updatedAt,
    }));
  } catch {
    // Fail gracefully if DB is unavailable during build
  }

  return [...staticRoutes, ...opportunityRoutes];
}
