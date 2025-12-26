"use client";

import { useState } from "react";
import type { AdminBooking } from "./types";
import BookingDonePanel from "./BookingDonePanel";
import BookingPhotos from "./BookingPhotos";
import BookingActions from "./BookingActions";
import BookingDetailsEditor from "./BookingDetailsEditor";

export default function BookingBody({ booking }: { booking: AdminBooking }) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="px-4 pb-4 pt-2 border-t border-slate-100">
      <BookingDonePanel booking={booking} />

      <BookingPhotos photos={booking.photos} />

      {editing && (
        <BookingDetailsEditor
          booking={booking}
          onClose={() => setEditing(false)}
        />
      )}

      <BookingActions
        bookingId={booking._id}
        onToggleEditing={() => setEditing((v) => !v)}
      />
    </div>
  );
}
