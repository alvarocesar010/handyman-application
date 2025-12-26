import Link from "next/link";
import type { AdminBookingStatus } from "./types";

type Tab = {
  key: AdminBookingStatus;
  label: string;
  count: number;
};

export default function StatusTabs({
  active,
  counts,
  makeHref,
}: {
  active: AdminBookingStatus;
  counts: Record<AdminBookingStatus, number>;
  makeHref: (status: AdminBookingStatus) => string;
}) {
  const tabs: Tab[] = [
    { key: "pending", label: "Pending", count: counts.pending },
    { key: "confirmed", label: "Confirmed", count: counts.confirmed },
    { key: "done", label: "Done", count: counts.done },
    { key: "cancelled", label: "Cancelled", count: counts.cancelled },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((t) => {
        const isActive = t.key === active;
        return (
          <Link
            key={t.key}
            href={makeHref(t.key)}
            className={[
              "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm",
              isActive
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-300 bg-white text-slate-900 hover:bg-slate-50",
            ].join(" ")}
          >
            <span className="font-medium">{t.label}</span>
            <span
              className={[
                "rounded-full px-2 py-0.5 text-xs",
                isActive
                  ? "bg-white/15 text-white"
                  : "bg-slate-100 text-slate-700",
              ].join(" ")}
            >
              {t.count}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
