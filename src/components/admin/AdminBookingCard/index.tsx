"use client";

import { useEffect, useState } from "react";
import type { AdminBooking } from "./types";
import BookingHeader from "./BookingHeader";
import BookingBody from "./BookingBody";

export default function AdminBookingCard({
  booking,
}: {
  booking: AdminBooking;
}) {
  const storageKey = `admin:booking:collapsed:${booking._id}`;
  const [open, setOpen] = useState(false); // start minimized

  useEffect(() => {
    const v = localStorage.getItem(storageKey);
    if (v === "1") setOpen(true);
    if (v === "0") setOpen(false);
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, open ? "1" : "0");
  }, [open, storageKey]);

  return (
    <article className="w-full rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <BookingHeader
        booking={booking}
        open={open}
        onToggleOpen={() => setOpen((v) => !v)}
      />
      {open && <BookingBody booking={booking} />}
    </article>
  );
}
