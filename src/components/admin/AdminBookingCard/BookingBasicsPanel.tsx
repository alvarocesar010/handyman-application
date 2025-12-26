import { AdminBooking } from "./types";
import { minutesToHM } from "./utils";

export default function BookingBasicsPanel({
  booking,
}: {
  booking: AdminBooking;
}) {
  const hasBasics =
    booking.budget != null ||
    booking.startTime ||
    booking.durationMinutes != null;

  if (!hasBasics) return null;

  return (
    <div className="grid grid-cols-3 gap-2 rounded-lg border bg-slate-50 p-3 text-sm sm:grid-cols-3">
      <div>
        <div className="text-slate-500">Budget</div>
        <div className="font-medium text-slate-900">
          {typeof booking.budget === "number" ? `€${booking.budget}` : "—"}
        </div>
      </div>

      <div>
        <div className="text-slate-500">Time (start)</div>
        <div className="font-medium text-slate-900">
          {booking.startTime || "—"}
        </div>
      </div>

      <div>
        <div className="text-slate-500">Duration</div>
        <div className="font-medium text-slate-900">
          {typeof booking.durationMinutes === "number"
            ? `${booking.durationMinutes} min (${minutesToHM(
                booking.durationMinutes
              )})`
            : "—"}
        </div>
      </div>
    </div>
  );
}
