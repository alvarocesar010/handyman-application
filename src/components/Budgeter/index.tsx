"use client";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import Start from "./Start";
import { BudgeterContext } from "@/context/budgeter";

type ServiceCategory =
  | "Internal Doors Installation"
  | "Shower Doors Installation"
  | "Handles";

const CATEGORY_DATA: Record<
  ServiceCategory,
  { price: number; canPaint: boolean; canDispose: boolean }
> = {
  "Internal Doors Installation": {
    price: 150,
    canPaint: true,
    canDispose: true,
  },
  "Shower Doors Installation": {
    price: 170,
    canPaint: false,
    canDispose: true,
  },
  Handles: { price: 25, canPaint: false, canDispose: false },
};
export default function IntegratedBudgeter() {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<ServiceCategory>(
    "Internal Doors Installation",
  );
  const [quantity, setQuantity] = useState(1);
  const [dispose, setDispose] = useState("no");
  const [paint, setPaint] = useState("no");

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    eircode: "",
    date: "",
    time: "",
  });

  const selectedData = CATEGORY_DATA[category];
  const DISPOSAL_RATE = 30;
  const PAINT_RATE = 60;
  const CALL_OUT_FEE = 30;

  const totalBase = quantity * selectedData.price;
  const totalDisposal = dispose === "yes" ? quantity * DISPOSAL_RATE : 0;
  const totalPaint =
    paint === "yes" && selectedData.canPaint ? quantity * PAINT_RATE : 0;
  const grandTotal = totalBase + totalDisposal + totalPaint + CALL_OUT_FEE;

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    // Constructing the formal description for the DB
    const quoteSummary = `PROPOSAL: ${quantity}x ${category}. \nInstallation: €${totalBase} \nDisposal: ${dispose === "yes" ? "Yes (€" + totalDisposal + ")" : "No"} \nPainting: ${paint === "yes" ? "Yes (€" + totalPaint + ")" : "No"} \nCall-out Fee: €30 \nTOTAL QUOTED: €${grandTotal}`;

    const fd = new FormData();
    fd.append("service", category.toLowerCase().replace(/\s+/g, "-"));
    fd.append("name", customer.name);
    fd.append("phone", customer.phone);
    fd.append("address", customer.address);
    fd.append("eircode", customer.eircode);
    fd.append("date", customer.date);
    fd.append("time", customer.time);
    fd.append("description", quoteSummary);

    try {
      const res = await fetch("/api/booking", { method: "POST", body: fd });
      if (res.ok) {
        toast.success("Booking Request Sent!");
        // Optional: set a 'success' state to show a Thank You message
      } else {
        const data = await res.json();
        toast.error(data.error || "Submission failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error. Please try again.");
    }
  };
  const [state] = useContext(BudgeterContext);

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-2xl shadow-xl border border-slate-100">
      {state.quoteStage === "Start" && <Start />}
      {state.quoteStage === "Category" && <p>Choose ypur door</p>}

      {/* Progress Header */}
      <div className="flex justify-between mb-8 px-4">
        <div
          className={`flex flex-col items-center ${step >= 1 ? "text-cyan-600" : "text-slate-300"}`}
        >
          <div
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${step >= 1 ? "border-cyan-600" : "border-slate-200"}`}
          >
            1
          </div>
          <span className="text-xs mt-1 font-medium">Budget</span>
        </div>
        <div className="flex-1 h-px bg-slate-200 mt-4 mx-2"></div>
        <div
          className={`flex flex-col items-center ${step >= 2 ? "text-cyan-600" : "text-slate-300"}`}
        >
          <div
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${step >= 2 ? "border-cyan-600" : "border-slate-200"}`}
          >
            2
          </div>
          <span className="text-xs mt-1 font-medium">Details</span>
        </div>
      </div>

      {step === 1 ? (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-800">
            1. Calculate Your Quote
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Service Type
              </label>
              <select
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg"
                value={category}
                onChange={(e) => setCategory(e.target.value as ServiceCategory)}
              >
                {Object.keys(CATEGORY_DATA).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>

            {selectedData.canDispose && (
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium">
                  Dispose of old items?
                </span>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setDispose("yes")}
                    className={`px-4 py-1 rounded-md text-sm ${dispose === "yes" ? "bg-cyan-600 text-white" : "bg-white border"}`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setDispose("no")}
                    className={`px-4 py-1 rounded-md text-sm ${dispose === "no" ? "bg-cyan-600 text-white" : "bg-white border"}`}
                  >
                    No
                  </button>
                </div>
              </div>
            )}

            {selectedData.canPaint && (
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium">
                  Professional Painting?
                </span>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setPaint("yes")}
                    className={`px-4 py-1 rounded-md text-sm ${paint === "yes" ? "bg-cyan-600 text-white" : "bg-white border"}`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaint("no")}
                    className={`px-4 py-1 rounded-md text-sm ${paint === "no" ? "bg-cyan-600 text-white" : "bg-white border"}`}
                  >
                    No
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-cyan-50 p-4 rounded-xl border border-cyan-100">
            <div className="flex justify-between font-bold text-lg text-cyan-900">
              <span>Estimated Total:</span>
              <span>€{grandTotal}</span>
            </div>
            <p className="text-[10px] text-cyan-700 mt-1">
              *Includes €30 call-out/admin fee
            </p>
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full bg-cyan-700 text-white py-4 rounded-xl font-bold hover:bg-cyan-800 transition shadow-lg shadow-cyan-100"
          >
            Continue to Booking
          </button>
        </div>
      ) : (
        <form onSubmit={handleBooking} className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800">
            2. Finalize Your Booking
          </h2>
          <div className="p-3 bg-slate-50 rounded-lg border border-dashed border-slate-300 text-sm">
            <strong>Summary:</strong> {quantity}x {category} —{" "}
            <span className="text-cyan-700 font-bold">€{grandTotal}</span>
          </div>

          <input
            placeholder="Full Name"
            className="w-full p-3 border rounded-lg"
            required
            onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
          />
          <input
            placeholder="Phone Number"
            className="w-full p-3 border rounded-lg"
            required
            onChange={(e) =>
              setCustomer({ ...customer, phone: e.target.value })
            }
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">
                Preferred Date
              </label>
              <input
                type="date"
                className="w-full p-3 border rounded-lg"
                required
                onChange={(e) =>
                  setCustomer({ ...customer, date: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">
                Preferred Time
              </label>
              <input
                type="time"
                className="w-full p-3 border rounded-lg"
                required
                onChange={(e) =>
                  setCustomer({ ...customer, time: e.target.value })
                }
              />
            </div>
          </div>

          <input
            placeholder="Dublin Address"
            className="w-full p-3 border rounded-lg"
            required
            onChange={(e) =>
              setCustomer({ ...customer, address: e.target.value })
            }
          />
          <input
            placeholder="Eircode (D01 F5P2)"
            className="w-full p-3 border rounded-lg uppercase"
            required
            onChange={(e) =>
              setCustomer({ ...customer, eircode: e.target.value })
            }
          />

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 py-3 border rounded-lg text-slate-500 hover:bg-slate-50"
            >
              Back
            </button>
            <button
              type="submit"
              className="flex-[2] py-3 bg-cyan-700 text-white rounded-lg font-bold hover:bg-cyan-800 transition"
            >
              Request Booking
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
