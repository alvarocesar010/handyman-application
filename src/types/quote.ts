export type FurnitureType = "chest_drawers" | "wardrobe" | "bed";

export type QuoteItem = {
  id: string;
  type: FurnitureType;
  label: string;
  quantity: number;
  unitPrice: number;
  unitDurationMinutes: number;
  metadata: Record<string, unknown>;
};
