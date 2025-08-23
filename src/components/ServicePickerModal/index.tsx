// src/components/ServicePickerModal.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import {
  DoorOpen,
  Heater,
  Wrench,
  ShowerHead,
  WashingMachine,
  Droplet,
  Lightbulb,
  Zap,
  Search,
  X,
} from "lucide-react";

type ServiceItem = {
  slug: string;
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export const SERVICES: ServiceItem[] = [
  {
    slug: "door-replacement",
    title: "Door Replacement",
    description: "Replace & fit doors, locks, hinges.",
    icon: DoorOpen,
  },
  {
    slug: "heater-maintenance",
    title: "Heater Maintenance",
    description: "Annual checks, cleaning, diagnostics.",
    icon: Heater,
  },
  {
    slug: "furniture-assembly",
    title: "Furniture Assembly",
    description: "Flat-pack assembly done right.",
    icon: Wrench,
  },
  {
    slug: "fit-shower",
    title: "Fit Shower",
    description: "Install showers & bathroom fittings.",
    icon: ShowerHead,
  },
  {
    slug: "fit-washing-dishwasher",
    title: "Fit Washing Machine & Dishwasher",
    description: "Safe appliance installation.",
    icon: WashingMachine,
  },
  {
    slug: "tap-replacement",
    title: "Tap Replacement",
    description: "Fix leaks & replace taps.",
    icon: Droplet,
  },
  {
    slug: "lights-replacement",
    title: "Lights Replacement",
    description: "Swap old fittings & bulbs.",
    icon: Lightbulb,
  },
  {
    slug: "electrical-repairs",
    title: "Electrical Repairs",
    description: "Minor electrical fixes.",
    icon: Zap,
  },
];

type Props = {
  value?: string; // selected slug
  onChange?: (slug: string) => void; // notify parent
  ctaText?: string; // button label
};

export default function ServicePickerModal({
  value,
  onChange,
  ctaText = "Choose a service",
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFocusRef = useRef<HTMLInputElement>(null);

  const selectedItem = SERVICES.find((s) => s.slug === value);

  // Close on Esc
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Basic focus management when opening
  useEffect(() => {
    if (open) setTimeout(() => firstFocusRef.current?.focus(), 0);
  }, [open]);

  const filtered = SERVICES.filter((s) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q)
    );
  });

  return (
    <>
      {/* CTA button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center rounded-lg bg-cyan-700 px-5 py-3 text-white font-medium shadow hover:bg-cyan-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600"
      >
        {selectedItem ? `Change service: ${selectedItem.title}` : ctaText}
      </button>

      {/* Dialog / Drawer */}
      {open && (
        <div
          aria-modal="true"
          role="dialog"
          aria-labelledby="service-picker-title"
          className="fixed inset-0 z-50"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />

          {/* Panel (mobile: bottom sheet, desktop: centered modal) */}
          <div
            ref={dialogRef}
            className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-2xl rounded-t-2xl bg-white shadow-xl md:top-1/2 md:bottom-auto md:-translate-y-1/2 md:rounded-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h2
                id="service-picker-title"
                className="text-lg font-semibold text-slate-900"
              >
                Select a service
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="rounded p-2 text-slate-600 hover:bg-slate-100"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search */}
            <div className="px-5 py-3">
              <label className="relative block">
                <span className="sr-only">Search services</span>
                <input
                  ref={firstFocusRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search services…"
                  className="w-full rounded-md border border-slate-300 pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                />
                <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              </label>
            </div>

            {/* List */}
            <div className="max-h-[70vh] overflow-y-auto px-5 pb-5">
              <div className="grid gap-3 sm:grid-cols-2">
                {filtered.map(({ slug, title, description, icon: Icon }) => {
                  const selected = value === slug;
                  return (
                    <button
                      key={slug}
                      type="button"
                      onClick={() => {
                        onChange?.(slug);
                        setOpen(false);
                      }}
                      className={[
                        "group text-left rounded-xl border p-4 transition shadow-sm",
                        selected
                          ? "border-cyan-600 ring-2 ring-cyan-600 bg-cyan-50"
                          : "border-slate-200 hover:border-slate-300 hover:shadow-md bg-white",
                      ].join(" ")}
                    >
                      <div className="flex items-start gap-3">
                        <span className="rounded-lg bg-slate-50 p-3 ring-1 ring-slate-200">
                          <Icon className="h-6 w-6 text-cyan-700" />
                        </span>
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900">
                            {title}
                          </div>
                          <div className="text-sm text-slate-600">
                            {description}
                          </div>
                        </div>
                      </div>
                      {selected && (
                        <div className="mt-2 text-sm font-medium text-cyan-700">
                          Selected
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
