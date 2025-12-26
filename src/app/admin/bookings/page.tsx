import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import AdminBookingsSection from "@/components/admin/AdminBookingCard/AdminBookingsSection";
import AdminBookingsFilters from "@/components/admin/AdminBookingCard/AdminBookingsFilters";
import type { AdminBooking } from "@/components/admin/AdminBookingCard/types";

export const dynamic = "force-dynamic";

type Preset = "today" | "week" | "month" | "custom";
type Bucket = "day" | "week" | "month";

type DbBooking = {
  _id: ObjectId;
  service: string;
  date: string; // preferred YYYY-MM-DD
  serviceDate?: string; // real YYYY-MM-DD
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

  amountReceived?: number;
  tipReceived?: number;
  finishTime?: string;
  actualDurationMinutes?: number;
};

function isISODate(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

function toISODateOnly(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function resolveRange(sp: Record<string, string | string[] | undefined>) {
  const preset = (
    typeof sp.preset === "string" ? sp.preset : "month"
  ) as Preset;
  const bucket = (typeof sp.bucket === "string" ? sp.bucket : "day") as Bucket;

  const now = new Date();
  let from = typeof sp.from === "string" ? sp.from : "";
  let to = typeof sp.to === "string" ? sp.to : "";

  if (preset === "today") {
    const iso = toISODateOnly(now);
    from = iso;
    to = iso;
  }

  if (preset === "week") {
    const day = now.getDay();
    const diff = day === 0 ? 6 : day - 1;
    const f = new Date(now);
    f.setDate(now.getDate() - diff);
    from = toISODateOnly(f);
    to = toISODateOnly(now);
  }

  if (preset === "month") {
    const f = new Date(now.getFullYear(), now.getMonth(), 1);
    from = toISODateOnly(f);
    to = toISODateOnly(now);
  }

  if (preset === "custom") {
    // keep from/to from url, but ensure valid
    if (!isISODate(from) || !isISODate(to)) {
      const f = new Date(now.getFullYear(), now.getMonth(), 1);
      from = toISODateOnly(f);
      to = toISODateOnly(now);
    }
  }

  const safeBucket: Bucket =
    bucket === "day" || bucket === "week" || bucket === "month"
      ? bucket
      : "day";

  return { preset, bucket: safeBucket, from, to };
}

function effectiveISO(d: DbBooking): string {
  return d.serviceDate && isISODate(d.serviceDate) ? d.serviceDate : d.date;
}

function inRange(dateISO: string, from: string, to: string): boolean {
  return dateISO >= from && dateISO <= to;
}

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const range = resolveRange(searchParams);

  const db = await getDb();
  const docs = (await db
    .collection<DbBooking>("bookings")
    .find({})
    .sort({ createdAt: -1 }) // ✅ most recent first
    .limit(2000)
    .toArray()) as DbBooking[];

  const filtered = docs.filter((d) =>
    inRange(effectiveISO(d), range.from, range.to)
  );

  const toView = (d: DbBooking): AdminBooking => ({
    _id: d._id.toString(),
    service: d.service,
    date: d.date,
    serviceDate: d.serviceDate,
    name: d.name,
    phoneRaw: d.phoneRaw,
    address: d.address,
    eircode: d.eircode,
    description: d.description,
    status: d.status,
    createdAt: d.createdAt ? d.createdAt.toString() : "",
    photos:
      d.photos?.map((p) => ({
        id: p.fileId.toString(),
        filename: p.filename,
      })) ?? [],

    budget: d.budget,
    adminNotes: d.adminNotes,
    startTime: d.startTime,
    durationMinutes: d.durationMinutes,

    amountReceived: d.amountReceived,
    tipReceived: d.tipReceived,
    finishTime: d.finishTime,
    actualDurationMinutes: d.actualDurationMinutes,
  });

  const byStatus: Record<AdminBooking["status"], AdminBooking[]> = {
    confirmed: [],
    pending: [],
    done: [],
    cancelled: [],
  };

  for (const d of filtered) {
    const v = toView(d);
    byStatus[v.status].push(v);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">Bookings</h2>
      </div>

      {/* ✅ exactly like dashboard controls */}
      <AdminBookingsFilters />

      <AdminBookingsSection title="Confirmed" items={byStatus.confirmed} />
      <AdminBookingsSection title="Pending" items={byStatus.pending} />
      <AdminBookingsSection title="Done" items={byStatus.done} />
      <AdminBookingsSection title="Cancelled" items={byStatus.cancelled} />
    </div>
  );
}
