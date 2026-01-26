"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { QuoteItem, QuoteItemType } from "@/types/quote";
import { calculateQuoteTotals } from "@/lib/pricing/calculator";

import QuoteItemPickerModal from "./QuoteItemPickerModal";
import { QUOTE_ITEM_REGISTRY } from "./registry";

type Step = "idle" | "picker" | "details" | "location";

export default function QuoteBuilder() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("idle");
  const [selectedType, setSelectedType] = useState<QuoteItemType | null>(null);

  const [items, setItems] = useState<QuoteItem[]>([]);
  const [eircode, setEircode] = useState("");
  const [travelCost, setTravelCost] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedDef = selectedType
    ? QUOTE_ITEM_REGISTRY.find((i) => i.type === selectedType) ?? null
    : null;

  function handleAddItem(item: Omit<QuoteItem, "id">) {
    setItems((prev) => [...prev, { id: crypto.randomUUID(), ...item }]);
    setSelectedType(null);
    setStep("location"); // 🔥 APÓS ITEM → LOCATION
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  async function calculateLocation() {
    if (!eircode) return;

    setLoading(true);

    const res = await fetch("/api/distance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eircode }),
    });

    setLoading(false);
    if (!res.ok) return;

    const data = (await res.json()) as { cost: number };
    setTravelCost(data.cost);
    setStep("idle"); // 🔥 volta pro estado neutro
  }

  const totals =
    items.length > 0 && travelCost !== null
      ? calculateQuoteTotals(items, travelCost)
      : null;

  function handleBook() {
    if (!totals) return;

    router.push(
      `/booking?quote=${encodeURIComponent(
        btoa(
          JSON.stringify({
            items,
            eircode,
            travelCost,
            total: totals.finalTotal,
          })
        )
      )}`
    );
  }

  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="rounded-xl bg-cyan-50 p-4">
        <h2 className="text-xl font-bold">Get your quote now</h2>
        <p className="text-sm text-slate-600">
          Instant price. Final price confirmed before arrival.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => setStep("picker")}
          className="rounded-xl bg-cyan-700 px-5 py-3 text-white font-semibold"
        >
          {step === "details" ? "Change item" : "Add item"}
        </button>

        {items.length > 0 && (
          <button
            onClick={() => setStep("location")}
            className="flex-1 rounded-xl bg-slate-900 py-3 text-white font-semibold"
          >
            {travelCost !== null ? "Change location" : "Set location"}
          </button>
        )}
      </div>

      {/* Picker */}
      {step === "picker" && (
        <QuoteItemPickerModal
          items={QUOTE_ITEM_REGISTRY}
          title="Select item"
          ctaText="Select"
          onChange={(type) => {
            setSelectedType(type);
            setStep("details");
          }}
        />
      )}

      {/* Item form (NUNCA ESCONDE A LISTA) */}
      {step === "details" && selectedDef && (
        <div className="space-y-3">
          <p className="text-sm font-semibold">{selectedDef.label}</p>
          <selectedDef.Form onAddItem={handleAddItem} />
        </div>
      )}

      {/* Location */}
      {step === "location" && (
        <div className="space-y-3">
          <input
            value={eircode}
            onChange={(e) => setEircode(e.target.value.toUpperCase())}
            placeholder="Eircode (e.g. D01 Y313)"
            className="w-full rounded border p-3"
          />

          <button
            onClick={calculateLocation}
            className="w-full rounded-xl bg-cyan-600 py-3 text-white font-semibold"
          >
            {loading ? "Calculating..." : "Calculate travel"}
          </button>
        </div>
      )}

      {/* Quote list (SEMPRE VISÍVEL SE TIVER ITEM) */}
      {items.length > 0 && (
        <div className="rounded-xl border p-4 space-y-3">
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

          {travelCost !== null && (
            <div className="flex justify-between text-sm">
              <span>Call-out fee</span>
              <span>€{travelCost}</span>
            </div>
          )}

          {totals && (
            <>
              <div className="flex justify-between font-bold border-t pt-2">
                <span>Total</span>
                <span>€{totals.finalTotal}</span>
              </div>

              <button
                onClick={handleBook}
                className="w-full rounded-xl bg-emerald-600 py-3 text-white font-semibold"
              >
                Book now
              </button>
            </>
          )}
        </div>
      )}

      {/* Location summary */}
      {travelCost !== null && step !== "location" && (
        <div className="flex justify-between rounded-lg bg-emerald-50 p-3 text-xs text-emerald-800">
          <span>
            <strong>Location:</strong> {eircode}
          </span>
          <button onClick={() => setStep("location")} className="underline">
            Change location
          </button>
        </div>
      )}
    </section>
  );
}
