"use client";

import { useState } from "react";
import { QuoteFormProps } from "@/components/Quote/types";

export default function RailForm({ onAddItem }: QuoteFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [wallType, setWallType] = useState<"plaster" | "concrete">("plaster");

  function handleAdd() {
    onAddItem({
      type: "curtain_rail",
      label: "Curtain rail installation",
      quantity,
      unitPrice: wallType === "concrete" ? 45 : 35,
      unitDurationMinutes: 30,
      metadata: {
        serviceCategory: "curtain_installation",
        wallType,
      },
    });
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Curtain rail installation</h3>

      <input
        type="number"
        min={1}
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="w-full rounded border p-2"
      />

      <select
        value={wallType}
        onChange={(e) => setWallType(e.target.value as "plaster" | "concrete")}
        className="w-full rounded border p-2"
      >
        <option value="plaster">Plasterboard</option>
        <option value="concrete">Concrete / brick (+€10)</option>
      </select>

      <button
        onClick={handleAdd}
        className="w-full rounded-xl bg-cyan-600 py-2 text-white font-semibold"
      >
        Add to quote
      </button>
    </div>
  );
}
