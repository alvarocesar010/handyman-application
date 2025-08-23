// app/components/WhyUs.tsx
import { ShieldCheck, Clock, ThumbsUp } from "lucide-react";

const points = [
  {
    icon: ShieldCheck,
    title: "Fully Insured & Certified",
    text: "Peace of mind knowing every job is covered and carried out safely.",
  },
  {
    icon: Clock,
    title: "Fast Response",
    text: "Same-day callouts available in Dublin, with flexible scheduling.",
  },
  {
    icon: ThumbsUp,
    title: "Trusted Experience",
    text: "Over 10 years of hands-on repair and maintenance expertise.",
  },
];

export default function WhyUs() {
  return (
    <section className="py-12 bg-slate-50">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 text-center mb-10">
          Why Choose Us?
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {points.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-xl bg-white p-6 shadow-sm border border-slate-200 hover:shadow-md transition"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="rounded-lg bg-cyan-100 p-2">
                  <Icon className="h-6 w-6 text-cyan-700" />
                </span>
                <h3 className="text-lg font-semibold text-slate-900">
                  {title}
                </h3>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
