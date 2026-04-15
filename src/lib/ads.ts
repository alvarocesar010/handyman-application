// src/lib/ads.ts

/**
 * Sends a Google Ads conversion and then opens the given URL (tel:, wa.me, link etc.)
 */

export function reportConversionAwait(
  params?: { value?: number; currency?: string; domain: string },
  timeoutMs = 2000,
): Promise<void> {
  const isPt = params?.domain == "pt";
  const ADS_SEND_TO = isPt
    ? "AW-18086991911/m62ACNmxu5scEKewxrBD"
    : "AW-10991191295/_1A7CLqc3LYbEP-Jgfko";

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

    try {
      window.gtag("event", "conversion", {
        send_to: ADS_SEND_TO,
        value: params?.value ?? 1.0,
        currency: params?.currency ?? "EUR",
        transaction_id:
          typeof crypto !== "undefined"
            ? crypto.randomUUID()
            : Math.random().toString(36),
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
