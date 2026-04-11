"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, Mail, MessageCircle, Clock, MapPin, Send } from "lucide-react";
import { handleConversionClick } from "@/lib/ads";
import { Messages } from "@/lib/getMessages";

type Status = "idle" | "loading" | "ok" | "error";

export default function ContactClient({ m }: { m: Messages["contact"] }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");

  const href = "tel:+353894924563";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const form = e.currentTarget;
    const fd = new FormData(form);

    if (!fd.get("name") || !fd.get("email") || !fd.get("message")) {
      setStatus("error");
      setError(m.form.error.required);
      return;
    }

    try {
      const res = await fetch("/api/contact", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Failed to send");
      setStatus("ok");
      form.reset();
    } catch (err: unknown) {
      setStatus("error");
      setError(err instanceof Error ? err.message : m.form.error.generic);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 space-y-12">
      {/* HEADER */}
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold text-slate-900">
          {m.header.title}
        </h1>
        <p className="text-slate-600">{m.header.subtitle}</p>
      </header>

      {/* CARDS */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* PHONE */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-cyan-700" />
            <h3 className="font-semibold text-slate-900">
              {m.cards.phone.title}
            </h3>
          </div>
          <div className="mt-2">
            <a
              href={href}
              className="text-cyan-700 hover:underline"
              onClick={(e) => handleConversionClick(e, href)}
            >
              +353 (89) 492 4563
            </a>
            <p className="text-sm text-slate-600">
              {m.cards.phone.description}
            </p>
          </div>
        </div>

        {/* EMAIL */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-cyan-700" />
            <h3 className="font-semibold text-slate-900">
              {m.cards.email.title}
            </h3>
          </div>
          <div className="mt-2">
            <a
              href="mailto:info@handyman.ie"
              className="text-cyan-700 hover:underline"
            >
              info@handyman.ie
            </a>
            <p className="text-sm text-slate-600">
              {m.cards.email.description}
            </p>
          </div>
        </div>

        {/* WHATSAPP */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <MessageCircle className="h-5 w-5 text-cyan-700" />
            <h3 className="font-semibold text-slate-900">
              {m.cards.whatsapp.title}
            </h3>
          </div>
          <div className="mt-2">
            <a
              href={m.cards.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-700 hover:underline"
            >
              {m.cards.whatsapp.cta}
            </a>
            <p className="text-sm text-slate-600">
              {m.cards.whatsapp.description}
            </p>
          </div>
        </div>

        {/* HOURS */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-cyan-700" />
            <h3 className="font-semibold text-slate-900">
              {m.cards.hours.title}
            </h3>
          </div>
          <div className="mt-2 text-sm text-slate-700">
            <p>{m.cards.hours.schedule}</p>
            <p>{m.cards.hours.extra}</p>
          </div>
        </div>
      </section>

      {/* FORM + MAP */}
      <section className="grid gap-10 lg:grid-cols-2">
        {/* FORM */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            {m.form.title}
          </h2>

          <form
            onSubmit={onSubmit}
            className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-sm"
          >
            <input type="text" name="company" className="hidden" />

            <div className="grid gap-4 sm:grid-cols-2">
              <Input label={m.form.fields.name} name="name" required />
              <Input label={m.form.fields.phone} name="phone" />
              <Input
                label={m.form.fields.email}
                name="email"
                type="email"
                required
              />
              <Input label={m.form.fields.date} name="date" type="date" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                {m.form.fields.service}
              </label>
              <select className="block w-full rounded-md border px-3 py-2">
                <option disabled value="">
                  {m.form.select.default}
                </option>
                {Object.entries(m.form.select.options).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                {m.form.fields.message}
              </label>
              <textarea
                name="message"
                required
                placeholder={m.form.fields.placeholder}
                className="block w-full rounded-md border px-3 py-2"
              />
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" required />
              <label className="text-sm text-slate-700">{m.form.consent}</label>
            </div>

            <button className="bg-cyan-700 text-white px-5 py-2.5 rounded-lg">
              <Send className="h-4 w-4" />
              {status === "loading"
                ? m.form.submit.loading
                : m.form.submit.idle}
            </button>

            {status === "ok" && (
              <p className="text-emerald-700">{m.form.success}</p>
            )}
            {status === "error" && (
              <p className="text-rose-700">{error || m.form.error.fallback}</p>
            )}
          </form>

          <p className="mt-3 text-xs text-slate-500">
            {m.cta.text}{" "}
            <Link href="/booking" className="text-cyan-700 underline">
              {m.cta.link}
            </Link>
          </p>
        </div>

        {/* MAP */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            {m.area.title}
          </h2>

          <div className="rounded-xl overflow-hidden border shadow-sm">
            <iframe
              title={m.area.mapTitle}
              className="h-[380px] w-full"
              src={`https://maps.google.com?q=${m.area.mapTitle}&output=embed`}
            />
          </div>

          <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-slate-700">
            {m.area.locations.map((loc: string) => (
              <li key={loc} className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-cyan-700" />
                {loc}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

function Input({
  label,
  ...props
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input {...props} className="block w-full rounded-md border px-3 py-2" />
    </div>
  );
}
