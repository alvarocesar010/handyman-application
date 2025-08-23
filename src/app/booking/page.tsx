// app/booking/page.tsx
"use client";
import { useSearchParams } from "next/navigation";

export default function BookingPage() {
  const params = useSearchParams();
  const service = params.get("service") ?? "";

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-4">
      <h1 className="text-2xl font-bold">Book a Service</h1>
      <p className="text-slate-700">
        Selected: <strong>{service || "— choose a service —"}</strong>
      </p>

      {/* Replace this with your actual calendar/widget later */}
      <form className="space-y-3">
        <div className="grid gap-2">
          <label className="text-sm">Preferred date</label>
          <input
            type="date"
            className="rounded border p-2"
            name="date"
            required
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm">Your details</label>
          <input
            type="text"
            placeholder="Full name"
            className="rounded border p-2"
            required
          />
          <input
            type="tel"
            placeholder="Phone"
            className="rounded border p-2"
            required
          />
          <input
            type="text"
            placeholder="Address (Dublin)"
            className="rounded border p-2"
            required
          />
        </div>
        <button className="inline-flex h-11 items-center justify-center rounded-lg bg-cyan-700 px-5 text-white font-medium hover:bg-cyan-800">
          Request booking
        </button>
      </form>
    </main>
  );
}
