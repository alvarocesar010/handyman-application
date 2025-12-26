import Link from "next/link";
import { AdminBooking } from "./types";
import StatusBadge from "./StatusBadge";
import { formatWhenDate } from "./utils";
import BookingBasicsPanel from "./BookingBasicsPanel";

export default function BookingHeader({
  booking,
  open,
  onToggleOpen,
}: {
  booking: AdminBooking;
  open: boolean;
  onToggleOpen: () => void;
}) {
  const created = new Date(booking.createdAt).toLocaleString("en-IE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-lg font-semibold text-slate-900">
              {booking.name}
            </h3>
            <StatusBadge s={booking.status} />
          </div>

          <div className="mt-1 space-y-1 text-sm text-slate-800">
            <div className="flex gap-2">
              <span className="font-semibold">Service:</span>
              <span className="truncate">{booking.service}</span>
            </div>

            <div className="flex gap-2">
              <span className="font-semibold">When (preferred):</span>
              <span>{formatWhenDate(booking.date)}</span>
            </div>

            <div className="flex gap-2">
              <span className="font-semibold">Service date:</span>
              <span>
                {booking.serviceDate
                  ? formatWhenDate(booking.serviceDate)
                  : "—"}
              </span>
            </div>

            {/* Important info in minimized view */}
            <div className="flex flex-col gap-1 pt-1 text-slate-900">
              <div>
                <span className="font-semibold">Phone:</span>{" "}
                <a className="underline" href={`tel:${booking.phoneRaw}`}>
                  {booking.phoneRaw}
                </a>
              </div>

              <div>
                <Link
                  href={`http://maps.google.co.uk/maps?q=${booking.eircode}`}
                  className="font-semibold"
                >
                  Address: {booking.address} · {booking.eircode}
                </Link>
              </div>

              <div>
                <span className="font-semibold">Created at:</span> {created}
              </div>
            </div>

            {/* Short description visible even minimized */}
            <p className="my-4 line-clamp-3 whitespace-pre-line text-slate-800">
              {booking.description}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleOpen}
          className="rounded-md border border-slate-300 px-2.5 py-1.5 text-sm hover:bg-slate-50"
          aria-expanded={open}
          aria-controls={`booking-body-${booking._id}`}
          title={open ? "Collapse" : "Expand"}
        >
          {open ? "–" : "+"}
        </button>
      </div>

      {/* Basic panel stays visible in minimized */}
      <div className="mt-3">
        <BookingBasicsPanel booking={booking} />
      </div>
    </div>
  );
}
