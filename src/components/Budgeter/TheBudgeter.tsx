import { useContext } from "react";

import Start from "./Start";
import { BudgeterContext } from "@/context/budgeter";
import TypeOfService from "./TypeOfService";
import Items from "./Items";

export default function TheBudgeter() {
  const [state] = useContext(BudgeterContext);
  return (
    <div className="w-full align-middle">
      {state.quoteStage === "Start" && <Start />}
      {state.quoteStage === "TypeOfService" && <TypeOfService />}
      {state.quoteStage === "SuppliedFitted" && <Items />}
    </div>
  );
}
