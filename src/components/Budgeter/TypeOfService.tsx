import { useContext } from "react";
import { BudgeterContext } from "@/context/budgeter";
import { Drill, ShoppingCart } from "lucide-react";

export default function TypeOfService() {
  const [, dispatch] = useContext(BudgeterContext);

  //   const typeOfService = () => {};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-2 text-center">
      <div className="w-full max-w-md space-y-2">
        {/* Title */}
        <p className="text-xl font-semibold text-slate-900">
          What type of service would you like?
        </p>

        {/* Options */}
        <div className="flex flex-col gap-4">
          <button
            onClick={() => dispatch({ type: "SUP_FIT" })}
            className="flex items-center justify-center gap-3 w-full py-4 px-3 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition"
          >
            <ShoppingCart className="w-5 h-5 text-slate-700" />
            <span className="font-medium text-slate-800">
              Door Supplied and Fitted
            </span>
          </button>

          <button
            onClick={() => dispatch({ type: "NEXT_STAGE" })}
            className="flex items-center justify-center gap-3 w-full py-4 px-5 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition"
          >
            <Drill className="w-5 h-5 text-slate-700" />
            <span className="font-medium text-slate-800">Fit-only</span>
          </button>
        </div>
      </div>
    </div>
  );
}
