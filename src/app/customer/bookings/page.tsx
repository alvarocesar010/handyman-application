import { getDb } from "@/lib/mongodb";
import Link from "next/link";
import { toE164Irish } from "@/lib/phone";

export const dynamic = "force-dynamic";

export default async function CustomerBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ phone?: string }>;
}) {
  const { phone: phoneInput } = await searchParams;

  /* -----------------------------
     MODE 1: No phone → show form
  ----------------------------- */
  if (!phoneInput) {
    return (
      <div className="max-w-md mx-auto p-8 space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Find your bookings
        </h1>

        <p className="text-slate-600 text-sm">
          Enter the phone number you used when making the booking.
        </p>

        <form method="GET" action="/customer/bookings" className="space-y-4">
          <input
            name="phone"
            type="tel"
            placeholder="000 000 0000"
            required
            className="w-full rounded-md border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-600"
          />

          <button
            type="submit"
            className="w-full rounded-lg bg-cyan-700 py-3 text-white font-bold hover:bg-cyan-800 transition"
          >
            Find my bookings
          </button>
        </form>
      </div>
    );
  }

  /* -----------------------------------------
     Normalize phone BEFORE querying MongoDB
  ----------------------------------------- */
  const phoneE164 = toE164Irish(phoneInput);

  if (!phoneE164) {
    return (
      <div className="max-w-md mx-auto p-8 text-center space-y-4">
        <h1 className="text-xl font-bold">Invalid phone number</h1>
        <p className="text-slate-500">
          Please enter a valid Irish mobile number.
        </p>

        <Link
          href="/customer/bookings"
          className="inline-block text-cyan-700 font-semibold"
        >
          Try again
        </Link>
      </div>
    );
  }

  /* -----------------------------
     MODE 2: Phone → load bookings
  ----------------------------- */
  const db = await getDb();

  const bookings = await db
    .collection("bookings")
    .find({ phoneE164 }) // ✅ normalized value
    .sort({ createdAt: -1 })
    .toArray();

  if (bookings.length === 0) {
    return (
      <div className="max-w-md mx-auto p-8 text-center space-y-4">
        <h1 className="text-xl font-bold">No bookings found</h1>
        <p className="text-slate-500">
          We couldn’t find any bookings linked to this phone number.
        </p>

        <Link
          href="/customer/bookings"
          className="inline-block text-cyan-700 font-semibold"
        >
          Try another number
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">My bookings</h1>

      {bookings.map((b) => (
        <Link
          key={b._id.toString()}
          href={`/customer/bookings/${b._id}`}
          className="block rounded-xl border border-slate-200 p-4 hover:bg-slate-50 transition"
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold text-slate-900">{b.service}</div>
              <div className="text-sm text-slate-500">{b.date}</div>
            </div>

            <span className="text-xs font-bold uppercase text-cyan-700">
              {b.status}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
