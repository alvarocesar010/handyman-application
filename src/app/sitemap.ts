// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";
import { SERVICES } from "@/lib/services";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  const base: MetadataRoute.Sitemap = [
    {
      url: `${SITE.url}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE.url}/services`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE.url}/booking`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE.url}/contact`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  const serviceUrls = SERVICES.map((s) => ({
    url: `${SITE.url}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...base, ...serviceUrls];
}
