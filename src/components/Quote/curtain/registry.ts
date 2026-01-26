// src/components/Quote/curtain/registry.ts
import { Minus, SlidersHorizontal } from "lucide-react";
import type { QuoteRegistryItem } from "../registry.types";

import RailForm from "./RailForm";
import PoleForm from "./PoleForm";

export const CURTAIN_REGISTRY: QuoteRegistryItem[] = [
  {
    type: "curtain_rail",
    label: "Curtain rail installation",
    title: "Curtain rail",
    summary: "Wall or ceiling mounted rails",
    icon: Minus,
    Form: RailForm,
  },
  {
    type: "curtain_pole",
    label: "Curtain pole installation",
    title: "Curtain pole",
    summary: "Metal or wooden poles",
    icon: SlidersHorizontal,
    Form: PoleForm,
  },
];
