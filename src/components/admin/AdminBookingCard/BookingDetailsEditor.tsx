"use client";

import { useMemo, useState } from "react";
import type { AdminBooking } from "./types";
import { calcDurationMinutes, formatEuro, minutesToHM } from "./utils";

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

export default function BookingDetailsEditor({
  booking,
  onClose,
}: {
  booking: AdminBooking;
  onClose: () => void;
}) {
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

  const actualMinutes = useMemo(() => {
    return calcDurationMinutes(values.startTime, values.finishTime);
  }, [values.startTime, values.finishTime]);

  const estimatedHM = useMemo(() => {
    const n = Number(values.durationMinutes);
    if (!Number.isFinite(n) || n <= 0) return "—";
    return minutesToHM(n);
  }, [values.durationMinutes]);

  const avgPerHour = useMemo(() => {
    const received = Number(values.amountReceived);
    if (!Number.isFinite(received) || received <= 0) return "—";
    if (actualMinutes == null || actualMinutes <= 0) return "—";
    const hours = actualMinutes / 60;
    return `${formatEuro(received / hours)}/h`;
  }, [values.amountReceived, actualMinutes]);

  return (
    <form
      action="/api/admin/bookings/update"
      method="post"
      className="mt-4 space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-3"
    >
      <input type="hidden" name="id" value={booking._id} />

      {/* ✅ save computed duration */}
      <input
        type="hidden"
        name="actualDurationMinutes"
        value={actualMinutes == null ? "" : String(actualMinutes)}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Status">
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
            <option value="pending">pending</option>
            <option value="confirmed">confirmed</option>
            <option value="done">done</option>
            <option value="cancelled">cancelled</option>
          </select>
        </Field>

        <Field label="Service date (real)">
          <input
            type="date"
            name="serviceDate"
            value={values.serviceDate}
            onChange={(e) =>
              setValues((p) => ({ ...p, serviceDate: e.target.value }))
            }
            className="w-full rounded-md border border-slate-300 px-2 py-2 text-sm"
          />
        </Field>

        <Field label="Budget (€)">
          <input
            type="number"
            step="1"
            name="budget"
            value={values.budget}
            onChange={(e) =>
              setValues((p) => ({ ...p, budget: e.target.value }))
            }
            className="w-full rounded-md border border-slate-300 px-2 py-2 text-sm"
            min={0}
          />
        </Field>

        <Field label="Time (start)">
          <input
            type="time"
            name="startTime"
            value={values.startTime}
            onChange={(e) =>
              setValues((p) => ({ ...p, startTime: e.target.value }))
            }
            className="w-full rounded-md border border-slate-300 px-2 py-2 text-sm"
          />
        </Field>

        <Field label={`Estimated duration (min) (${estimatedHM})`}>
          <input
            type="number"
            step="15"
            name="durationMinutes"
            value={values.durationMinutes}
            onChange={(e) =>
              setValues((p) => ({ ...p, durationMinutes: e.target.value }))
            }
            className="w-full rounded-md border border-slate-300 px-2 py-2 text-sm"
            min={0}
          />
        </Field>

        <Field label="Amount received (€)">
          <input
            type="number"
            step="1"
            name="amountReceived"
            value={values.amountReceived}
            onChange={(e) =>
              setValues((p) => ({ ...p, amountReceived: e.target.value }))
            }
            className="w-full rounded-md border border-slate-300 px-2 py-2 text-sm"
            min={0}
          />
        </Field>

        <Field label="Tip received (€)">
          <input
            type="number"
            step="1"
            name="tipReceived"
            value={values.tipReceived}
            onChange={(e) =>
              setValues((p) => ({ ...p, tipReceived: e.target.value }))
            }
            className="w-full rounded-md border border-slate-300 px-2 py-2 text-sm"
            min={0}
          />
        </Field>

        <Field label="Time (finish)">
          <input
            type="time"
            name="finishTime"
            value={values.finishTime}
            onChange={(e) =>
              setValues((p) => ({ ...p, finishTime: e.target.value }))
            }
            className="w-full rounded-md border border-slate-300 px-2 py-2 text-sm"
          />
        </Field>

        <Field label="Time spent (auto)">
          <div className="w-full rounded-md border border-slate-200 bg-white px-2 py-2 text-sm text-slate-900">
            {actualMinutes == null ? "—" : minutesToHM(actualMinutes)}
          </div>
        </Field>

        <Field label="Avg / hour">
          <div className="w-full rounded-md border border-slate-200 bg-white px-2 py-2 text-sm text-slate-900">
            {avgPerHour}
          </div>
        </Field>
      </div>

      <Field label="Notes about the service">
        <textarea
          name="adminNotes"
          rows={3}
          value={values.adminNotes}
          onChange={(e) =>
            setValues((p) => ({ ...p, adminNotes: e.target.value }))
          }
          className="w-full rounded-md border border-slate-300 px-2 py-2 text-sm"
        />
      </Field>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-cyan-700 px-3 py-2 text-sm text-white hover:bg-cyan-800"
        >
          Save details
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-slate-700">{label}</label>
      {children}
    </div>
  );
}
