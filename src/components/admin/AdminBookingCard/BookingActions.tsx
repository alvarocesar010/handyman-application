"use client";

import { Pencil, Trash } from "lucide-react";

export default function BookingActions({
  bookingId,
  onToggleEditing,
}: {
  bookingId: string;
  onToggleEditing: () => void;
}) {
  return (
    <div className="flex justify-center mt-5 gap-4">
      <button
        type="button"
        onClick={onToggleEditing}
        className="rounded-4xl border border-yellow-300 px-1 py-1 text-yellow-500 hover:bg-red-50"
        title="Edit details"
      >
        <Pencil />
      </button>

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
