import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import type { Filter } from "mongodb";

type Bucket = "day" | "week" | "month";

type DbBooking = {
  status: "pending" | "confirmed" | "done" | "cancelled";
  service: string;
  date: string; // preferred YYYY-MM-DD
  serviceDate?: string; // real YYYY-MM-DD (optional)
  name: string;
  createdAt: Date | string;

  budget?: number;
  amountReceived?: number;
  tipReceived?: number;
};

function isISODate(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

function toISODateOnlyFromDate(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseCreatedAtISO(createdAt: Date | string): string | null {
  const d = createdAt instanceof Date ? createdAt : new Date(createdAt);
  if (Number.isNaN(d.getTime())) return null;
  return toISODateOnlyFromDate(d);
}

/**
 * Use real service date when available; fallback to preferred booking date.
 */
function getEffectiveServiceISO(b: DbBooking): string {
  if (b.serviceDate && isISODate(b.serviceDate)) return b.serviceDate;
  return b.date;
}

/**
 * Bucket key for day/week/month
 * - day: YYYY-MM-DD
 * - week: Monday date YYYY-MM-DD
 * - month: YYYY-MM
 */
function bucketKey(dateISO: string, bucket: Bucket): string {
  if (bucket === "day") return dateISO;

  if (bucket === "month") return dateISO.slice(0, 7); // YYYY-MM

  // week => Monday start
  const d = new Date(`${dateISO}T00:00:00.000Z`);
  const day = d.getUTCDay(); // 0..6 (Sun..Sat)
  const diff = day === 0 ? 6 : day - 1; // since Monday
  d.setUTCDate(d.getUTCDate() - diff);
  return toISODateOnlyFromDate(d);
}

function labelFromKey(key: string, bucket: Bucket): string {
  if (bucket === "month") {
    const [y, m] = key.split("-");
    const d = new Date(Number(y), Number(m) - 1, 1);
    return d.toLocaleDateString("en-IE", { month: "short", year: "numeric" });
  }
  const d = new Date(`${key}T00:00:00.000Z`);
  return d.toLocaleDateString("en-IE");
}

function inRange(dateISO: string, from: string, to: string): boolean {
  // lexicographic works for ISO date strings
  return dateISO >= from && dateISO <= to;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";
  const bucket = (searchParams.get("bucket") ?? "day") as Bucket;

  if (!isISODate(from) || !isISODate(to)) {
    return NextResponse.json({ error: "Invalid from/to" }, { status: 400 });
  }
  if (bucket !== "day" && bucket !== "week" && bucket !== "month") {
    return NextResponse.json({ error: "Invalid bucket" }, { status: 400 });
  }

  const db = await getDb();

  const query: Filter<DbBooking> = {}; // keep as-is (filter in memory)

  const docs = (await db
    .collection<DbBooking>("bookings")
    .find(query)
    .project({
      status: 1,
      service: 1,
      date: 1,
      serviceDate: 1,
      name: 1,
      createdAt: 1,
      budget: 1,
      amountReceived: 1,
      tipReceived: 1,
    })
    .limit(5000)
    .toArray()) as DbBooking[];

  // -------------------------
  // Funnel: CREATED in range
  // -------------------------
  const funnelCounts: Record<DbBooking["status"], number> = {
    pending: 0,
    confirmed: 0,
    done: 0,
    cancelled: 0,
  };

  for (const d of docs) {
    const createdISO = parseCreatedAtISO(d.createdAt);
    if (!createdISO) continue;
    if (!inRange(createdISO, from, to)) continue;
    funnelCounts[d.status] += 1;
  }

  const funnel = (Object.keys(funnelCounts) as DbBooking["status"][]).map(
    (s) => ({
      status: s,
      count: funnelCounts[s],
    })
  );

  // -----------------------------------------
  // Buckets: services/revenue/budget/customers
  // -----------------------------------------
  type BucketAgg = {
    revenue: number;
    budget: number;
    services: number; // done count
    customersCreatedSet: Set<string>; // unique customers per bucket (createdAt)
  };

  const buckets = new Map<string, BucketAgg>();

  for (const d of docs) {
    // customersByDate: created in range
    const createdISO = parseCreatedAtISO(d.createdAt);
    if (createdISO && inRange(createdISO, from, to)) {
      const key = bucketKey(createdISO, bucket);
      const row =
        buckets.get(key) ??
        ({
          revenue: 0,
          budget: 0,
          services: 0,
          customersCreatedSet: new Set<string>(),
        } satisfies BucketAgg);

      row.customersCreatedSet.add(d.name.trim().toLowerCase());
      buckets.set(key, row);
    }

    // revenue/services/budget: done by service date
    const serviceISO = getEffectiveServiceISO(d);
    if (!inRange(serviceISO, from, to)) continue;
    if (d.status !== "done") continue;

    const key = bucketKey(serviceISO, bucket);
    const row =
      buckets.get(key) ??
      ({
        revenue: 0,
        budget: 0,
        services: 0,
        customersCreatedSet: new Set<string>(),
      } satisfies BucketAgg);

    row.revenue += d.amountReceived ?? 0;
    row.budget += d.budget ?? 0;
    row.services += 1;
    buckets.set(key, row);
  }

  const sortedKeys = Array.from(buckets.keys()).sort();

  // ✅ labelFromKey now USED (fix warning)
  const revenueByDate = sortedKeys.map((k) => ({
    date: k,
    dateLabel: labelFromKey(k, bucket),
    revenue: Number(buckets.get(k)?.revenue ?? 0),
  }));

  const servicesByDate = sortedKeys.map((k) => ({
    date: k,
    dateLabel: labelFromKey(k, bucket),
    services: Number(buckets.get(k)?.services ?? 0),
  }));

  const customersByDate = sortedKeys.map((k) => ({
    date: k,
    dateLabel: labelFromKey(k, bucket),
    customers: Number(buckets.get(k)?.customersCreatedSet.size ?? 0),
  }));

  const budgetVsRevenueByDate = sortedKeys.map((k) => ({
    date: k,
    dateLabel: labelFromKey(k, bucket),
    budget: Number(buckets.get(k)?.budget ?? 0),
    revenue: Number(buckets.get(k)?.revenue ?? 0),
  }));

  // -------------------------
  // Services by type (done)
  // -------------------------
  type ServiceAgg = {
    count: number;
    revenue: number;
    budget: number;
    tips: number;
  };
  const servicesType = new Map<string, ServiceAgg>();

  for (const d of docs) {
    const serviceISO = getEffectiveServiceISO(d);
    if (!inRange(serviceISO, from, to)) continue;
    if (d.status !== "done") continue;

    const key = d.service;
    const row = servicesType.get(key) ?? {
      count: 0,
      revenue: 0,
      budget: 0,
      tips: 0,
    };

    row.count += 1;
    row.revenue += d.amountReceived ?? 0;
    row.budget += d.budget ?? 0;
    row.tips += d.tipReceived ?? 0;

    servicesType.set(key, row);
  }

  const servicesByType = Array.from(servicesType.entries())
    .map(([service, agg]) => ({
      service,
      count: agg.count,
      revenue: agg.revenue,
      budget: agg.budget,
      tips: agg.tips,
    }))
    .sort((a, b) => b.count - a.count);

  // -------------------------
  // KPIs (done + customers)
  // -------------------------
  const doneDocs = docs.filter((d) => {
    const serviceISO = getEffectiveServiceISO(d);
    return d.status === "done" && inRange(serviceISO, from, to);
  });

  const totalRevenue = doneDocs.reduce(
    (acc, d) => acc + (d.amountReceived ?? 0),
    0
  );
  const totalTips = doneDocs.reduce((acc, d) => acc + (d.tipReceived ?? 0), 0);
  const totalServices = doneDocs.length;

  const uniqueCustomers = new Set(
    docs
      .filter((d) => {
        const createdISO = parseCreatedAtISO(d.createdAt);
        return createdISO ? inRange(createdISO, from, to) : false;
      })
      .map((d) => d.name.trim().toLowerCase())
  ).size;

  const avgTicket = totalServices > 0 ? totalRevenue / totalServices : 0;
  const avgTip = totalServices > 0 ? totalTips / totalServices : 0;

  return NextResponse.json({
    range: { from, to, bucket },
    kpis: {
      totalRevenue,
      totalTips,
      totalServices,
      uniqueCustomers,
      avgTicket,
      avgTip,
    },
    charts: {
      revenueByDate,
      servicesByDate,
      customersByDate,
      servicesByType,
      funnel,
      budgetVsRevenueByDate,
    },
  });
}
