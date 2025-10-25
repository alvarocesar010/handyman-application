import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SITE, absUrl } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.name,
    template: `%s | ${SITE.name}`,
  },
  description:
    "Reliable handyman in Dublin for doors, taps, appliances, lights, and more. Fast quotes and same-day repairs.",
  applicationName: SITE.name,
  keywords: [
    "handyman dublin",
    "door replacement",
    "tap replacement",
    "furniture assembly",
    "electrician repairs",
    "plumber dublin",
  ],
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  publisher: SITE.name,

  alternates: {
    canonical: absUrl("/"),
  },

  openGraph: {
    type: "website",
    url: absUrl("/"),
    title: SITE.name,
    description: "Reliable handyman services across Dublin. Book online.",
    siteName: SITE.name,
    images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: SITE.name }],
    locale: SITE.locale,
  },

  twitter: {
    card: "summary_large_image",
    site: SITE.twitter || undefined,
    creator: SITE.twitter || undefined,
    title: SITE.name,
    description: "Reliable handyman services across Dublin. Book online.",
    images: [SITE.ogImage],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },

  icons: [{ rel: "icon", url: "/favicon.ico" }],
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: SITE.name,
              url: SITE.url,
              areaServed: "Dublin, Ireland",
              telephone: `${process.env.PHONE_NUMBER?.replace(/\s/g, "")}`,
              image: absUrl(SITE.logo),
              sameAs: [
                // add social links if you have them
              ],
            }),
          }}
        />

        <Navbar />
        {children}
        <ToastContainer position="top-center" autoClose={3000} />
        <Footer />
      </body>
    </html>
  );
}
