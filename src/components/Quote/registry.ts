// src/components/Quote/registry.ts
import { FURNITURE_REGISTRY } from "./furniture/registry";
import { CURTAIN_REGISTRY } from "./curtain/registry";
import type { QuoteRegistryItem } from "./registry.types";

export const QUOTE_ITEM_REGISTRY: QuoteRegistryItem[] = [
  ...FURNITURE_REGISTRY,
  ...CURTAIN_REGISTRY,
];
