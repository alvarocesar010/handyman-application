"use client";

import { useMemo, useState } from "react";
import { AdminBooking } from "../types";
import { calcDurationMinutes, minutesToHM } from "../utils";
import ActionButtons from "@/components/Buttons/ActionButtons";
import { updateBookingAction } from "@/lib/actions/updateBooking";
import { useRouter } from "next/navigation";

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

const JobDetails = ({ booking }: { booking: AdminBooking }) => {
  const initialValues: EditorValues = {
    serviceDate: booking.serviceDate ?? "",

    budget: booking.budget?.toString() ?? "",
    startTime: booking.startTime ?? "",
    durationMinutes: booking.durationMinutes?.toString() ?? "",

    amountReceived: booking.amountReceived?.toString() ?? "",
    tipReceived: booking.tipReceived?.toString() ?? "",
    finishTime: booking.finishTime ?? "",

    adminNotes: booking.adminNotes ?? "",

    status: booking.status,
  };

  const [values, setValues] = useState<EditorValues>(initialValues);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const actualMinutes = useMemo(() => {
    return calcDurationMinutes(values.startTime, values.finishTime);
  }, [values.startTime, values.finishTime]);

  const handleSubmit = async () => {
    await updateBookingAction({
      id: booking._id,
      updates: {
        serviceDate: values.serviceDate,
        budget: Number(values.budget),
        startTime: values.startTime,
        durationMinutes: Number(values.durationMinutes),
        amountReceived: Number(values.amountReceived),
        tipReceived: Number(values.tipReceived),
        finishTime: values.finishTime,
        adminNotes: values.adminNotes,
        status: values.status,
      },
      setLoading,
    });
    router.refresh();
    setEditing(false);
  };

  const handleCancel = () => {
    setValues(initialValues);
    setEditing(false);
  };

  const inputClass = `
    w-full rounded-md border px-2 py-2 text-sm transition
    ${editing ? "border-slate-300 bg-white" : "border-transparent bg-transparent"}
    disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed
  `;

  return (
    <div className="w-full rounded-xl border border-slate-400 bg-white shadow-sm p-4 space-y-4 flex flex-col">
      <ActionButtons
        editing={editing}
        loading={loading}
        onEdit={() => setEditing(true)}
        onSave={handleSubmit}
        onCancel={handleCancel}
      />
      {/* Status */}
      <label className="space-y-1">
        <p className="text-sm text-slate-700">Status</p>
        <select
          disabled={!editing}
          value={values.status}
          onChange={(e) =>
            setValues((p) => ({
              ...p,
              status: e.target.value as AdminBooking["status"],
            }))
          }
          className={inputClass}
        >
          <option value="new">new</option>
          <option value="pending">pending</option>
          <option value="confirmed">confirmed</option>
          <option value="done">done</option>
          <option value="cancelled">cancelled</option>
        </select>
      </label>
      {/* Service Date */}
      <label className="space-y-1">
        <p className="text-sm text-slate-700">Service Date</p>
        <input
          type="date"
          disabled={!editing}
          value={values.serviceDate}
          onChange={(e) =>
            setValues((p) => ({ ...p, serviceDate: e.target.value }))
          }
          className={inputClass}
        />
      </label>
      {/* Budget */}
      <label className="space-y-1">
        <p className="text-sm text-slate-700">Budget</p>
        <input
          type="number"
          disabled={!editing}
          value={values.budget}
          onChange={(e) => setValues((p) => ({ ...p, budget: e.target.value }))}
          className={inputClass}
          min={0}
        />
      </label>
      {/* Amount received */}
      <label className="space-y-1">
        <p className="text-sm text-slate-700">Amount received:</p>
        <input
          type="number"
          disabled={!editing}
          value={values.amountReceived}
          onChange={(e) =>
            setValues((p) => ({ ...p, amountReceived: e.target.value }))
          }
          className={inputClass}
          min={0}
        />
      </label>
      {/* Tip */}
      <label className="space-y-1">
        <p className="text-sm text-slate-700">Tip:</p>
        <input
          type="number"
          disabled={!editing}
          value={values.tipReceived}
          onChange={(e) =>
            setValues((p) => ({ ...p, tipReceived: e.target.value }))
          }
          className={inputClass}
          min={0}
        />
      </label>
      {/* Start Time */}
      <label className="space-y-1">
        <p className="text-sm text-slate-700">Start</p>
        <input
          type="time"
          disabled={!editing}
          value={values.startTime}
          onChange={(e) =>
            setValues((p) => ({ ...p, startTime: e.target.value }))
          }
          className={inputClass}
        />
      </label>
      {/* Finish Time */}
      <label className="space-y-1">
        <p className="text-sm text-slate-700">Finish</p>
        <input
          type="time"
          disabled={!editing}
          value={values.finishTime}
          onChange={(e) =>
            setValues((p) => ({ ...p, finishTime: e.target.value }))
          }
          className={inputClass}
        />
      </label>
      {/* Duration */}
      <label className="space-y-1">
        <p className="text-sm text-slate-700">Duration estimated</p>
        <input
          disabled
          value={actualMinutes == null ? "—" : minutesToHM(actualMinutes)}
          className="w-full rounded-md border border-slate-200 bg-slate-100 px-2 py-2 text-sm text-slate-900"
        />
      </label>
    </div>
  );
};

export default JobDetails;
