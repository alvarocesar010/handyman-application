import Link from "next/link";
import { CheckCircle, Clock } from "lucide-react";
import { SERVICES } from "@/lib/services";

type Props = {
  booking: {
    bookingId: string;
    service: string;
    date: string;
    name: string;
    address: string;
    eircode: string;
  };
};

export default function BookingConfirmationCard({ booking }: Props) {
  const service = SERVICES.find((s) => s.slug === booking.service);

  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 text-emerald-700">
        <CheckCircle className="h-6 w-6" />
        <h2 className="text-xl font-bold">Request Received</h2>
      </div>

      {/* Message */}
      <div className="space-y-3">
        <p className="text-slate-700">
          Thanks <strong>{booking.name}</strong>! We’ve received your request
          and are reviewing availability.
        </p>

        <div className="flex gap-3 bg-emerald-100 border rounded-lg p-3">
          <Clock className="h-5 w-5 text-emerald-600" />
          <p className="text-sm text-emerald-800">
            You can track updates in your booking dashboard.
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white border rounded-lg p-5 space-y-2">
        <Row label="Service" value={service?.title ?? booking.service} />
        <Row label="Date" value={booking.date} />
        <Row label="Address" value={booking.address} />
        <Row label="Eircode" value={booking.eircode.toUpperCase()} />
      </div>

      {/* Action */}
      <Link
        href={`/customer/bookings/${booking.bookingId}`}
        className="flex justify-center rounded-lg bg-cyan-700 px-6 py-4 text-white font-bold hover:bg-cyan-800"
      >
        View My Booking Status
      </Link>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 text-sm">
      <span className="w-20 text-slate-500 font-medium">{label}:</span>
      <span className="text-slate-900">{value}</span>
    </div>
  );
}
