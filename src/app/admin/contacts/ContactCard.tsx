"use client";

import { useState } from "react";

type Contact = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  date?: string;
  service?: string;
  message: string;
  createdAt: Date;
};

export default function ContactCard({ contact }: { contact: Contact }) {
  const [loading, setLoading] = useState(false);
  const [deleted, setDeleted] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this contact?")) return;

    try {
      setLoading(true);

      const res = await fetch(`/api/contact/${contact._id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed");

      setDeleted(true);
    } catch (err) {
      console.error(err);
      alert("Error deleting contact");
    } finally {
      setLoading(false);
    }
  }

  if (deleted) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-semibold text-slate-900">{contact.name}</h2>
          <p className="text-sm text-slate-600">{contact.email}</p>
        </div>

        <span className="text-xs text-slate-500">
          {new Date(contact.createdAt).toLocaleString()}
        </span>
      </div>

      {/* Info */}
      <div className="text-sm text-slate-700 space-y-1">
        {contact.phone && <p>📞 {contact.phone}</p>}
        {contact.service && <p>🛠 {contact.service}</p>}
        {contact.date && <p>📅 {contact.date}</p>}
      </div>

      {/* Message */}
      <div className="bg-slate-50 border rounded-lg p-3 text-sm text-slate-800">
        {contact.message}
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-2 items-center">
        <a
          href={`mailto:${contact.email}`}
          className="text-sm text-cyan-700 hover:underline"
        >
          Reply Email
        </a>

        {contact.phone && (
          <a
            href={`https://wa.me/${contact.phone.replace(/\D/g, "")}`}
            target="_blank"
            className="text-sm text-green-600 hover:underline"
          >
            WhatsApp
          </a>
        )}

        {/* DELETE BUTTON */}
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-sm text-red-600 hover:underline ml-auto"
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}
