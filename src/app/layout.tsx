import "./globals.css";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Script from "next/script";
import { getLocale } from "@/lib/getLocale";
import { getMessages } from "@/lib/getMessages";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const t = getMessages(locale);

  const isPT = locale === "pt";

  // 🔑 Domain MUST be computed at runtime (not from JSON)
  const baseUrl = isPT ? "https://lislock.pt" : "https://dublinerhandyman.ie";

  const seo = t.home.seo;

  return (
    <html lang={isPT ? "pt-PT" : "en-IE"}>
      <head>
        {/* Google tag (Ads + GA) */}

        <Script id="gtag-init" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            const isInternal = document.cookie.includes('traffic_type=internal');
            const isAdminRoute =
              location.pathname.startsWith('/admin') ||
              location.pathname.startsWith('/customer');

            gtag('config', 'AW-10991191295', {
              traffic_type: isInternal || isAdminRoute ? 'internal' : undefined,
            });
          `}
        </Script>

        {/* Schema.org */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: seo.applicationName ?? seo.title,
              url: baseUrl,
              areaServed: isPT ? "Lisboa, Portugal" : "Dublin, Ireland",
              telephone: process.env.PHONE_NUMBER?.replace(/\s/g, ""),
              image: seo.openGraph?.ogImg && `${baseUrl}${seo.openGraph.ogImg}`,
              sameAs: [],
            }),
          }}
        />
      </head>

      <body>
        <Navbar />
        {children}
        <ToastContainer position="top-center" autoClose={3000} />
        <Footer />
      </body>
    </html>
  );
}
