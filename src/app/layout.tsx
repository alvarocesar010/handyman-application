import "./globals.css";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Script from "next/script";
import { getLocale } from "@/lib/getLocale";
import { Metadata } from "next";
import { getMessages } from "@/lib/getMessages";
import JsonLd from "@/components/JsonLd";
import { CartProvider } from "@/context/CartContext";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const isPT = locale === "pt";

  const baseUrl = isPT ? "https://lislock.pt" : "https://dublinerhandyman.ie";

  return {
    metadataBase: new URL(baseUrl),
    icons: {
      icon: isPT ? "/lisLock.ico" : "/favicon.ico",
    },
  };
}
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const t = getMessages(locale);
  const isPT = locale === "pt";
  const structuredData = t.home.seo.structuredData; // Get the schema from your JSON
  const layout = t.layout;

  return (
    <html lang={isPT ? "pt-PT" : "en-IE"}>
      <body>
        {/* Google tag (Ads + GA) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-10991191295"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            const isInternal = document.cookie.includes('traffic_type=internal');
            const isAdminRoute =
              location.pathname.startsWith('/admin') ||
              location.pathname.startsWith('/customer') ||
              location.pathname.startsWith('/internal')

            gtag('config', 'AW-10991191295', {
              traffic_type: isInternal || isAdminRoute ? 'internal' : undefined,
            });
            gtag('config', 'AW-18086991911', {
  traffic_type: isInternal || isAdminRoute ? 'internal' : undefined,
});
          `}
        </Script>

        {/* Schema.org */}
        {structuredData && <JsonLd data={structuredData} />}
        <CartProvider>
          <Navbar layout={layout} />
          <div className="pt-16">{children}</div>
          <ToastContainer position="top-center" autoClose={3000} />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
