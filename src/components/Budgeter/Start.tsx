import { useContext } from "react";
import { BudgeterContext } from "@/context/budgeter";

export default function Start() {
  const [, dispatch] = useContext(BudgeterContext);

  return (
    <div>
      <p className="font-bold my-2">Click on button to start your quote</p>
      <button
        className="bg-slate-400 py-2 px-4 rounded-2xl"
        onClick={() => dispatch({ type: "TYPE_OF_SERVICES" })}
      >
        Start
      </button>
    </div>
  );
}
