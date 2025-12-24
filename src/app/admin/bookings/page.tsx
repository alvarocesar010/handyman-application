import { getDb } from "@/lib/mongodb";
import { ObjectId, type Filter } from "mongodb";

import AdminBookingsFilters from "@/components/admin/AdminBookingCard/AdminBookingsFilters";
import AdminBookingsSection from "@/components/admin/AdminBookingCard/AdminBookingsSection";
import type { AdminBooking } from "@/components/admin/AdminBookingCard/types";

export const dynamic = "force-dynamic";

type DbBooking = {
  _id: ObjectId;
  service: string;
  date: string; // YYYY-MM-DD
  name: string;
  phoneRaw: string;
  address: string;
  eircode: string;
  description: string;
  serviceDate?: string;

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

type Range = "day" | "week" | "month" | "all";

function toISODateOnly(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Monday-start week (current week)
function getWeekRange(now: Date) {
  const day = now.getDay(); // 0..6 (Sun..Sat)
  const diff = day === 0 ? 6 : day - 1;
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(now.getDate() - diff);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  return { from: toISODateOnly(start), to: toISODateOnly(end) };
}

function getMonthRange(now: Date) {
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { from: toISODateOnly(start), to: toISODateOnly(end) };
}

function getDayRange(now: Date) {
  const d = toISODateOnly(now);
  return { from: d, to: d };
}

// ---------- Week-of-month helpers (3.2) ----------

function addDaysISO(iso: string, days: number) {
  // Use UTC to avoid timezone shifting day
  const d = new Date(`${iso}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + days);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getMonthRangeISO(now: Date) {
  const start = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
  const end = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 0));

  const toISO = (d: Date) => {
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  return { from: toISO(start), to: toISO(end) };
}

/**
 * Week-of-month = 1..5
 * Week 1 = days 1-7
 * Week 2 = days 8-14
 * Week 3 = days 15-21
 * Week 4 = days 22-28
 * Week 5 = days 29-end
 */
function getWeekOfMonthRange(now: Date, weekOfMonth: number) {
  const { from: monthFrom, to: monthTo } = getMonthRangeISO(now);
  const startDayOffset = (weekOfMonth - 1) * 7; // 0,7,14,21,28

  const from = addDaysISO(monthFrom, startDayOffset);
  const toCandidate = addDaysISO(from, 6);
  const to = toCandidate > monthTo ? monthTo : toCandidate;

  return { from, to };
}

// ---------- End week-of-month helpers ----------

function getRange(range: Range) {
  const now = new Date();
  if (range === "day") return { range, ...getDayRange(now) };
  if (range === "week") return { range, ...getWeekRange(now) };
  if (range === "month") return { range, ...getMonthRange(now) };
  return { range: "all" as const, from: "", to: "" };
}

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const rangeParam = (searchParams?.range ?? "month") as Range;

  const wRaw = searchParams?.w;
  const weekOfMonth =
    typeof wRaw === "string"
      ? Number(wRaw)
      : Array.isArray(wRaw)
      ? Number(wRaw[0])
      : 0;

  let rangeInfo = getRange(rangeParam);

  // Apply week-of-month only when range=month and w is 1..5
  if (
    rangeParam === "month" &&
    Number.isFinite(weekOfMonth) &&
    weekOfMonth >= 1 &&
    weekOfMonth <= 5
  ) {
    const now = new Date();
    const weekRange = getWeekOfMonthRange(now, weekOfMonth);
    rangeInfo = {
      range: "month" as const,
      from: weekRange.from,
      to: weekRange.to,
    };
  }

  const db = await getDb();

  const query: Filter<DbBooking> =
    rangeInfo.range === "all"
      ? {}
      : { date: { $gte: rangeInfo.from, $lte: rangeInfo.to } };

  const docs = (await db
    .collection<DbBooking>("bookings")
    .find(query)
    // ✅ most recent first
    .sort({ date: -1, createdAt: -1 })
    .limit(600)
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
    serviceDate: d.serviceDate,

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">Bookings</h2>
        <form action="/api/admin/bookings/reindex" method="post">
          <button className="rounded-md border px-3 py-1.5 text-sm">
            Reindex
          </button>
        </form>
      </div>

      <AdminBookingsFilters
        currentRange={rangeInfo.range}
        from={rangeInfo.from}
        to={rangeInfo.to}
      />

      <div className="grid gap-6">
        <AdminBookingsSection title="Confirmed" items={byStatus.confirmed} />
        <AdminBookingsSection title="Pending" items={byStatus.pending} />
        <AdminBookingsSection title="Done" items={byStatus.done} />
        <AdminBookingsSection title="Cancelled" items={byStatus.cancelled} />
      </div>
    </div>
  );
}
