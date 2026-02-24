import { getLocale } from "@/lib/getLocale";
import { getMessages } from "@/lib/getMessages";
import type { Messages } from "@/lib/getMessages";
import type { Metadata } from "next";

type PageKey = Exclude<keyof Messages, "common">;

export async function getSeo(page: PageKey): Promise<Metadata> {
  const locale = await getLocale();
  const t = getMessages(locale);

  const isPT = locale === "pt";

  const baseUrl = isPT ? "https://lislock.pt" : "https://dublinerhandyman.ie";

  const path = page === "home" ? "" : `/${page}`;
  const canonical = `${baseUrl}${path}`;

  const seo = t[page].seo;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical,
      languages: {
        "en-IE": `https://dublinerhandyman.ie${path}`,
        "pt-PT": `https://lislock.pt${path}`,
      },
    },
  };
}
