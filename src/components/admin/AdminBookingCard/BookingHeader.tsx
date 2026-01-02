import Link from "next/link";
import { AdminBooking } from "./types";
import StatusBadge from "./StatusBadge";
import { formatWhenDate } from "./utils";
import BookingBasicsPanel from "./BookingBasicsPanel";
import { Image as ImageIcon } from "lucide-react";

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
  const photosCount = booking.photos?.length ?? 0;
console.log(booking)
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
              <span>{booking.time}</span>
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
              {booking.distanceCost != null && (
                <div className="mt-1 text-sm text-slate-700">
                  <span className="font-semibold">Estimated travel cost:</span>{" "}
                  €{booking.distanceCost.toFixed(2)}
                  {booking.distanceKm && (
                    <span className="text-slate-500">
                      {" "}
                      ({booking.distanceKm})
                    </span>
                  )}
                </div>
              )}
              <div>
                <span className="font-semibold">Created at:</span> {created}
              </div>
            </div>

            {/* Short description visible even minimized */}
            <p className="my-4 whitespace-normal text-slate-800">
              {booking.description}
            </p>
          </div>
          {photosCount > 0 && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ImageIcon className="h-4 w-4" />
              <span>
                {photosCount} photo{photosCount > 1 ? "s" : ""} attached
              </span>
            </div>
          )}
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
