import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

import AdminBookingsFilters from "@/components/admin/AdminBookingCard/AdminBookingsFilters";
import AdminBookingsSection from "@/components/admin/AdminBookingCard/AdminBookingsSection";
import StatusTabs from "@/components/admin/AdminBookingCard/StatusTabs";

import type {
  AdminBooking,
  AdminBookingStatus,
} from "@/components/admin/AdminBookingCard/types";
import ConfirmedDayGroup from "@/components/admin/AdminBookingCard/ConfimedDayGroup";

export const dynamic = "force-dynamic";

type DbBooking = {
  _id: ObjectId;

  service: string;

  // preferred date (user chosen)
  date: string; // YYYY-MM-DD
  time: string;

  // real service date (optional)
  serviceDate?: string; // YYYY-MM-DD

  name: string;
  phoneRaw: string;
  address: string;
  eircode: string;
  distanceKm?: string;
  distanceDuration?: number;
  distanceCost?: number;
  description: string;

  status: AdminBookingStatus;
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

type Bucket = "day" | "week" | "month";
type Preset = "today" | "week" | "month" | "all" | "custom";

type RangeInfo = {
  preset: Preset;
  bucket: Bucket;
  from: string;
  to: string;
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

function getThisWeekRange(now: Date): { from: string; to: string } {
  const n = new Date(now);
  const day = n.getDay(); // 0..6 (Sun..Sat)
  const diff = day === 0 ? 6 : day - 1; // Monday start
  const start = new Date(n);
  start.setDate(n.getDate() - diff);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { from: toISODateOnly(start), to: toISODateOnly(end) };
}

function getThisMonthRange(now: Date): { from: string; to: string } {
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0); // last day
  return { from: toISODateOnly(start), to: toISODateOnly(end) };
}

function parseRange(
  sp: Record<string, string | string[] | undefined>
): RangeInfo {
  const now = new Date();

  const presetRaw = typeof sp.preset === "string" ? sp.preset : "month";
  const preset: Preset =
    presetRaw === "today" ||
    presetRaw === "week" ||
    presetRaw === "month" ||
    presetRaw === "all" ||
    presetRaw === "custom"
      ? presetRaw
      : "month";

  const bucketRaw = typeof sp.bucket === "string" ? sp.bucket : "day";
  const bucket: Bucket =
    bucketRaw === "day" || bucketRaw === "week" || bucketRaw === "month"
      ? bucketRaw
      : "day";

  const fromQ = typeof sp.from === "string" ? sp.from : "";
  const toQ = typeof sp.to === "string" ? sp.to : "";

  if (preset === "custom" && isISODate(fromQ) && isISODate(toQ)) {
    return { preset, bucket, from: fromQ, to: toQ };
  }

  if (preset === "today") {
    const today = toISODateOnly(now);
    return { preset, bucket: "day", from: today, to: today };
  }

  if (preset === "week") {
    const r = getThisWeekRange(now);
    return { preset, bucket: "day", ...r };
  }

  if (preset === "month") {
    const r = getThisMonthRange(now);
    return { preset, bucket: "day", ...r };
  }

  // all
  return { preset: "all", bucket, from: "0000-01-01", to: "9999-12-31" };
}

function inRange(dateISO: string, from: string, to: string): boolean {
  return dateISO >= from && dateISO <= to;
}

function effectiveServiceDateISO(b: DbBooking): string {
  if (b.serviceDate && isISODate(b.serviceDate)) return b.serviceDate;
  return b.date;
}

function toView(d: DbBooking): AdminBooking {
  return {
    _id: d._id.toString(),
    service: d.service,
    date: d.date,
    time: d.time,
    serviceDate: d.serviceDate,
    name: d.name,
    phoneRaw: d.phoneRaw,
    address: d.address,
    eircode: d.eircode,
    distanceKm: d.distanceKm,
    distanceDuration: d.distanceDuration,
    distanceCost: d.distanceCost,
    description: d.description,
    status: d.status,
    createdAt: d.createdAt ? d.createdAt.toString() : "",
    photos:
      d.photos?.map((p) => ({
        id: p.fileId.toString(),
        filename: p.filename,
      })) ?? [],
    adminNotes: d.adminNotes,
    budget: d.budget,
    durationMinutes: d.durationMinutes,
    startTime: d.startTime,
    amountReceived: d.amountReceived,
    tipReceived: d.tipReceived,
    finishTime: d.finishTime,
    actualDurationMinutes: d.actualDurationMinutes,
  };
}

function makeHrefWith(current: URLSearchParams, patch: Record<string, string>) {
  const next = new URLSearchParams(current.toString());
  for (const [k, v] of Object.entries(patch)) next.set(k, v);
  return `/admin/bookings?${next.toString()}`;
}

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const range = parseRange(sp);

  const statusRaw = typeof sp.status === "string" ? sp.status : "pending";
  const activeStatus: AdminBookingStatus =
    statusRaw === "pending" ||
    statusRaw === "confirmed" ||
    statusRaw === "done" ||
    statusRaw === "cancelled"
      ? statusRaw
      : "pending";

  const db = await getDb();
  const docs = (await db
    .collection<DbBooking>("bookings")
    .find({})
    .sort({ createdAt: -1 }) // most recent first
    .limit(2000)
    .toArray()) as DbBooking[];

  // NEW RULE:
  // - pending + confirmed: always visible (ignore range)
  // - done + cancelled: respect range using effective service date
  const filtered = docs.filter((d) => {
    if (d.status === "pending") return true;
    const dateISO = effectiveServiceDateISO(d);
    return inRange(dateISO, range.from, range.to);
  });

  const byStatus: Record<AdminBookingStatus, AdminBooking[]> = {
    pending: [],
    confirmed: [],
    done: [],
    cancelled: [],
  };

  for (const d of filtered) {
    byStatus[d.status].push(toView(d));
  }

  const counts: Record<AdminBookingStatus, number> = {
    pending: byStatus.pending.length,
    confirmed: byStatus.confirmed.length,
    done: byStatus.done.length,
    cancelled: byStatus.cancelled.length,
  };

  const currentParams = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (typeof v === "string") currentParams.set(k, v);
  }

  const makeTabHref = (status: AdminBookingStatus) =>
    makeHrefWith(currentParams, { status });

  const title =
    activeStatus === "pending"
      ? "Pending"
      : activeStatus === "confirmed"
      ? "Confirmed"
      : activeStatus === "done"
      ? "Done"
      : "Cancelled";

  function getDayKey(dateISO: string) {
    const d = new Date(dateISO);
    const weekday = d.toLocaleDateString("en-IE", { weekday: "long" });
    const date = d.toLocaleDateString("en-IE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    return {
      key: dateISO,
      label: `${weekday} · ${date}`,
    };
  }
  const confirmedByDay = new Map<
    string,
    { label: string; items: AdminBooking[] }
  >();

  if (activeStatus === "confirmed") {
    for (const booking of byStatus.confirmed) {
      const dateISO = booking.serviceDate ?? booking.date;
      const { key, label } = getDayKey(dateISO);

      if (!confirmedByDay.has(key)) {
        confirmedByDay.set(key, { label, items: [] });
      }

      confirmedByDay.get(key)!.items.push(booking);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-slate-900">Bookings</h2>

        <form action="/api/admin/bookings/reindex" method="post">
          <button className="rounded-md border px-3 py-1.5 text-sm">
            Reindex
          </button>
        </form>
      </div>

      {/* dashboard-like filters */}
      <AdminBookingsFilters initialRange={range} status={activeStatus} />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <StatusTabs
          active={activeStatus}
          counts={counts}
          makeHref={makeTabHref}
        />

        <div className="text-sm text-slate-600">
          Showing: {range.from} → {range.to}
        </div>
      </div>

      {activeStatus === "confirmed" ? (
        <div className="space-y-4">
          {[...confirmedByDay.entries()]
            .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
            .map(([date, group]) => (
              <ConfirmedDayGroup
                key={date}
                label={group.label}
                items={group.items}
              />
            ))}
        </div>
      ) : (
        <AdminBookingsSection title={title} items={byStatus[activeStatus]} />
      )}
    </div>
  );
}
