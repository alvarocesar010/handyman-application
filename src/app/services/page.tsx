import Link from "next/link";
import {
  DoorOpen,
  Heater,
  Wrench,
  ShowerHead,
  WashingMachine,
  Droplet,
  Lightbulb,
  Zap,
} from "lucide-react";

const services = [
  {
    slug: "door-replacement",
    title: "Door Replacement",
    description: "Replace and fit new doors with hinges, handles, and locks.",
    icon: DoorOpen,
  },
  {
    slug: "heater-maintenance",
    title: "Heater Maintenance",
    description:
      "Keep your heating system efficient and safe with regular checks.",
    icon: Heater,
  },
  {
    slug: "furniture-assembly",
    title: "Furniture Assembly",
    description: "Flat-pack furniture assembled quickly and correctly.",
    icon: Wrench,
  },
  {
    slug: "fit-shower",
    title: "Fit Shower",
    description: "Professional installation of showers and bathroom fittings.",
    icon: ShowerHead,
  },
  {
    slug: "fit-washing-dishwasher",
    title: "Fit Washing Machine & Dishwasher",
    description: "Safe installation of washing machines and dishwashers.",
    icon: WashingMachine,
  },
  {
    slug: "tap-replacement",
    title: "Tap Replacement",
    description: "Replace leaking or broken taps in kitchens and bathrooms.",
    icon: Droplet,
  },
  {
    slug: "lights-replacement",
    title: "Lights Replacement",
    description: "Swap old fittings for modern, efficient lighting.",
    icon: Lightbulb,
  },
  {
    slug: "electrical-repairs",
    title: "Electrical Repairs",
    description: "Minor electrical fixes carried out safely and efficiently.",
    icon: Zap,
  },
];

export default function ServicesPage() {
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
        {services.map(({ slug, title, description, icon: Icon }) => (
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
            <p className="text-sm text-slate-600">{description}</p>
            <p className="mt-3 text-sm font-medium text-cyan-700">
              Learn more →
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
