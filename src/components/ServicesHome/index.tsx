// app/components/ServicesGrid.tsx
import Link from "next/link";
import {
  DoorOpen,
  Heater,
  Drill,
  ShowerHead,
  WashingMachine,
  Droplet,
  Lightbulb,
  Zap,
} from "lucide-react";

const services = [
  { slug: "door-maintenance", label: "Door Maintenance", icon: DoorOpen },
  { slug: "heater-maintenance", label: "Heater Maintenance", icon: Heater },
  { slug: "furniture-assembly", label: "Furniture Assembly", icon: Drill },
  { slug: "fit-shower", label: "Fit Shower", icon: ShowerHead },
  {
    slug: "fit-washing-dishwasher",
    label: "Fit Washing Machine & Dishwasher",
    icon: WashingMachine,
  },
  { slug: "tap-replacement", label: "Tap Replacement", icon: Droplet },
  { slug: "lights-replacement", label: "Lights Replacement", icon: Lightbulb },
  { slug: "electrical-repairs", label: "Electrical Repairs", icon: Zap },
];

export default function ServicesGrid() {
  return (
    <section aria-labelledby="services-title" className="p-8">
      <h2
        id="services-title"
        className="text-2xl font-bold text-slate-900 mb-4"
      >
        Popular Services
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {services.map(({ slug, label, icon: Icon }) => (
          <Link
            key={slug}
            href={`/services/${slug}`}
            className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <span className="rounded-lg bg-slate-50 p-3 ring-1 ring-slate-200">
                <Icon className="h-7 w-7 text-cyan-700 group-hover:scale-110 transition-transform" />
              </span>
              <span className="text-sm font-medium text-slate-800">
                {label}
              </span>
              <span className="text-xs text-cyan-700/80">Book now →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
