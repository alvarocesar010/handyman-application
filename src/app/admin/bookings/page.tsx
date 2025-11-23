import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import AdminBookingCard, {
  AdminBooking,
} from "@/components/admin/AdminBookingCard";

export const dynamic = "force-dynamic";

type DbBooking = {
  _id: ObjectId;
  service: string;
  date: string;
  name: string;
  phoneRaw: string;
  address: string;
  eircode: string;
  description: string;
  status: "pending" | "confirmed" | "done" | "cancelled";
  photos?: { fileId: ObjectId; filename: string }[];
  createdAt: Date | string;
  budget?: number;
  adminNotes?: string;
  startTime?: string;
  durationMinutes?: number;
};

function Section({ title, items }: { title: string; items: AdminBooking[] }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">
          {title} <span className="text-slate-500">({items.length})</span>
        </h3>
      </div>
      <div className="grid gap-4">
        {items.map((b) => (
          <AdminBookingCard key={b._id} booking={b} />
        ))}
        {items.length === 0 && (
          <p className="text-sm text-slate-500">No items.</p>
        )}
      </div>
    </section>
  );
}

export default async function AdminBookingsPage() {
  const db = await getDb();
  const docs = (await db
    .collection<DbBooking>("bookings")
    .find({})
    .sort({ createdAt: -1 })
    .limit(300)
    .toArray()) as DbBooking[];

  const toView = (d: DbBooking): AdminBooking => ({
    _id: d._id.toString(),
    service: d.service,
    date: d.date,
    name: d.name,
    phoneRaw: d.phoneRaw,
    address: d.address,
    eircode: d.eircode,
    description: d.description,
    status: d.status,
    createdAt: d.createdAt,
    photos:
      d.photos?.map((p) => ({
        id: p.fileId.toString(),
        filename: p.filename,
      })) ?? [],
  });

  const byStatus = {
    confirmed: [] as AdminBooking[],
    pending: [] as AdminBooking[],
    done: [] as AdminBooking[],
    cancelled: [] as AdminBooking[],
  };

  docs.forEach((d) => {
    const v = toView(d);
    byStatus[v.status].push(v);
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">Bookings</h2>
        <form action="/api/admin/bookings/reindex" method="post">
          <button className="rounded-md border px-3 py-1.5 text-sm">
            Reindex
          </button>
        </form>
      </div>

      <Section title="Confirmed" items={byStatus.confirmed} />
      <Section title="Pending" items={byStatus.pending} />
      <Section title="Done" items={byStatus.done} />
      <Section title="Cancelled" items={byStatus.cancelled} />
    </div>
  );
}
