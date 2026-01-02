import Link from "next/link";
import { CheckCircle, Clock } from "lucide-react";
import { SERVICES } from "@/lib/services";

type Props = {
  booking: {
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

      {/* Main Message */}
      <div className="space-y-3">
        <p className="text-slate-700 leading-relaxed">
          Thanks <strong>{booking.name}</strong>! We&apos;ve received your
          request. Our team is currently reviewing the schedule to finalize your
          arrival time.
        </p>
        <div className="bg-emerald-100/50 border border-emerald-200 rounded-lg p-3 flex items-start gap-3">
          <Clock className="h-5 w-5 text-emerald-600 mt-0.5" />
          <p className="text-sm text-emerald-800">
            <strong>Next Step:</strong> You will receive a confirmation update
            directly in your account dashboard shortly. Please keep an eye on
            your booking status.
          </p>
        </div>
      </div>

      {/* Booking Summary Card */}
      <div className="rounded-lg bg-white p-5 border border-slate-200 shadow-inner space-y-3">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Booking Details
          </span>
          <span className="px-2 py-1 rounded bg-amber-100 text-amber-700 text-[10px] font-bold uppercase">
            Processing
          </span>
        </div>

        <div className="grid gap-2 text-sm">
          <div className="flex gap-2">
            <span className="text-slate-500 w-20 font-medium">Service:</span>
            <span className="text-slate-900">{service?.title}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-slate-500 w-20 font-medium">Date:</span>
            <span className="text-slate-900">{booking.date}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-slate-500 w-20 font-medium">Address:</span>
            <span className="text-slate-900">{booking.address}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-slate-500 w-20 font-medium">Eircode:</span>
            <span className="text-slate-900 uppercase">{booking.eircode}</span>
          </div>
        </div>
      </div>

      {/* Primary Action */}
      <div className="pt-2">
        <Link
          href="/customer/bookings"
          className="flex w-full items-center justify-center rounded-lg bg-cyan-700 px-6 py-4 text-white font-bold text-lg shadow-lg hover:bg-cyan-800 transition-all active:scale-[0.98]"
        >
          View My Booking Status
        </Link>
        <p className="mt-3 text-center text-xs text-slate-500">
          Track updates, manage details, and see technician notes in your
          dashboard.
        </p>
      </div>
    </div>
  );
}
