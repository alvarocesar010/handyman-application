// app/services/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { SERVICES_EN, SERVICE_MAP_EN } from "@/lib/services_en";

import { SERVICES_PT, SERVICE_MAP_PT } from "@/lib/services_pt";

import type { Metadata } from "next";
import { CalendarCheck, Phone } from "lucide-react";
import ReviewsBox from "@/components/ReviewsBox";
import ServiceSteps from "@/components/Services/ServiceSteps";
import { CategoriesGrid } from "@/components/Services/CategoriesGrid";
import { getLocale } from "@/lib/getLocale";
import { ICON_MAP } from "@/lib/iconMap";

type Params = { slug: string };
type PageProps = { params: Promise<Params> };

export async function generateStaticParams() {
  return [
    ...SERVICES_EN.map((s) => ({ slug: s.slug })),
    ...SERVICES_PT.map((s) => ({ slug: s.slug })),
  ];
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const locale = await getLocale();
  const isPT = locale === "pt";

  const svc = isPT ? SERVICE_MAP_PT.get(slug) : SERVICE_MAP_EN.get(slug);

  if (!svc) {
    return {
      title: "Service not found",
      robots: { index: false, follow: false },
    };
  }

  const baseUrl = isPT ? "https://lislock.pt" : "https://dublinerhandyman.ie";

  const path = `/services/${svc.slug}`;
  const url = `${baseUrl}${path}`;

  const title = isPT ? `${svc.title} em Lisboa` : `${svc.title} in Dublin`;

  const description = isPT
    ? `${svc.summary} Disponível em Lisboa. Marque ${svc.title.toLowerCase()} online.`
    : `${svc.summary} Available across Dublin. Book ${svc.title.toLowerCase()} online.`;

  const ogImage = isPT ? "/ogImgLislock.png" : "/ogImgDH.png";
  const siteName = isPT ? "Lislock" : "Dubliner Handyman";

  return {
    title,
    description,

    alternates: {
      canonical: url,
      languages: {
        "en-IE": `https://dublinerhandyman.ie${path}`,
        "pt-PT": `https://lislock.pt${path}`,
      },
    },

    openGraph: {
      type: "article",
      url,
      title,
      description,
      siteName,
      images: [
        {
          url: `${baseUrl}${ogImage}`,
          width: 1200,
          height: 630,
          alt: svc.title,
        },
      ],
      locale: isPT ? "pt_PT" : "en_IE",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}${ogImage}`],
    },
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const locale = await getLocale();
  const isPT = locale === "pt";

  const svc = isPT ? SERVICE_MAP_PT.get(slug) : SERVICE_MAP_EN.get(slug);
  if (!svc) return notFound();

  const baseUrl = isPT ? "https://lislock.pt" : "https://dublinerhandyman.ie";

  const siteName = isPT ? "Lislock" : "Dubliner Handyman";

  const price = svc.startingPrice
    ? `from €${(svc.startingPrice / 100).toFixed(0)}`
    : "Get a quote";

  const Icon = ICON_MAP[svc.icon];
  const categoryNames = svc.categories
    ? Object.keys(svc.categories)
    : undefined;

  return (
    <>
      <main className="mx-auto max-w-3xl px-6 py-10 pb-28 space-y-8">
        {/* Header */}
        <header className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-lg bg-cyan-50 px-3 py-1 ring-1 ring-cyan-200 text-cyan-800">
            <Icon className="h-5 w-5" />
            <span className="text-sm font-medium">{svc.title}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            {svc.title}
          </h1>
          <p className="text-slate-700">{svc.summary}</p>
          <p className="text-slate-600 text-sm">
            {svc.durationHint && <>Typical duration: {svc.durationHint} · </>}
            Price: {price}
          </p>

          <div className="flex gap-3 pt-2">
            <Link
              href={`/booking?service=${svc.slug}`}
              className="inline-flex h-11 items-center justify-center rounded-lg bg-cyan-700 px-5 text-white font-medium shadow hover:bg-cyan-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600"
            >
              Book this service
            </Link>
            <a
              href={`tel:${process.env.PHONE_NUMBER?.replace(/\s/g, "") ?? ""}`}
              className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-900 px-5 text-white font-medium shadow hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-700"
            >
              Call for advice
            </a>
          </div>
        </header>

        <section className="prose prose-slate max-w-none">
          <h2>What we do</h2>
          <p>{svc.longDescription}</p>
          <p>
            Ready to get started?{" "}
            <Link href={`/booking?service=${svc.slug}`}>
              Book your {svc.title.toLowerCase()} in Dublin today
            </Link>
            .
          </p>
        </section>

        {svc.categories && (
          <CategoriesGrid
            title={svc.categoriesTitle ?? "What we handle"}
            categories={svc.categories}
            categoryImages={svc.categoryImages}
          />
        )}

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

        {svc.steps && svc.steps.length > 0 && (
          <ServiceSteps
            title="How we install curtains and blinds"
            steps={svc.steps}
          />
        )}

        <ReviewsBox serviceSlug={svc.slug} />

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

        {/* Service schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Service",
              name: svc.title,
              description: svc.summary,
              areaServed: {
                "@type": "AdministrativeArea",
                name: isPT ? "Lisboa, Portugal" : "Dublin, Ireland",
              },
              provider: {
                "@type": "LocalBusiness",
                name: siteName,
                url: baseUrl,
              },
              hasOfferCatalog: categoryNames
                ? {
                    "@type": "OfferCatalog",
                    name: svc.categoriesTitle ?? `${svc.title} services`,
                    itemListElement: categoryNames.map((c) => ({
                      "@type": "OfferCatalog",
                      name: c,
                    })),
                  }
                : undefined,
            }),
          }}
        />

        {/* FAQ schema */}
        {svc.faqs && svc.faqs.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: svc.faqs.map(({ q, a }) => ({
                  "@type": "Question",
                  name: q,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: a,
                  },
                })),
              }),
            }}
          />
        )}
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 print:hidden">
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3 print:hidden">
          <Link
            href={`/booking?service=${svc.slug}`}
            aria-label={`Book ${svc.title}`}
            className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-cyan-700 text-white shadow hover:bg-cyan-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600"
          >
            <CalendarCheck className="h-6 w-6" />
          </Link>
          <a
            href={`tel:${process.env.PHONE_NUMBER?.replace(/\s/g, "") ?? ""}`}
            aria-label="Call for advice"
            className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white shadow hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-700"
          >
            <Phone className="h-6 w-6" />
          </a>
        </div>
      </div>
    </>
  );
}
