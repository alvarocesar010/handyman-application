import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import BookingStatusPage from "@/components/booking/BookingStatusPage";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 🛑 HARD GUARD
  if (!id || !ObjectId.isValid(id)) {
    return (
      <div className="p-10 text-center text-slate-600">Invalid booking ID</div>
    );
  }

  const db = await getDb();

  const booking = await db.collection("bookings").findOne({
    _id: new ObjectId(id),
  });

  if (!booking) {
    return (
      <div className="p-10 text-center text-slate-600">Booking not found</div>
    );
  }

  return (
    <BookingStatusPage
      booking={{
        id: booking._id.toString(),
        serviceName: booking.service,
        date: booking.date,
        address: booking.address,
        status: mapStatus(booking.status),
        phoneE164: booking.phoneE164,
      }}
    />
  );
}

function mapStatus(dbStatus: string) {
  switch (dbStatus) {
    case "pending":
      return "received";
    case "confirmed":
      return "confirmed";
    case "done":
      return "completed";
    default:
      return "received";
  }
}
