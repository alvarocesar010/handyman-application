"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash } from "lucide-react";
import Link from "next/link";

export type AdminPhoto = { id: string; filename: string };
export type AdminBooking = {
  _id: string;
  service: string;
  date: string;
  name: string;
  phoneRaw: string;
  address: string;
  eircode: string;
  description: string;
  createdAt: string;
  status: "pending" | "confirmed" | "done" | "cancelled";
  photos?: AdminPhoto[];
  budget?: number;
  adminNotes?: string;
  startTime?: string;
  durationMinutes?: number;
};

function StatusBadge({ s }: { s: AdminBooking["status"] }) {
  const map: Record<AdminBooking["status"], string> = {
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

export default function AdminBookingCard({
  booking,
}: {
  booking: AdminBooking;
}) {
  const storageKey = `admin:booking:collapsed:${booking._id}`;
  const [open, setOpen] = useState<boolean>(true);
  const [editing, setEditing] = useState<boolean>(false);

  const created = new Date(booking.createdAt).toLocaleString("en-IE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // <-- ensures am/pm
  });

  // remember per booking
  useEffect(() => {
    const v = localStorage.getItem(storageKey);
    if (v === "0") setOpen(false);
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, open ? "1" : "0");
  }, [open, storageKey]);

  return (
    <article className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Header row */}
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-lg font-semibold text-slate-900">
              {booking.name}
            </h3>
            <StatusBadge s={booking.status} />
          </div>
          <p className="truncate text-sm text-slate-600"></p>
          <div className="">
            <div className="flex gap-2 text-sm ">
              <p className="font-semibold">Service:</p>
              {booking.service}
            </div>
            <div className="text-sm flex gap-2">
              <p className=" font-semibold ">When:</p>
              {booking.date}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <form
            action="/api/admin/bookings/status"
            method="post"
            className="hidden md:flex items-center gap-2"
          >
            <input type="hidden" name="id" value={booking._id} />
            <select
              name="status"
              defaultValue={booking.status}
              className="rounded-md border border-slate-300 px-2 py-1 text-sm"
            >
              <option value="pending">pending</option>
              <option value="confirmed">confirmed</option>
              <option value="done">done</option>
              <option value="cancelled">cancelled</option>
            </select>
            <button
              type="submit"
              className="rounded-md bg-cyan-700 px-3 py-1.5 text-sm text-white hover:bg-cyan-800"
            >
              Save
            </button>
          </form>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-md border border-slate-300 px-2.5 py-1.5 text-sm hover:bg-slate-50"
            aria-expanded={open}
            aria-controls={`booking-body-${booking._id}`}
            title={open ? "Collapse" : "Expand"}
          >
            {open ? "–" : "+"}
          </button>
        </div>
      </div>

      {/* Body */}
      {open && (
        <div
          id={`booking-body-${booking._id}`}
          className="px-4 pb-4 pt-2 border-t border-slate-100"
        >
          <div className="text-sm text-slate-600">
            <div>
              <span className="font-medium">Phone:</span>{" "}
              <a className="underline" href={`tel:${booking.phoneRaw}`}>
                {booking.phoneRaw}
              </a>
            </div>
            <div>
              <Link
                href={`http://maps.google.co.uk/maps?q=${booking.eircode}`}
                className="font-medium"
              >
                Address: {booking.address} · {booking.eircode}
              </Link>
            </div>
            <div className="flex gap-2">
              <span>Created at:</span>
              <p>{created}</p>
            </div>
          </div>

          {(booking.budget ||
            booking.startTime ||
            booking.durationMinutes ||
            booking.adminNotes) && (
            <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
              <p className="font-semibold mb-1">Job details</p>
              {booking.budget && <p>Budget: €{booking.budget}</p>}
              {booking.startTime && <p>Time: {booking.startTime}</p>}
              {booking.durationMinutes && (
                <p>Estimated duration: {booking.durationMinutes} min</p>
              )}
              {booking.adminNotes && (
                <p className="mt-1 whitespace-pre-line">{booking.adminNotes}</p>
              )}
            </div>
          )}
          <p className="mt-3 whitespace-pre-line text-slate-700">
            {booking.description}
          </p>

          {booking.photos && booking.photos.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
              {booking.photos.map((p) => (
                <a
                  key={p.id}
                  href={`/api/booking/photo/${p.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block overflow-hidden rounded-md ring-1 ring-slate-200"
                  title={p.filename}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/api/booking/photo/${p.id}`}
                    alt={p.filename}
                    className="h-24 w-full object-cover"
                    loading="lazy"
                  />
                </a>
              ))}
            </div>
          )}
          {editing && (
            <form
              action="/api/admin/bookings/update"
              method="post"
              className="mt-4 space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-3"
            >
              <input type="hidden" name="id" value={booking._id} />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">
                    Budget (€)
                  </label>
                  <input
                    type="number"
                    step="1"
                    name="budget"
                    defaultValue={booking.budget ?? ""}
                    className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">
                    Time (start)
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    defaultValue={booking.startTime ?? ""}
                    className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">
                    Estimated duration (min)
                  </label>
                  <input
                    type="number"
                    step="15"
                    name="durationMinutes"
                    defaultValue={booking.durationMinutes ?? ""}
                    className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Notes about the service
                </label>
                <textarea
                  name="adminNotes"
                  rows={3}
                  defaultValue={booking.adminNotes ?? ""}
                  className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-cyan-700 px-3 py-1.5 text-sm text-white hover:bg-cyan-800"
                >
                  Save details
                </button>
              </div>
            </form>
          )}
          {/* Mobile inline status controls */}
          <form
            action="/api/admin/bookings/status"
            method="post"
            className="mt-3 flex gap-2 md:hidden"
          >
            <input type="hidden" name="id" value={booking._id} />
            <select
              name="status"
              defaultValue={booking.status}
              className="flex-1 rounded-md border border-slate-300 px-2 py-2 text-sm"
            >
              <option value="pending">pending</option>
              <option value="confirmed">confirmed</option>
              <option value="done">done</option>
              <option value="cancelled">cancelled</option>
            </select>
            <button
              type="submit"
              className="rounded-md bg-cyan-700 px-3 py-2 text-sm text-white hover:bg-cyan-800"
            >
              Save
            </button>
          </form>
          <div className="flex justify-center mt-5 gap-4">
            <button
              type="button"
              onClick={() => setEditing((v) => !v)}
              className="rounded-4xl border border-yellow-300 px-1 py-1 text- text-yellow-500 hover:bg-red-50"
            >
              <Pencil />
            </button>
            <form
              action="/api/admin/bookings/delete"
              method="post"
              onSubmit={(e) => {
                if (!confirm("Delete this booking?")) e.preventDefault();
              }}
            >
              <input type="hidden" name="id" value={booking._id} />
              <button
                type="submit"
                className="rounded-4xl border border-red-300 px-1 py-1 text- text-red-500 hover:bg-red-50"
                title="Delete booking"
              >
                <Trash />
              </button>
            </form>
          </div>
        </div>
      )}
    </article>
  );
}
