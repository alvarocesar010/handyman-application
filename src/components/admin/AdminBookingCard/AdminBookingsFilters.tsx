"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Preset = "today" | "week" | "month" | "custom";
type Bucket = "day" | "week" | "month";

function toISODateOnly(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function isISODate(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

export default function AdminBookingsFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const presetFromUrl = (sp.get("preset") ?? "month") as Preset;
  const bucketFromUrl = (sp.get("bucket") ?? "day") as Bucket;

  const fromUrl = sp.get("from") ?? "";
  const toUrl = sp.get("to") ?? "";

  const [preset, setPreset] = useState<Preset>(
    presetFromUrl === "today" ||
      presetFromUrl === "week" ||
      presetFromUrl === "month" ||
      presetFromUrl === "custom"
      ? presetFromUrl
      : "month"
  );

  const [bucket, setBucket] = useState<Bucket>(
    bucketFromUrl === "day" ||
      bucketFromUrl === "week" ||
      bucketFromUrl === "month"
      ? bucketFromUrl
      : "day"
  );

  const [from, setFrom] = useState<string>(
    isISODate(fromUrl)
      ? fromUrl
      : toISODateOnly(new Date(Date.now() - 30 * 86400000))
  );
  const [to, setTo] = useState<string>(
    isISODate(toUrl) ? toUrl : toISODateOnly(new Date())
  );

  // Sync when user navigates back/forward
  useEffect(() => {
    const p = (sp.get("preset") ?? "month") as Preset;
    const b = (sp.get("bucket") ?? "day") as Bucket;
    const f = sp.get("from") ?? "";
    const t = sp.get("to") ?? "";

    if (p === "today" || p === "week" || p === "month" || p === "custom")
      setPreset(p);
    if (b === "day" || b === "week" || b === "month") setBucket(b);
    if (isISODate(f)) setFrom(f);
    if (isISODate(t)) setTo(t);
  }, [sp]);

  // Same preset behaviour as dashboard
  useEffect(() => {
    const now = new Date();
    let f = new Date(now);
    let t = new Date(now);

    if (preset === "today") {
      f = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      t = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      setBucket("day");
    }

    if (preset === "week") {
      const day = now.getDay(); // 0..6 (Sun..Sat)
      const diff = day === 0 ? 6 : day - 1; // monday-start
      f = new Date(now);
      f.setDate(now.getDate() - diff);
      t = new Date(now);
      setBucket("day");
    }

    if (preset === "month") {
      f = new Date(now.getFullYear(), now.getMonth(), 1);
      t = new Date(now);
      setBucket("day");
    }

    if (preset !== "custom") {
      setFrom(toISODateOnly(f));
      setTo(toISODateOnly(t));
    }
  }, [preset]);

  function pushParams(next: {
    preset: Preset;
    bucket: Bucket;
    from: string;
    to: string;
  }) {
    const params = new URLSearchParams(sp.toString());
    params.set("preset", next.preset);
    params.set("bucket", next.bucket);
    params.set("from", next.from);
    params.set("to", next.to);

    router.push(`${pathname}?${params.toString()}`);
  }

  function onRefresh() {
    // ensures URL has the latest chosen values
    pushParams({ preset, bucket, from, to });
    router.refresh();
  }

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

      <button
        type="button"
        onClick={onRefresh}
        className="rounded-md border px-3 py-1.5 text-sm"
      >
        Refresh
      </button>

      <span className="text-sm text-slate-600">
        Showing: {from} → {to}
      </span>
    </div>
  );
}
