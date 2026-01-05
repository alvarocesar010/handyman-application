import type { ComponentType } from "react";
import { FurnitureType } from "@/types/quote";
import { FurnitureFormProps } from "./types";

import ChestOfDrawersForm from "./ChestOfDrawersForm";
import WardrobeForm from "./WardrobeForm";
import BedForm from "./BedForm";

import { Package, DoorClosed, BedDouble } from "lucide-react";

export type FurnitureDefinition = {
  type: FurnitureType;
  title: string;
  summary: string;
  icon: ComponentType<{ className?: string }>;
  Form: ComponentType<FurnitureFormProps>;
};

export const FURNITURE_REGISTRY: FurnitureDefinition[] = [
  {
    type: "chest_drawers",
    title: "Chest of drawers",
    summary: "Flat-pack or pre-built units",
    icon: Package,
    Form: ChestOfDrawersForm,
  },
  {
    type: "wardrobe",
    title: "Wardrobe",
    summary: "Single, double, or sliding wardrobes",
    icon: DoorClosed,
    Form: WardrobeForm,
  },
  {
    type: "bed",
    title: "Bed",
    summary: "Single, double, king-size beds",
    icon: BedDouble,
    Form: BedForm,
  },
];
