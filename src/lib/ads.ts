// src/lib/ads.ts

import { getLocale } from "./getLocale";

const isPt = await getLocale();

const ADS_SEND_TO = isPt
  ? "AW-18086991911/m62ACNmxu5scEKewxrBD"
  : "AW-10991191295/_1A7CLqc3LYbEP-Jgfko";

/**
 * Sends a Google Ads conversion and then opens the given URL (tel:, wa.me, link etc.)
 */

export function reportConversionAwait(
  params?: { value?: number; currency?: string },
  timeoutMs = 2000,
): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || typeof window.gtag === "undefined") {
      setTimeout(resolve, 0);
      return;
    }

    let settled = false;
    const done = () => {
      if (!settled) {
        settled = true;
        resolve();
      }
    };

    const t = setTimeout(done, timeoutMs);
    console.log(ADS_SEND_TO);
    try {
      window.gtag("event", "conversion", {
        send_to: ADS_SEND_TO,
        value: params?.value ?? 1.0,
        currency: params?.currency ?? "EUR",
        transaction_id: crypto.randomUUID(),
        event_callback: () => {
          clearTimeout(t);
          done();
        },
      });
    } catch {
      clearTimeout(t);
      done();
    }
  });
}
