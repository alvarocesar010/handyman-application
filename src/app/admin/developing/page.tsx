"use client";

import { BudgeterProvider } from "@/context/budgeter";
import TheBudgeter from "@/components/Budgeter/TheBudgeter";

export default function Page() {
  return (
    <BudgeterProvider>
      <TheBudgeter />
    </BudgeterProvider>
  );
}
