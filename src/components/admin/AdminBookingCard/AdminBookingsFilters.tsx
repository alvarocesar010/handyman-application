"use client";

import { useEffect, useMemo, useState } from "react";
import type { Bucket, Preset, RangeInfo } from "./types";

type Props = {
  initialRange: RangeInfo;
  status: string;
};

function toISODateOnly(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function monthRange(now: Date) {
  const from = new Date(now.getFullYear(), now.getMonth(), 1);
  const to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { from: toISODateOnly(from), to: toISODateOnly(to) };
}

function weekRange(now: Date) {
  const d = new Date(now);
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diff);

  const from = new Date(d);
  const to = new Date(d);
  to.setDate(from.getDate() + 6);

  return { from: toISODateOnly(from), to: toISODateOnly(to) };
}

function todayRange(now: Date) {
  const iso = toISODateOnly(now);
  return { from: iso, to: iso };
}

export default function AdminBookingsFilters({ initialRange, status }: Props) {
  const [preset, setPreset] = useState<Preset>(initialRange.preset);
  const [bucket, setBucket] = useState<Bucket>(initialRange.bucket);
  const [from, setFrom] = useState(initialRange.from);
  const [to, setTo] = useState(initialRange.to);

  useEffect(() => {
    const now = new Date();

    if (preset === "today") {
      const r = todayRange(now);
      setFrom(r.from);
      setTo(r.to);
      setBucket("day");
    }

    if (preset === "week") {
      const r = weekRange(now);
      setFrom(r.from);
      setTo(r.to);
      setBucket("day");
    }

    if (preset === "month") {
      const r = monthRange(now);
      setFrom(r.from);
      setTo(r.to);
      setBucket("day");
    }
  }, [preset]);

  const queryString = useMemo(() => {
    const sp = new URLSearchParams();
    sp.set("preset", preset);
    sp.set("bucket", bucket);
    sp.set("status", status); // ✅ KEEP STATUS

    if (preset !== "all") {
      sp.set("from", from);
      sp.set("to", to);
    }

    return sp.toString();
  }, [preset, bucket, from, to, status]);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        className="rounded-md border px-3 py-1.5 text-sm"
        value={preset}
        onChange={(e) => setPreset(e.target.value as Preset)}
      >
        <option value="today">Today</option>
        <option value="week">This week</option>
        <option value="month">This month</option>
        <option value="all">All</option>
        <option value="custom">Custom range</option>
      </select>

      {preset === "custom" && (
        <>
          <input
            className="rounded-md border px-3 py-1.5 text-sm"
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
          <input
            className="rounded-md border px-3 py-1.5 text-sm"
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </>
      )}

      <select
        className="rounded-md border px-3 py-1.5 text-sm"
        value={bucket}
        onChange={(e) => setBucket(e.target.value as Bucket)}
      >
        <option value="day">Group by day</option>
        <option value="week">Group by week</option>
        <option value="month">Group by month</option>
      </select>

      <a
        href={`/admin/bookings?${queryString}`}
        className="rounded-md border px-3 py-1.5 text-sm"
      >
        Refresh
      </a>

      <div className="text-sm text-slate-600">
        Showing: {from} → {to}
      </div>
    </div>
  );
}
