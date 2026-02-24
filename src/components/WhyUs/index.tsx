// app/components/WhyUs.tsx

import { ShieldCheck, Clock, ThumbsUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getLocale } from "@/lib/getLocale";
import { getMessages } from "@/lib/getMessages";

const ICON_MAP: Record<string, LucideIcon> = {
  ShieldCheck,
  Clock,
  ThumbsUp,
};

export default async function WhyUs() {
  const locale = await getLocale();
  const t = getMessages(locale).home.whyUs;

  return (
    <section className="py-12 bg-slate-50">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 text-center mb-10">
          {t.title}
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {t.points.map(
            ({
              icon,
              title,
              text,
            }: {
              icon: string;
              title: string;
              text: string;
            }) => {
              const Icon = ICON_MAP[icon];

              return (
                <div
                  key={title}
                  className="rounded-xl bg-white p-6 shadow-sm border border-slate-200 hover:shadow-md transition"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="rounded-lg bg-cyan-100 p-2">
                      {Icon ? <Icon className="h-6 w-6 text-cyan-700" /> : null}
                    </span>

                    <h3 className="text-lg font-semibold text-slate-900">
                      {title}
                    </h3>
                  </div>

                  <p className="text-slate-700 text-sm leading-relaxed">
                    {text}
                  </p>
                </div>
              );
            },
          )}
        </div>
      </div>
    </section>
  );
}
