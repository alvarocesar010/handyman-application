"use client";
import { useState } from "react";
import Link from "next/link";

export default function AdminEnglish() {
  const [json, setJson] = useState("");
  const [status, setStatus] = useState("");

  async function handleSubmit() {
    try {
      const parsed = JSON.parse(json);

      const res = await fetch("/api/admin/english", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setStatus("✅ Saved successfully");
    } catch (err) {
      setStatus("❌ Invalid JSON or request failed");
      console.error(err);
    }
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <div className="mb-4">
        <Link className="rounded-full bg-amber-200 p-2" href="/admin/english">
          home
        </Link>
      </div>
      <textarea
        value={json}
        onChange={(e) => setJson(e.target.value)}
        className="w-full h-64 border p-2 rounded"
        placeholder="Paste JSON array here..."
      />

      <button
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Save
      </button>

      <p className="mt-2 text-sm">{status}</p>
    </div>
  );
}
