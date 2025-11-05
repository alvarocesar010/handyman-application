// src/lib/ads.ts
const ADS_SEND_TO = "AW-10991191295/_1A7CLqc3LYbEP-Jgfko";

/**
 * Sends a Google Ads conversion and then opens the given URL (tel:, wa.me, link etc.)
 */
export async function handleConversionClick(
  e: React.MouseEvent<HTMLElement>,
  href: string,
  newTab = false
) {
  e.preventDefault();

  try {
    if (typeof window.gtag === "function") {
      const done = () => {
        if (newTab) {
          window.open(href, "_blank", "noopener,noreferrer");
        } else {
          window.location.href = href;
        }
      };

      window.gtag("event", "conversion", {
        send_to: ADS_SEND_TO,
        value: 1.0,
        currency: "EUR",
        event_callback: done,
      });

      // fallback in case callback doesn’t fire
      setTimeout(done, 1000);
    } else {
      // gtag not ready → just go
      if (newTab) window.open(href, "_blank", "noopener,noreferrer");
      else window.location.href = href;
    }
  } catch {
    if (newTab) window.open(href, "_blank", "noopener,noreferrer");
    else window.location.href = href;
  }
}
