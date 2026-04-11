import type { MetadataRoute } from "next";
import { SERVICES_EN } from "@/lib/services_en";
import { SERVICES_PT } from "@/lib/services_pt";

type Service = {
  key: string;
  slug: string;
};

const DOMAINS = {
  en: "https://dublinerhandyman.ie",
  pt: "https://lislock.pt",
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // --------------------------
  // STATIC ROUTES
  // --------------------------
  const staticRoutes: string[] = [
    "",
    "services",
    "booking",
    "contact",
    "store",
  ];

  const staticUrls: MetadataRoute.Sitemap = staticRoutes.map((route) => {
    const path = route ? `/${route}` : "";
    const priority = route === "" ? 1 : 0.8;

    return {
      url: `${DOMAINS.en}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority,
      alternates: {
        languages: {
          "en-IE": `${DOMAINS.en}${path}`,
          "pt-PT": `${DOMAINS.pt}${path}`,
          "x-default": `${DOMAINS.en}${path}`,
        },
      },
    };
  });

  // --------------------------
  // SERVICES EN (with optional PT)
  // --------------------------
  const enServices: Service[] = SERVICES_EN;
  const ptServices: Service[] = SERVICES_PT;

  const serviceUrls: MetadataRoute.Sitemap = enServices.map((serviceEn) => {
    const matchingPt = ptServices.find((pt) => pt.key === serviceEn.key);

    return {
      url: `${DOMAINS.en}/services/${serviceEn.slug}`,

      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: {
        languages: {
          "en-IE": `${DOMAINS.en}/services/${serviceEn.slug}`,
          ...(matchingPt && {
            "pt-PT": `${DOMAINS.pt}/services/${matchingPt.slug}`,
          }),
          "x-default": `${DOMAINS.en}/services/${serviceEn.slug}`,
        },
      },
    };
  });

  // --------------------------
  // SERVICES PT ONLY (no EN match)
  // --------------------------
  const ptOnlyUrls: MetadataRoute.Sitemap = ptServices
    .filter((pt) => !enServices.some((en) => en.key === pt.key))
    .map((servicePt) => {
      return {
        url: `${DOMAINS.pt}/services/${servicePt.slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
        alternates: {
          languages: {
            "pt-PT": `${DOMAINS.pt}/services/${servicePt.slug}`,
            "x-default": `${DOMAINS.pt}/services/${servicePt.slug}`,
          },
        },
      };
    });

  // --------------------------
  // FINAL SITEMAP
  // --------------------------
  return [...staticUrls, ...serviceUrls, ...ptOnlyUrls];
}
