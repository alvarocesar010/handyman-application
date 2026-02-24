// src/app/contact/seo.ts
import type { Metadata } from "next";
import { getLocale } from "@/lib/getLocale";

export async function getContactMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const isPT = locale === "pt";

  const baseUrl = isPT ? "https://lislock.pt" : "https://dublinerhandyman.ie";

  const title = isPT
    ? "Contacto | LisLock"
    : "Contact a Handyman in Dublin | Dubliner Handyman";

  const description = isPT
    ? "Entre em contacto com a LisLock para marcações, orçamentos ou reparações urgentes em Lisboa."
    : "Contact Dubliner Handyman for bookings, quotes, and urgent handyman repairs across Dublin.";

  const url = `${baseUrl}/contact`;
  const ogImage = isPT ? "/ogImgLL.png" : "/ogImgDH.png"

  return {
    title,
    description,

    alternates: {
      canonical: url,
      languages: {
        "en-IE": "https://dublinerhandyman.ie/contact",
        "pt-PT": "https://lislock.pt/contact",
        "x-default": "https://dublinerhandyman.ie/contact",
      },
    },

    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: isPT ? "LisLock" : "Dubliner Handyman",
      locale: isPT ? "pt_PT" : "en_IE",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}
