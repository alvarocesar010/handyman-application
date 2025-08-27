"use client";

import { useState } from "react";
import { Send } from "lucide-react";

type Status = "idle" | "loading" | "ok" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const form = e.currentTarget;
    const fd = new FormData(form);

    if (!fd.get("name") || !fd.get("email") || !fd.get("message")) {
      setStatus("error");
      setError("Please fill in name, email and message.");
      return;
    }

    try {
      const res = await fetch("/api/contact", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Failed to send");
      setStatus("ok");
      form.reset();
    } catch (err: unknown) {
      setStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-sm"
    >
      <input
        type="text"
        name="company"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      {/* name / phone / email / date / service / message / consent checkbox ... */}
      {/* copy the exact form fields you already had inside page.tsx */}

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-700 px-5 py-2.5 text-white font-medium shadow hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-600 disabled:opacity-60"
      >
        <Send className="h-4 w-4" />
        {status === "loading" ? "Sending…" : "Send message"}
      </button>

      {status === "ok" && (
        <p className="text-sm text-emerald-700">
          Thanks! We’ll get back to you shortly.
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-rose-700">
          {error || "Couldn’t send message, try again."}
        </p>
      )}
    </form>
  );
}
