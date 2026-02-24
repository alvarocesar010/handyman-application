"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, Mail, MessageCircle, Clock, MapPin, Send } from "lucide-react";
import { handleConversionClick } from "@/lib/ads";


type Status = "idle" | "loading" | "ok" | "error";
// src/app/contact/page.tsx

export default function ContactPage() {
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
    <main className="mx-auto max-w-6xl px-6 py-12 space-y-12">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold text-slate-900">Contact</h1>
        <p className="text-slate-600">
          Get in touch for bookings, quotes, or urgent repairs in Dublin.
        </p>
      </header>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-cyan-700" />
            <h3 className="font-semibold text-slate-900">Phone</h3>
          </div>
          <div className="mt-2">
            <a
              href="tel:+353894924563"
              className="text-cyan-700 hover:underline"
              onClick={(e) => handleConversionClick(e, href)}
            >
              +353 (89) 492 4563
            </a>
            <p className="text-sm text-slate-600">Best for urgent callouts</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-cyan-700" />
            <h3 className="font-semibold text-slate-900">Email</h3>
          </div>
          <div className="mt-2">
            <a
              href="mailto:info@handyman.ie"
              className="text-cyan-700 hover:underline"
            >
              info@handyman.ie
            </a>
            <p className="text-sm text-slate-600">
              We reply within one business day
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <MessageCircle className="h-5 w-5 text-cyan-700" />
            <h3 className="font-semibold text-slate-900">WhatsApp</h3>
          </div>
          <div className="mt-2">
            <a
              href={`https://wa.me/353894924563?text=Hi%2C%20I%27d%20like%20to%20book%20a%20repair`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-700 hover:underline"
              onClick={(e) => handleConversionClick(e, href)}
            >
              Chat on WhatsApp
            </a>
            <p className="text-sm text-slate-600">
              Send photos/videos of the issue
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-cyan-700" />
            <h3 className="font-semibold text-slate-900">Hours</h3>
          </div>
          <div className="mt-2 text-sm text-slate-700">
            <p>Mon–Sat: 08:00–20:00</p>
            <p>Emergencies by phone</p>
          </div>
        </div>
      </section>

      <section className="grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Send a message
          </h2>

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

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Full name
                </label>
                <input
                  name="name"
                  required
                  className="block w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Phone
                </label>
                <input
                  name="phone"
                  type="tel"
                  className="block w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="block w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Preferred date
                </label>
                <input
                  name="date"
                  type="date"
                  className="block w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Service
              </label>
              <select
                name="service"
                defaultValue=""
                className="block w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-600"
              >
                <option value="" disabled>
                  Choose a service…
                </option>
                <option value="door-replacement">Door Replacement</option>
                <option value="heater-maintenance">Heater Maintenance</option>
                <option value="furniture-assembly">Furniture Assembly</option>
                <option value="fit-shower">Fit Shower</option>
                <option value="fit-washing-dishwasher">
                  Fit Washing Machine & Dishwasher
                </option>
                <option value="tap-replacement">Tap Replacement</option>
                <option value="lights-replacement">Lights Replacement</option>
                <option value="electrical-repairs">Electrical Repairs</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Message
              </label>
              <textarea
                name="message"
                rows={5}
                required
                placeholder="Tell us what's happening and where in Dublin you are…"
                className="block w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-600"
              />
            </div>

            <div className="flex items-center gap-2">
              <input id="consent" name="consent" type="checkbox" required />
              <label htmlFor="consent" className="text-sm text-slate-700">
                I agree to be contacted about my enquiry.
              </label>
            </div>

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

          <p className="mt-3 text-xs text-slate-500">
            Prefer to book directly?{" "}
            <Link href="/booking" className="text-cyan-700 underline">
              Book a Repair
            </Link>
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Service Area
          </h2>
          <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
            <iframe
              title="Dublin Map"
              className="h-[380px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2381.706728022955!2d-6.2672!3d53.3438!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48670e9a24f8d9d9%3A0x2608c7a4a2a7!2sDublin%20City%20Centre!5e0!3m2!1sen!2sie!4v1700000000000"
            />
          </div>

          <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-slate-700">
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-cyan-700" /> City Centre
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-cyan-700" /> Rathmines
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-cyan-700" /> Drumcondra
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-cyan-700" /> Tallaght
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-cyan-700" /> Blanchardstown
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-cyan-700" /> Docklands
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
