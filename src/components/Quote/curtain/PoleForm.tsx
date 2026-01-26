// src/components/Quote/curtain/PoleForm.tsx
"use client";

import { useState } from "react";
import { QuoteItem } from "@/types/quote";

export default function PoleForm({
  onAddItem,
}: {
  onAddItem: (item: Omit<QuoteItem, "id">) => void;
}) {
  const [quantity, setQuantity] = useState(1);
  const [wallType, setWallType] = useState<"plaster" | "concrete">("plaster");

  const basePrice = 40;
  const concreteExtra = wallType === "concrete" ? 10 : 0;

  function handleAdd() {
    onAddItem({
      type: "curtain_pole",
      label: "Curtain pole installation",
      quantity,
      unitPrice: basePrice + concreteExtra,
      unitDurationMinutes: 35,
      metadata: {
        serviceCategory: "curtain_installation",
        curtainType: "pole",
        wallType,
      },
    });
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Curtain pole details</h3>

      <label className="block text-sm">
        Quantity
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="mt-1 w-full rounded border p-2"
        />
      </label>

      <label className="block text-sm">
        Wall type
        <select
          value={wallType}
          onChange={(e) =>
            setWallType(e.target.value as "plaster" | "concrete")
          }
          className="mt-1 w-full rounded border p-2"
        >
          <option value="plaster">Plasterboard</option>
          <option value="concrete">Concrete / brick (+€10)</option>
        </select>
      </label>

      <button
        onClick={handleAdd}
        className="w-full rounded-xl bg-cyan-600 py-2 text-white font-semibold"
      >
        Add to quote
      </button>
    </div>
  );
}
