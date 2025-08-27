"use client";

import { useState } from "react";
import { toast } from "react-toastify";

export default function BookingForm() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const form = e.currentTarget;
    const fd = new FormData(form);

    try {
      const res = await fetch("/api/booking", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Booking failed");
      toast.success("We received your booking. We’ll confirm shortly.");
      form.reset();
      setStatus("success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
      toast.error(msg);
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border p-4">
      {/* your current inputs go here */}
      {/* Example minimal fields: */}
      <input
        name="service"
        placeholder="service slug"
        className="w-full rounded border p-2"
        required
      />
      <input
        name="date"
        placeholder="YYYY-MM-DD"
        className="w-full rounded border p-2"
        required
      />
      <input
        name="name"
        placeholder="Full name"
        className="w-full rounded border p-2"
        required
      />
      <input
        name="phone"
        placeholder="+353…"
        className="w-full rounded border p-2"
        required
      />
      <input
        name="address"
        placeholder="Address"
        className="w-full rounded border p-2"
        required
      />
      <input
        name="eircode"
        placeholder="Eircode"
        className="w-full rounded border p-2"
        required
      />
      <textarea
        name="description"
        placeholder="Describe the issue"
        className="w-full rounded border p-2"
        rows={4}
        required
      />
      <input
        name="photos"
        type="file"
        multiple
        accept="image/*"
        className="w-full"
      />

      {error && <p className="text-sm text-rose-600">{error}</p>}
      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center rounded-lg bg-cyan-700 px-4 py-2 font-medium text-white hover:bg-cyan-800 disabled:opacity-50"
      >
        {status === "loading" ? "Submitting…" : "Request booking"}
      </button>
    </form>
  );
}
