// app/services/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";

type Service = {
  title: string;
  summary: string;
  whatIncluded: string[];
  startingPrice?: number; // cents
  durationHint?: string;
};

const SERVICES: Record<string, Service> = {
  "door-maintenance": {
    title: "Door Replacement",
    summary: "Internal/external doors replaced, hinges aligned, locks fitted.",
    whatIncluded: [
      "Remove old door",
      "Fit new hinges",
      "Adjust & plane",
      "Fit handle/lock",
    ],
    startingPrice: 12000,
    durationHint: "Usually 1–2 hours",
  },
  "heater-maintenance": {
    title: "Heater Maintenance",
    summary: "Annual check, cleaning, performance test (non-gas diagnostics).",
    whatIncluded: ["Visual inspection", "Cleaning", "Safety checks", "Report"],
    startingPrice: 9000,
    durationHint: "About 60–90 minutes",
  },
  // …add the rest
};

export function generateMetadata({ params }: { params: { slug: string } }) {
  const svc = SERVICES[params.slug];
  if (!svc) return {};
  return {
    title: `${svc.title} | Handyman Dublin`,
    description: `${svc.title} in Dublin. ${svc.summary} Book online.`,
  };
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const svc = SERVICES[params.slug];
  if (!svc) return notFound();

  const price = svc.startingPrice
    ? `from €${(svc.startingPrice / 100).toFixed(0)}`
    : "Get a quote";

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900">{svc.title}</h1>
        <p className="text-slate-700">{svc.summary}</p>
        <p className="text-slate-600 text-sm">
          {svc.durationHint && <>Typical duration: {svc.durationHint} · </>}
          Price: {price}
        </p>
      </header>

      <section>
        <h2 className="text-lg font-semibold mb-2">What’s included</h2>
        <ul className="list-disc pl-6 space-y-1 text-slate-700">
          {svc.whatIncluded.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </section>

      {/* Booking actions */}
      <section className="flex flex-wrap gap-3">
        <Link
          href={`/booking?service=${params.slug}`}
          className="inline-flex h-11 items-center justify-center rounded-lg bg-cyan-700 px-5 text-white font-medium shadow hover:bg-cyan-800 focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:outline-none"
        >
          Book this service
        </Link>
        <a
          href="tel:+353894924563"
          className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-900 px-5 text-white font-medium shadow hover:bg-black focus-visible:ring-2 focus-visible:ring-slate-700 focus-visible:outline-none"
        >
          Call for advice
        </a>
      </section>

      {/* FAQ (optional) */}
      {/* Add FAQs per service to cut support time and improve SEO */}
    </main>
  );
}
