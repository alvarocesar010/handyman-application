"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QuoteItem, FurnitureType } from "@/types/quote";
import { calculateQuoteTotals } from "@/lib/pricing/calculator";
import { FURNITURE_REGISTRY } from "./furniture/registry";
import FurniturePickerModal from "./FurniturePickerModal";

type Step = "select" | "details" | "eircode";

export default function QuoteBuilder() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("select");
  const [selectedFurniture, setSelectedFurniture] =
    useState<FurnitureType | null>(null);

  const [items, setItems] = useState<QuoteItem[]>([]);
  const [eircode, setEircode] = useState("");
  const [travelCost, setTravelCost] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  function handleAddItem(item: Omit<QuoteItem, "id">) {
    setItems((prev) => [...prev, { id: crypto.randomUUID(), ...item }]);
    setStep("select");
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  async function calculateDistance() {
    if (!eircode) return;
    setLoading(true);

    const res = await fetch("/api/distance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eircode }),
    });

    setLoading(false);
    if (!res.ok) return;

    const data = await res.json();
    setTravelCost(data.cost);
  }

  const totals =
    travelCost != null && items.length > 0
      ? calculateQuoteTotals(items, travelCost)
      : null;

  function handleBook() {
    if (!totals) return;

    router.push(
      `/booking?quote=${encodeURIComponent(
        btoa(
          JSON.stringify({
            items,
            travelCost: totals.adjustedTravelCost,
            total: totals.finalTotal,
            eircode,
          })
        )
      )}`
    );
  }

  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm space-y-6">
      <div className="rounded-xl bg-cyan-50 p-4">
        <h2 className="text-xl font-bold">Get your quote now</h2>
        <p className="text-sm text-slate-600">
          Instant price. No obligation. Final price confirmed before arrival.
        </p>
      </div>

      {step === "select" && (
        <FurniturePickerModal
          ctaText={items.length === 0 ? "Choose furniture" : "Add another item"}
          onChange={(type) => {
            setSelectedFurniture(type);
            setStep("details");
          }}
        />
      )}

      {step === "details" &&
        selectedFurniture &&
        (() => {
          const def = FURNITURE_REGISTRY.find(
            (f) => f.type === selectedFurniture
          );
          if (!def) return null;
          const Form = def.Form;
          return <Form onAddItem={handleAddItem} />;
        })()}

      {items.length > 0 && (
        <div className="rounded-xl border p-4 space-y-2">
          <h3 className="font-semibold">Your quote</h3>

          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>
                {item.quantity}× {item.label}
              </span>
              <span>€{item.unitPrice * item.quantity}</span>
              <button
                onClick={() => removeItem(item.id)}
                className="text-xs text-red-500"
              >
                Remove
              </button>
            </div>
          ))}

          {totals && (
            <>
              <div className="flex justify-between text-sm">
                <span>Travel</span>
                <span>€{totals.adjustedTravelCost}</span>
              </div>

              <div className="flex justify-between font-bold border-t pt-2">
                <span>Total</span>
                <span>€{totals.finalTotal}</span>
              </div>
            </>
          )}

          <div className="flex gap-3 pt-3">
            <button
              onClick={() => setStep("eircode")}
              className="flex-1 rounded-xl bg-cyan-600 py-3 text-white font-semibold"
            >
              Set location
            </button>
          </div>

          {totals && (
            <button
              onClick={handleBook}
              className="w-full rounded-xl bg-emerald-600 py-3 text-white font-semibold mt-3"
            >
              Book now
            </button>
          )}
        </div>
      )}

      {step === "eircode" && (
        <div className="space-y-3">
          <input
            value={eircode}
            onChange={(e) => setEircode(e.target.value.toUpperCase())}
            placeholder="Eircode (e.g. D03 K882)"
            className="border p-3 rounded w-full"
          />
          <button
            onClick={calculateDistance}
            className="w-full rounded-xl bg-cyan-600 py-3 text-white font-semibold"
          >
            {loading ? "Calculating..." : "Calculate travel"}
          </button>
        </div>
      )}
    </section>
  );
}
