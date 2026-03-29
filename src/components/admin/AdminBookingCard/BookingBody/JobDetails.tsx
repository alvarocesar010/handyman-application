import { useState } from "react";
import { AdminBooking } from "../types";

type EditorValues = {
  serviceDate: string;

  budget: string;
  startTime: string;
  durationMinutes: string;

  amountReceived: string;
  tipReceived: string;
  finishTime: string;

  adminNotes: string;

  status: AdminBooking["status"];
};

const ComponentName = ({ booking }: { booking: AdminBooking }) => {
  const [values, setValues] = useState<EditorValues>({
    serviceDate: booking.serviceDate ?? "",

    budget: booking.budget?.toString() ?? "",
    startTime: booking.startTime ?? "",
    durationMinutes: booking.durationMinutes?.toString() ?? "",

    amountReceived: booking.amountReceived?.toString() ?? "",
    tipReceived: booking.tipReceived?.toString() ?? "",
    finishTime: booking.finishTime ?? "",

    adminNotes: booking.adminNotes ?? "",

    status: booking.status,
  });
  return (
    <div className="w-full rounded-xl border border-slate-400 bg-white shadow-sm p-4 space-y-4">
      <label className="text-s text-slate-700 space-y-1">
        <p>Status</p>
        <select
          name="status"
          value={values.status}
          onChange={(e) =>
            setValues((p) => ({
              ...p,
              status: e.target.value as AdminBooking["status"],
            }))
          }
          className="w-full rounded-md border border-slate-300 px-2 py-2 text-sm"
        >
          <option value="new">new</option>
          <option value="pending">pending</option>
          <option value="confirmed">confirmed</option>
          <option value="done">done</option>
          <option value="cancelled">cancelled</option>
        </select>
      </label>
    </div>
  );
};

export default ComponentName;
