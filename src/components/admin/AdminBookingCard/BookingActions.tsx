"use client";

import { Trash } from "lucide-react";

export default function BookingActions({
  bookingId,
}: {
  bookingId: string;
  onToggleEditing: () => void;
}) {
  return (
    <div className="flex justify-center mt-5 gap-4">
      <form
        action="/api/admin/bookings/delete"
        method="post"
        onSubmit={(e) => {
          if (!confirm("Delete this booking?")) e.preventDefault();
        }}
      >
        <input type="hidden" name="id" value={bookingId} />
        <button
          type="submit"
          className="rounded-4xl border border-red-300 px-1 py-1 text-red-500 hover:bg-red-50"
          title="Delete booking"
        >
          <Trash />
        </button>
      </form>
    </div>
  );
}
