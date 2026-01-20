"use client";

import { useState } from "react";
import AdminBookingCard from ".";

import type { AdminBooking } from "./types";

export default function ConfirmedDayGroup({
  label,
  items,
}: {
  label: string;
  items: AdminBooking[];
}) {
  const [open, setOpen] = useState(false);
  const sortedItems = [...items].sort((a, b) => {
    if (!a.startTime && !b.startTime) return 0;
    if (!a.startTime) return 1;
    if (!b.startTime) return -1;

    return a.startTime.localeCompare(b.startTime);
  });

  return (
    <div className="rounded-lg border bg-white">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span className="font-semibold text-slate-900">{label}</span>
        <span className="text-sm text-slate-500">{items.length}</span>
      </button>

      {open && (
        <div className="divide-y">
          {sortedItems.map((b) => (
            <AdminBookingCard key={b._id} booking={b} />
          ))}
        </div>
      )}
    </div>
  );
}
