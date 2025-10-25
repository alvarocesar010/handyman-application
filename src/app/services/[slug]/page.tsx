import Link from "next/link";
import { notFound } from "next/navigation";
import { SERVICE_MAP, SERVICES } from "@/lib/services";
import type { Metadata } from "next";
import { absUrl, pageTitle, SITE } from "@/lib/seo";

type Params = { slug: string };

export async function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

// Next.js 15: params can be async in APIs, but for pages it’s sync.
export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const svc = SERVICE_MAP.get(params.slug);
  if (!svc)
    return {
      title: pageTitle("Service not found"),
      robots: { index: false, follow: false },
    };

  const url = absUrl(`/services/${svc.slug}`);
  const title = pageTitle(svc.title);
  const desc = svc.summary;

  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description: desc,
      siteName: SITE.name,
      images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: svc.title }],
      locale: SITE.locale,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [SITE.ogImage],
    },
  };
}

export default function ServiceDetailPage({ params }: { params: Params }) {
  const svc = SERVICE_MAP.get(params.slug);
  if (!svc) return notFound();

  const price = svc.startingPrice
    ? `from €${(svc.startingPrice / 100).toFixed(0)}`
    : "Get a quote";

  const Icon = svc.icon;

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 space-y-8">
      {/* Header */}
      <header className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-lg bg-cyan-50 px-3 py-1 ring-1 ring-cyan-200 text-cyan-800">
          <Icon className="h-5 w-5" />
          <span className="text-sm font-medium">{svc.title}</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">{svc.title}</h1>
        <p className="text-slate-700">{svc.summary}</p>
        <p className="text-slate-600 text-sm">
          {svc.durationHint && <>Typical duration: {svc.durationHint} · </>}
          Price: {price}
        </p>

        {/* CTA */}
        <div className="flex gap-3 pt-2">
          <Link
            href={`/booking?service=${svc.slug}`}
            className="inline-flex h-11 items-center justify-center rounded-lg bg-cyan-700 px-5 text-white font-medium shadow hover:bg-cyan-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600"
          >
            Book this service
          </Link>
          <a
            href={`tel:${process.env.PHONE_NUMBER?.replace(/\s/g, "")}`}
            className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-900 px-5 text-white font-medium shadow hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-700"
          >
            Call for advice
          </a>
        </div>
      </header>

      {/* Long description */}
      <section className="prose prose-slate max-w-none">
        <h2>What we do</h2>
        <p>{svc.longDescription}</p>
      </section>

      {/* Inclusions / exclusions */}
      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            What’s included
          </h3>
          <ul className="list-disc pl-5 text-slate-700 space-y-1">
            {svc.inclusions.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            What’s not included
          </h3>
          <ul className="list-disc pl-5 text-slate-700 space-y-1">
            {(
              svc.exclusions ?? [
                "Parts & materials unless agreed",
                "Major re-tiling or re-wiring",
              ]
            ).map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQs */}
      {svc.faqs && svc.faqs.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-slate-900">FAQs</h3>
          <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
            {svc.faqs.map(({ q, a }) => (
              <details key={q} className="p-4">
                <summary className="cursor-pointer font-medium text-slate-900">
                  {q}
                </summary>
                <p className="mt-2 text-slate-700">{a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <div className="flex flex-wrap gap-3 pt-2">
        <Link
          href={`/booking?service=${svc.slug}`}
          className="inline-flex h-11 items-center justify-center rounded-lg bg-cyan-700 px-5 text-white font-medium hover:bg-cyan-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600"
        >
          Book {svc.title}
        </Link>
        <Link
          href="/services"
          className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-300 px-5 text-slate-800 font-medium hover:bg-white"
        >
          Back to all services
        </Link>
      </div>

      {/* SEO: JSON-LD Service schema */}
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: svc.title,
            description: svc.summary,
            areaServed: "Dublin, Ireland",
            provider: { "@type": "LocalBusiness", name: "Dublin Handyman" },
            offers: svc.startingPrice
              ? {
                  "@type": "Offer",
                  priceCurrency: "EUR",
                  price: (svc.startingPrice / 100).toFixed(0),
                }
              : undefined,
          }),
        }}
      />
    </main>
  );
}
