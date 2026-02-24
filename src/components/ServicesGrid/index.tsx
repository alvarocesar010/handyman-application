// app/components/ServicesGrid.tsx
import Link from "next/link";
import { getServices } from "@/lib/getServices";
import { getLocale } from "@/lib/getLocale";
import { getMessages } from "@/lib/getMessages";
import { ICON_MAP } from "@/lib/iconMap";

export default async function ServicesGrid() {
  const locale = await getLocale();
  const t = getMessages(locale).home;
  const services = await getServices();

  return (
    <section aria-labelledby="services-title" className="p-8 mx-auto max-w-6xl">
      <h2
        id="services-title"
        className="text-2xl font-bold text-slate-900 mb-6"
      >
        {t.servicesGrid.title}
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {services.map(({ slug, title, summary, icon }) => {
          const Icon = ICON_MAP[icon];

          return (
            <Link
              key={slug}
              href={`/services/${slug}`}
              className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 transition"
            >
              <div className="flex flex-col items-center text-center gap-3">
                <span className="rounded-lg bg-slate-50 p-3 ring-1 ring-slate-200">
                  {Icon ? (
                    <Icon className="h-7 w-7 text-cyan-700 group-hover:scale-110 transition-transform" />
                  ) : null}
                </span>

                <span className="text-sm font-medium text-slate-800">
                  {title}
                </span>

                <p className="text-xs text-slate-600 line-clamp-2">{summary}</p>

                <span className="text-xs text-cyan-700/80 font-medium">
                  {t.heroSection.bookButton} →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
