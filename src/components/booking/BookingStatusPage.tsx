import React from "react";
import { Clock, Calendar, MapPin, Wrench, ChevronRight } from "lucide-react";
import Link from "next/link";

export type BookingStatus =
  | "received"
  | "reviewing"
  | "confirmed"
  | "completed";

export interface BookingDetails {
  id: string;
  serviceName: string;
  date: string;
  address: string;
  status: BookingStatus;
  phoneE164: string; // ✅ REQUIRED
}

export default function BookingStatusPage({
  booking,
}: {
  booking: BookingDetails | null;
}) {
  if (!booking) {
    return (
      <div className="max-w-2xl mx-auto p-12 text-center space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-700 mx-auto" />
        <p className="text-slate-500 font-medium">
          Loading your booking details...
        </p>
      </div>
    );
  }

  const statusSteps: BookingStatus[] = [
    "received",
    "reviewing",
    "confirmed",
    "completed",
  ];

  const currentStepIndex = statusSteps.indexOf(booking.status);
  const progressPercentage =
    ((currentStepIndex + 1) / statusSteps.length) * 100;

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Booking Status
          </h1>
          <p className="text-xs font-mono text-slate-500">
            ID: {booking.id.toUpperCase()}
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          Live Update
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="relative h-2.5 w-full bg-slate-100 rounded-full mb-10">
          <div
            className="absolute h-full bg-emerald-500 rounded-full transition-all duration-700"
            style={{ width: `${progressPercentage}%` }}
          />
          <div className="absolute top-6 w-full flex justify-between px-1">
            {statusSteps.map((step, idx) => (
              <span
                key={step}
                className={`text-[10px] font-bold uppercase ${
                  currentStepIndex >= idx
                    ? "text-emerald-600"
                    : "text-slate-300"
                }`}
              >
                {step}
              </span>
            ))}
          </div>
        </div>

        {/* Status message */}
        <div className="flex items-start gap-4 p-4 bg-slate-50 border border-slate-100 rounded-xl">
          <div className="bg-white p-2.5 rounded-lg shadow-sm border">
            <Clock className="h-5 w-5 text-cyan-600 animate-pulse" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">
              {booking.status === "confirmed"
                ? "Booking Confirmed"
                : "Request Received"}
            </p>
            <p className="text-xs text-slate-500">
              We’ll notify you as soon as the next update is available.
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white border rounded-2xl shadow-sm">
        <div className="px-5 py-3 border-b bg-slate-50">
          <h3 className="text-xs font-bold uppercase text-slate-400">
            Job Details
          </h3>
        </div>
        <div className="p-5 space-y-4">
          <DetailRow
            icon={<Wrench className="h-4 w-4" />}
            label="Service"
            value={booking.serviceName}
          />
          <DetailRow
            icon={<Calendar className="h-4 w-4" />}
            label="Date"
            value={booking.date}
          />
          <DetailRow
            icon={<MapPin className="h-4 w-4" />}
            label="Location"
            value={booking.address}
          />
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <button className="w-full flex justify-between p-4 border rounded-xl hover:bg-slate-50">
          <span className="text-sm font-semibold text-slate-700">
            Need to add photos?
          </span>
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </button>

        <Link
          href={`/customer/bookings?phone=${encodeURIComponent(
            booking.phoneE164
          )}`}
          className="block text-center py-3 text-sm font-bold text-cyan-700"
        >
          View All Bookings
        </Link>
      </div>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="text-slate-400">{icon}</div>
      <div>
        <p className="text-[10px] font-bold uppercase text-slate-400">
          {label}
        </p>
        <p className="text-sm font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  );
}
