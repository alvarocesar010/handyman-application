export type FurnitureType = "chest_drawers" | "wardrobe" | "bed";

export type CurtainType = "roller_blind" | "curtain_pole" | "curtain_rail";

export type QuoteItemType = FurnitureType | CurtainType;

export type QuoteItem = {
  id: string;
  type: QuoteItemType;
  label: string;
  quantity: number;
  unitPrice: number;
  unitDurationMinutes: number;
  metadata: Record<string, unknown>;
};
