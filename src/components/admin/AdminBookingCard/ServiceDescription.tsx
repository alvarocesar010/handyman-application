"use client";

import ActionButtons from "@/components/Buttons/ActionButtons";
import { updateBookingAction } from "@/lib/actions/updateBooking";
import { useState } from "react";

type TypeDescription = {
  description?: string;
  bookingId: string;
};

const ServiceDescription = ({ description, bookingId }: TypeDescription) => {
  const [value, setValue] = useState(description ?? "");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    await updateBookingAction({
      id: bookingId,
      updates: {
        adminNotes: value,
      },
      setLoading,
    });

    setEditing(false);
  };

  return (
    <div className="w-full rounded-xl border border-slate-400 bg-white shadow-sm p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700 tracking-wide">
          Service Description
        </h3>

        <ActionButtons
          editing={editing}
          loading={loading}
          onEdit={() => setEditing(true)}
          onSave={handleSubmit}
          onCancel={() => {
            setEditing(false);
            setValue(description ?? "");
          }}
        />
      </div>

      {/* Content */}
      <div className="rounded-lg bg-slate-100 border border-slate-300 p-3">
        {editing ? (
          <textarea
            rows={10}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Write notes about this service..."
            className="
            w-full rounded-md border border-slate-200 bg-white
            px-3 py-2 text-sm text-slate-800
            resize-none
            focus:outline-none focus:ring-2 focus:ring-slate-900
            transition
          "
          />
        ) : (
          <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
            {value || "No description added yet."}
          </p>
        )}
      </div>
    </div>
  );
};

export default ServiceDescription;
