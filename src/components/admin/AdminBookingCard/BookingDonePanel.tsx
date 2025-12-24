import { useMemo } from "react";
import { AdminBooking } from "./types";
import { formatDuration, formatEuro } from "./utils";

export default function BookingDonePanel({
  booking,
}: {
  booking: AdminBooking;
}) {
  const has =
    booking.amountReceived != null ||
    booking.tipReceived != null ||
    booking.finishTime ||
    booking.actualDurationMinutes != null;

  const avgPerHour = useMemo(() => {
    if (typeof booking.amountReceived !== "number") return "—";
    if (typeof booking.actualDurationMinutes !== "number") return "—";
    if (booking.actualDurationMinutes <= 0) return "—";
    const hours = booking.actualDurationMinutes / 60;
    return `${formatEuro(booking.amountReceived / hours)}/h`;
  }, [booking.amountReceived, booking.actualDurationMinutes]);

  if (!has) return null;

  return (
    <div className="mt-3 grid gap-2 rounded-lg border bg-white p-3 text-sm sm:grid-cols-3">
      <div>
        <div className="text-slate-500">Received</div>
        <div className="font-medium text-slate-900">
          {typeof booking.amountReceived === "number"
            ? `€${booking.amountReceived}`
            : "—"}
        </div>
      </div>

      <div>
        <div className="text-slate-500">Tip</div>
        <div className="font-medium text-slate-900">
          {typeof booking.tipReceived === "number"
            ? `€${booking.tipReceived}`
            : "—"}
        </div>
      </div>

      <div>
        <div className="text-slate-500">Finish</div>
        <div className="font-medium text-slate-900">
          {booking.finishTime || "—"}
        </div>
      </div>

      <div>
        <div className="text-slate-500">Time spent</div>
        <div className="font-medium text-slate-900">
          {typeof booking.actualDurationMinutes === "number"
            ? formatDuration(booking.actualDurationMinutes)
            : "—"}
        </div>
      </div>

      <div>
        <div className="text-slate-500">Avg / hour</div>
        <div className="font-medium text-slate-900">{avgPerHour}</div>
      </div>
    </div>
  );
}
