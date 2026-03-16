import { useContext } from "react";

import Start from "./Start";
import { BudgeterContext } from "@/context/budgeter";
import TypeOfService from "./TypeOfService";

export default function TheBudgeter() {
  const [state] = useContext(BudgeterContext);
  return (
    <>
      {state.quoteStage === "Start" && <Start />}
      {state.quoteStage === "Category" && <TypeOfService />}
    </>
  );
}
