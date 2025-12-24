import { AdminBooking } from "./types";

type Status = AdminBooking["status"];

export default function StatusBadge({ s }: { s: Status }) {
  const map: Record<Status, string> = {
    pending: "bg-amber-100 text-amber-800 ring-amber-200",
    confirmed: "bg-emerald-100 text-emerald-800 ring-emerald-200",
    done: "bg-slate-200 text-slate-800 ring-slate-300",
    cancelled: "bg-rose-100 text-rose-800 ring-rose-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ring-1 ${map[s]}`}
    >
      {s}
    </span>
  );
}
