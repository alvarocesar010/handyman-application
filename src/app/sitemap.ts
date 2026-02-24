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

  if (SERVICES_EN.length !== SERVICES_PT.length) {
    throw new Error(
      "SERVICES_EN and SERVICES_PT must have the same length and order.",
    );
  }

  const staticRoutes = ["", "services", "booking", "contact"];

  const staticUrls: MetadataRoute.Sitemap = staticRoutes.flatMap((route) => {
    const path = route ? `/${route}` : "";
    const priority = route === "" ? 1 : 0.8;

    return [
      {
        url: `${DOMAINS.en}${path}`,
        lastModified: now,
        changeFrequency: "weekly",
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
        changeFrequency: "weekly",
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

  const serviceUrls: MetadataRoute.Sitemap = SERVICES_EN.flatMap(
    (serviceEn, index) => {
      const servicePt = SERVICES_PT[index];

      return [
        {
          url: `${DOMAINS.en}/services/${serviceEn.slug}`,
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.7,
          alternates: {
            languages: {
              "en-IE": `${DOMAINS.en}/services/${serviceEn.slug}`,
              "pt-PT": `${DOMAINS.pt}/services/${servicePt.slug}`,
            },
          },
        },
        {
          url: `${DOMAINS.pt}/services/${servicePt.slug}`,
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.7,
          alternates: {
            languages: {
              "en-IE": `${DOMAINS.en}/services/${serviceEn.slug}`,
              "pt-PT": `${DOMAINS.pt}/services/${servicePt.slug}`,
            },
          },
        },
      ];
    },
  );

  return [...staticUrls, ...serviceUrls];
}
