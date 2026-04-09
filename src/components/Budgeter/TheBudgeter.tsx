import { useContext } from "react";

import Start from "./Start";
import { BudgeterContext } from "@/context/budgeter";
import TypeOfService from "./TypeOfService";
import Items from "./Items";
import CommandButtons from "./CommandButtons";

export default function TheBudgeter() {
  const [state] = useContext(BudgeterContext);

  const isOverlay = state.quoteStage !== "Start";
  console.log(state);
  return (
    <div>
      {!isOverlay && <Start />}

      {isOverlay && (
        <div className="fixed inset-0 z-50">
          {/* BACKDROP */}
          <div className="absolute inset-0 bg-black/40" />
          {/* CONTENT */}
          <div className="relative h-full bg-white flex flex-col">
            {/* Header */}
            <CommandButtons />

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4">
              {state.quoteStage === "TypeOfService" && <TypeOfService />}
              {state.quoteStage === "SuppliedFitted" && <Items />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
