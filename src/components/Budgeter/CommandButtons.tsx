import { BudgeterContext } from "@/context/budgeter";
import { ArrowBigLeft, X } from "lucide-react";
import { useContext } from "react";

export default function CommandButtons() {
  const [, dispatch] = useContext(BudgeterContext);

  return (
    <div className="p-4 flex justify-between">
      <button onClick={() => dispatch({ type: "PREVIOUS" })}>
        <ArrowBigLeft />
      </button>
      <button
        className="flex items-center justify-center w-8 h-8 rounded-full bg-red-400 hover:bg-red-500 transition"
        onClick={() => dispatch({ type: "CLOSE_TAB" })}
      >
        <X />
      </button>
    </div>
  );
}
