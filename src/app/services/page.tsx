import Link from "next/link";
import type { Metadata } from "next";
import { absUrl, pageTitle } from "@/lib/seo";
import { SERVICES } from "@/lib/services"; // ← pull data from the lib

export const metadata: Metadata = {
  title: pageTitle("Services"),
  description:
    "Browse our most requested handyman services in Dublin and book online.",
  alternates: { canonical: absUrl("/services") },
  openGraph: { url: absUrl("/services") },
};

export default function ServicesPage() {
  // If you ever want to filter which services show on this index, do it here.
  const services = SERVICES;

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      {/* Page header */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900">Our Services</h1>
        <p className="mt-3 text-lg text-slate-600">
          From urgent repairs to home improvements, choose the service that
          suits you best.
        </p>
      </header>

      {/* Services grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {services.map(({ slug, title, summary, icon: Icon }) => (
          <Link
            key={slug}
            href={`/services/${slug}`}
            className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="rounded-lg bg-cyan-100 p-3">
                <Icon className="h-6 w-6 text-cyan-700 group-hover:scale-110 transition-transform" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            </div>
            <p className="text-sm text-slate-600">{summary}</p>
            <p className="mt-3 text-sm font-medium text-cyan-700">
              Learn more →
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
