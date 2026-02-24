import Link from "next/link";
import { getServices } from "@/lib/getServices";
import { getSeo } from "@/lib/getSeo";
import { ICON_MAP } from "@/lib/iconMap";
import { getMessages } from "@/lib/getMessages";
import { getLocale } from "@/lib/getLocale";

export const generateMetadata = () => getSeo("services");

export default async function ServicesPage() {
  const services = await getServices();
  const locale = await getLocale();
  const m = getMessages(locale).services;

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      {/* Page header */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900">{m.title}</h1>
        <p className="mt-3 text-lg text-slate-600">{m.cta}</p>
      </header>

      {/* Services grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {services.map(({ slug, title, summary, icon }) => {
          const Icon = ICON_MAP[icon];

          return (
            <Link
              key={slug}
              href={`/services/${slug}`}
              className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="rounded-lg bg-cyan-100 p-3">
                  {Icon ? (
                    <Icon className="h-6 w-6 text-cyan-700 group-hover:scale-110 transition-transform" />
                  ) : null}
                </div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {title}
                </h2>
              </div>

              <p className="text-sm text-slate-600">{summary}</p>

              <p className="mt-3 text-sm font-medium text-cyan-700">
                Learn more →
              </p>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
