"use client";

import { useState } from "react";
import { QuoteItemType } from "@/types/quote";
import type { QuoteRegistryItem } from "./registry.types";

type Props = {
  items: QuoteRegistryItem[];
  onChange: (type: QuoteItemType) => void; // ✅ ONLY TYPE
  ctaText: string;
  title?: string;
};

export default function QuoteItemPickerModal({
  items,
  onChange,
  ctaText,
  title = "Select item",
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-cyan-700 px-5 py-3 text-white font-medium"
      >
        {ctaText}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center">
          <div className="bg-white rounded-xl w-full max-w-md p-4 space-y-3">
            <h2 className="font-semibold">{title}</h2>

            {items.map((item) => (
              <button
                key={item.type}
                onClick={() => {
                  onChange(item.type);
                  setOpen(false);
                }}
                className="w-full rounded border p-3 text-left"
              >
                <div className="font-medium">{item.title}</div>
                <div className="text-sm text-slate-600">{item.summary}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
