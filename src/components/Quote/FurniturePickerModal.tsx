"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { FURNITURE_REGISTRY } from "./furniture/registry";
import { FurnitureType } from "@/types/quote";

type Props = {
  onChange: (type: FurnitureType) => void;
  ctaText: string;
};

export default function FurniturePickerModal({ onChange, ctaText }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const firstFocusRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) setTimeout(() => firstFocusRef.current?.focus(), 0);
  }, [open]);

  const filtered = FURNITURE_REGISTRY.filter((f) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      f.title.toLowerCase().includes(q) || f.summary.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center rounded-lg bg-cyan-700 px-5 py-3 text-white font-medium shadow hover:bg-cyan-800 focus-visible:ring-2 focus-visible:ring-cyan-600"
      >
        {ctaText}
      </button>

      {open && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />

          <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-2xl rounded-t-2xl bg-white shadow-xl md:top-1/2 md:-translate-y-1/2 md:rounded-2xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="text-lg font-semibold">Select furniture</h2>
              <button
                onClick={() => setOpen(false)}
                className="rounded p-2 hover:bg-slate-100"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-5 py-3">
              <label className="relative block">
                <input
                  ref={firstFocusRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search furniture…"
                  className="w-full rounded-md border pl-9 pr-3 py-2 focus:ring-2 focus:ring-cyan-600"
                />
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              </label>
            </div>

            <div className="max-h-[70vh] overflow-y-auto px-5 pb-5">
              <div className="grid gap-3 sm:grid-cols-2">
                {filtered.map(({ type, title, summary, icon: Icon }) => (
                  <button
                    key={type}
                    onClick={() => {
                      onChange(type);
                      setOpen(false);
                    }}
                    className="rounded-xl border p-4 text-left transition shadow-sm hover:border-slate-300 hover:shadow-md"
                  >
                    <div className="flex gap-3">
                      <span className="rounded-lg bg-slate-50 p-3 ring-1">
                        <Icon className="h-6 w-6 text-cyan-700" />
                      </span>
                      <div>
                        <div className="font-semibold">{title}</div>
                        <div className="text-sm text-slate-600">{summary}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
