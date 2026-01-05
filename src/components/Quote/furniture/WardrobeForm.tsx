"use client";

import { useState } from "react";
import { FurnitureFormProps } from "./types";
import { calculateWardrobe } from "@/lib/pricing/calculator";

export default function WardrobeForm({ onAddItem }: FurnitureFormProps) {
  const [doors, setDoors] = useState(2);
  const [quantity, setQuantity] = useState(1);

  function handleAdd() {
    const base = calculateWardrobe(doors);

    onAddItem({
      ...base,
      quantity,
    });
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Number of doors</label>
      <input
        type="number"
        min={1}
        value={doors}
        onChange={(e) => setDoors(+e.target.value)}
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
