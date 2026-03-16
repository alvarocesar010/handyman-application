// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { SERVICES_EN } from "@/lib/services_en";
import { SERVICES_PT } from "@/lib/services_pt";

const DOMAINS = {
  en: "https://dublinerhandyman.ie",
  pt: "https://lislock.pt",
};

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = ["", "services", "booking", "contact"];

  const staticUrls: MetadataRoute.Sitemap = staticRoutes.flatMap((route) => {
    const path = route ? `/${route}` : "";
    const priority = route === "" ? 1 : 0.8;

    return [
      {
        url: `${DOMAINS.en}${path}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority,
        alternates: {
          languages: {
            "en-IE": `${DOMAINS.en}${path}`,
            "pt-PT": `${DOMAINS.pt}${path}`,
          },
        },
      },
      {
        url: `${DOMAINS.pt}${path}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority,
        alternates: {
          languages: {
            "en-IE": `${DOMAINS.en}${path}`,
            "pt-PT": `${DOMAINS.pt}${path}`,
          },
        },
      },
    ];
  });

  const serviceUrls: MetadataRoute.Sitemap = [
    ...SERVICES_EN.map((serviceEn) => {
      const matchingPt = SERVICES_PT.find((pt) => pt.slug === serviceEn.slug);

      return {
        url: `${DOMAINS.en}/services/${serviceEn.slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
        alternates: matchingPt
          ? {
              languages: {
                "en-IE": `${DOMAINS.en}/services/${serviceEn.slug}`,
                "pt-PT": `${DOMAINS.pt}/services/${matchingPt.slug}`,
              },
            }
          : undefined,
      };
    }),

    ...SERVICES_PT.map((servicePt) => {
      const matchingEn = SERVICES_EN.find((en) => en.slug === servicePt.slug);

      return {
        url: `${DOMAINS.pt}/services/${servicePt.slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
        alternates: matchingEn
          ? {
              languages: {
                "en-IE": `${DOMAINS.en}/services/${matchingEn.slug}`,
                "pt-PT": `${DOMAINS.pt}/services/${servicePt.slug}`,
              },
            }
          : undefined,
      };
    }),
  ];

  return [...staticUrls, ...serviceUrls];
}
