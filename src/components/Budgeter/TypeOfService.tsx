import { useContext } from "react";
import { BudgeterContext } from "@/context/budgeter";

export default function Start() {
  const [, dispatch] = useContext(BudgeterContext);

  //   const typeOfService = () => {};

  return (
    <div>
      <p className="font-bold my-2">What type of service would you like?</p>
      <button
        className="bg-slate-400 py-2 px-4 rounded-2xl"
        onClick={() => dispatch({ type: "NEXT_STAGE" })}
      >
        Door Supplied and Fitted
      </button>
      <button
        className="bg-slate-400 py-2 px-4 rounded-2xl"
        onClick={() => dispatch({ type: "NEXT_STAGE" })}
      >
        Fit-only
      </button>
    </div>
  );
}
