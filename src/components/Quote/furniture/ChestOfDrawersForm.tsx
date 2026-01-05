"use client";

import { useState } from "react";
import { FurnitureFormProps } from "./types";
import { calculateChestOfDrawers } from "@/lib/pricing/calculator";

export default function ChestOfDrawersForm({ onAddItem }: FurnitureFormProps) {
  const [drawers, setDrawers] = useState(5);
  const [quantity, setQuantity] = useState(1);

  function handleAdd() {
    const base = calculateChestOfDrawers(drawers);

    onAddItem({
      ...base,
      quantity,
    });
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Number of drawers</label>
      <input
        type="number"
        min={1}
        value={drawers}
        onChange={(e) => setDrawers(+e.target.value)}
        className="border p-2 rounded w-full"
      />

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
