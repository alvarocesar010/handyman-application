import { Suspense } from "react";
import BookingClient from "./BookingClient";
import Script from "next/script";

export default function BookingPage() {
  return (
    <Suspense
      fallback={<div className="p-10 text-center">Loading booking form...</div>}
    >
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-10991191295"
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-10991191295');
          `}
      </Script>
      <BookingClient />
    </Suspense>
  );
}
