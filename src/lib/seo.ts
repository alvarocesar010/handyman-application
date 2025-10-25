// src/lib/seo.ts
export const SITE = {
  name: "Dublin Handyman",
  url: process.env.SITE_URL || "http://localhost:3000",
  locale: "en_IE",
  twitter: "@yourhandle", // or "" if none
  logo: "/logo.png", // put a 512x512
  ogImage: "/og-default.jpg", // 1200x630 recommended
};

export function absUrl(path = "/") {
  try {
    return new URL(path, SITE.url).toString();
  } catch {
    return SITE.url + path;
  }
}

export function pageTitle(title?: string) {
  return title ? `${title} | ${SITE.name}` : SITE.name;
}
