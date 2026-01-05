import { QuoteItem } from "@/types/quote";

export type FurnitureFormProps = {
  onAddItem: (item: Omit<QuoteItem, "id">) => void;
};
