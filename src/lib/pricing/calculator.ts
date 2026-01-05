import { QuoteItem } from "@/types/quote";
import { FURNITURE_PRICING } from "./furniture";
import { roundUpToNext5 } from "./rounding";

export function calculateChestOfDrawers(drawers: number) {
  const r = FURNITURE_PRICING.chest_drawers;

  return {
    type: "chest_drawers" as const,
    label: r.label,
    unitPrice: r.basePrice + drawers * r.pricePerDrawer,
    unitDurationMinutes: r.baseMinutes + drawers * r.minutesPerDrawer,
    metadata: { drawers },
  };
}

export function calculateWardrobe(doors: number) {
  const r = FURNITURE_PRICING.wardrobe;

  return {
    type: "wardrobe" as const,
    label: r.label,
    unitPrice: r.basePrice + doors * r.pricePerDoor,
    unitDurationMinutes: r.baseMinutes + doors * r.minutesPerDoor,
    metadata: { doors },
  };
}

export function calculateBed(size: "single" | "double" | "king") {
  const r = FURNITURE_PRICING.bed;

  return {
    type: "bed" as const,
    label: `${r.label} (${size})`,
    unitPrice: Math.round(r.basePrice * r.sizeMultiplier[size]),
    unitDurationMinutes: Math.round(r.baseMinutes * r.sizeMultiplier[size]),
    metadata: { size },
  };
}

export function calculateQuoteTotals(items: QuoteItem[], travelCost: number) {
  const itemsTotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  const rawTotal = itemsTotal + travelCost;
  const finalTotal = roundUpToNext5(rawTotal);
  const adjustment = finalTotal - rawTotal;

  return {
    itemsTotal,
    adjustedTravelCost: travelCost + adjustment,
    finalTotal,
    roundingAdjustment: adjustment,
  };
}
