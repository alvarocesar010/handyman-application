"use client";

import { useState } from "react";
import { FurnitureFormProps } from "./types";
import { calculateBed } from "@/lib/pricing/calculator";

export default function BedForm({ onAddItem }: FurnitureFormProps) {
  const [size, setSize] = useState<"single" | "double" | "king">("double");
  const [quantity, setQuantity] = useState(1);

  function handleAdd() {
    const base = calculateBed(size);

    onAddItem({
      ...base,
      quantity,
    });
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Bed size</label>

      <div className="grid grid-cols-3 gap-2">
        {(["single", "double", "king"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSize(s)}
            className={`rounded-lg border py-2 text-sm font-medium ${
              size === s ? "bg-slate-900 text-white" : "hover:bg-slate-50"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <label className="text-sm font-medium">Quantity</label>
      <input
        type="number"
        min={1}
        value={quantity}
        onChange={(e) => setQuantity(+e.target.value)}
        className="border p-2 rounded w-full"
      />

      <button
        onClick={handleAdd}
        className="w-full rounded-xl bg-slate-900 py-3 text-white font-semibold"
      >
        Add item
      </button>
    </div>
  );
}
