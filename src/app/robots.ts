// src/app/robots.ts
import type { MetadataRoute } from "next";
import { headers } from "next/headers";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const headersList = await headers();
  const host = headersList.get("host");

  const isPT = host?.includes("lislock.pt");

  const baseUrl = isPT ? "https://lislock.pt" : "https://dublinerhandyman.ie";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "*",
        disallow: ["/admin", "/api/", "/internal", "/customer"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
