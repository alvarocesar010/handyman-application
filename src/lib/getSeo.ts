import { getLocale } from "@/lib/getLocale";
import { getMessages } from "@/lib/getMessages";
import type { Messages } from "@/lib/getMessages";
import type { Metadata } from "next";

type PageKey = Exclude<keyof Messages, "common" | "layout">;

export async function getSeo(page: PageKey): Promise<Metadata> {
  const locale = await getLocale();
  const t = getMessages(locale);
  const isPT = locale === "pt";
  const baseUrl = isPT ? "https://lislock.pt" : "https://dublinerhandyman.ie";

  const path = page === "home" ? "" : `/${page}`;
  const canonical = `${baseUrl}${path}`;
  const seo = t[page].seo; // This matches your SeoJson type

  return {
    title: seo.title,
    description: seo.description,
    applicationName: seo.applicationName,
    authors: seo.authors,
    creator: seo.creator,
    publisher: seo.publisher,
    metadataBase: new URL(baseUrl), // Essential for resolving relative image paths
    alternates: {
      canonical,
      languages: {
        "en-IE": `https://dublinerhandyman.ie${path}`,
        "pt-PT": `https://lislock.pt${path}`,
        "x-default": `https://dublinerhandyman.ie${path}`,
      },
    },
    robots: seo.robots,
    openGraph: {
      ...seo.openGraph,
      url: canonical,
      siteName: seo.openGraph?.siteName || seo.applicationName,
      images: seo.openGraph?.images,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.twitter?.title,
      description: seo.twitter?.description,
      images: seo.twitter?.images, // Ensure this is an array in your JSON
    },
    category: seo.category,
  };
}
