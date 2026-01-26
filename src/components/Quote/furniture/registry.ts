// src/components/Quote/furniture/registry.ts
import { Package, DoorClosed, BedDouble } from "lucide-react";
import type { QuoteRegistryItem } from "../registry.types";

import BedForm from "./BedForm";
import ChestOfDrawersForm from "./ChestOfDrawersForm";
import WardrobeForm from "./WardrobeForm";

export const FURNITURE_REGISTRY: QuoteRegistryItem[] = [
  {
    type: "chest_drawers",
    label: "Chest of drawers installation",
    title: "Chest of drawers",
    summary: "Flat-pack or pre-built units",
    icon: Package,
    Form: ChestOfDrawersForm,
  },
  {
    type: "wardrobe",
    label: "Wardrobe installation",
    title: "Wardrobe",
    summary: "Single, double or sliding wardrobes",
    icon: DoorClosed,
    Form: WardrobeForm,
  },
  {
    type: "bed",
    label: "Bed installation",
    title: "Bed",
    summary: "Single, double or king-size beds",
    icon: BedDouble,
    Form: BedForm,
  },
];
