// src/components/Quote/registry.types.ts
import type { ComponentType } from "react";
import type { QuoteItemType, QuoteItem } from "@/types/quote";

export type QuoteRegistryItem = {
  type: QuoteItemType;
  label: string;
  title: string;
  summary: string;
  icon: ComponentType<{ className?: string }>;
  Form: ComponentType<{
    onAddItem: (item: Omit<QuoteItem, "id">) => void;
  }>;
};
