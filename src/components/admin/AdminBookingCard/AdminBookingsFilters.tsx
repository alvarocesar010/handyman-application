"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Range = "day" | "week" | "month" | "all";

export default function AdminBookingsFilters({
  currentRange,
  from,
  to,
}: {
  currentRange: Range;
  from: string;
  to: string;
}) {
  const router = useRouter();
  const sp = useSearchParams();

  const weekOfMonth = Number(sp.get("w") ?? "0"); // 0 = all month

  function replaceParams(next: URLSearchParams) {
    router.replace(`/admin/bookings?${next.toString()}`);
  }

  function setRange(r: Range) {
    const next = new URLSearchParams(sp.toString());
    next.set("range", r);

    // reset week-of-month when leaving month
    if (r !== "month") next.delete("w");

    replaceParams(next);
  }

  function setWeekOfMonth(w: number) {
    const next = new URLSearchParams(sp.toString());
    next.set("range", "month");
    if (w <= 0) next.delete("w");
    else next.set("w", String(w));
    replaceParams(next);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        className="rounded-md border px-3 py-1.5 text-sm"
        value={currentRange}
        onChange={(e) => setRange(e.target.value as Range)}
      >
        <option value="day">Today</option>
        <option value="week">This week</option>
        <option value="month">This month</option>
        <option value="all">All</option>
      </select>

      {/* Week-of-month selector (only when month) */}
      {currentRange === "month" && (
        <select
          className="rounded-md border px-3 py-1.5 text-sm"
          value={String(weekOfMonth)}
          onChange={(e) => setWeekOfMonth(Number(e.target.value))}
          title="Week of current month"
        >
          <option value="0">All month</option>
          <option value="1">Week 1</option>
          <option value="2">Week 2</option>
          <option value="3">Week 3</option>
          <option value="4">Week 4</option>
          <option value="5">Week 5</option>
        </select>
      )}

      <div className="text-sm text-slate-600">
        {currentRange === "all" ? (
          <span>Showing: all bookings</span>
        ) : (
          <span>
            Showing: {from} → {to}
          </span>
        )}
      </div>
    </div>
  );
}
