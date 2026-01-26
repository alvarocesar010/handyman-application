"use client";

import { useState } from "react";
import { QuoteFormProps } from "@/components/Quote/types";

export default function BlindForm({ onAddItem }: QuoteFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [insideRecess, setInsideRecess] = useState(true);

  function handleAdd() {
    onAddItem({
      type: "roller_blind",
      label: "Blind installation",
      quantity,
      unitPrice: insideRecess ? 45 : 55,
      unitDurationMinutes: 40,
      metadata: {
        serviceCategory: "curtain_installation",
        insideRecess,
      },
    });
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Blind installation</h3>

      <input
        type="number"
        min={1}
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="w-full rounded border p-2"
      />

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={insideRecess}
          onChange={(e) => setInsideRecess(e.target.checked)}
        />
        Installed inside recess
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
