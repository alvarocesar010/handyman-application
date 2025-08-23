// src/components/Testimonials/index.tsx
"use client";

import { useState } from "react";

type Testimonial = {
  name: string;
  service: string;
  text: string;
};

const initialTestimonials: Testimonial[] = [
  {
    name: "Sarah M.",
    service: "Washing Machine Repair",
    text: "John fixed our washing machine the same day. Professional, polite, and very affordable.",
  },
  {
    name: "David O.",
    service: "Door Replacement",
    text: "He replaced a broken door in our flat in Rathmines. Quick service and excellent finish.",
  },
];

export default function Testimonials() {
  const [testimonials, setTestimonials] =
    useState<Testimonial[]>(initialTestimonials);
  const [form, setForm] = useState({ name: "", service: "", text: "" });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { name, service, text } = form;
    if (!name || !service || !text) return;
    setTestimonials((t) => [...t, { name, service, text }]);
    setForm({ name: "", service: "", text: "" });
  }

  return (
    <section className="bg-white p-4">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <h2 className="mb-10 text-center text-3xl font-bold text-slate-900">
          What Our Customers Say
        </h2>

        {/* List (left) + Form (right) */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Testimonials list */}
          <div className="space-y-6">
            {testimonials.map((t, i) => (
              <article
                key={`${t.name}-${i}`}
                className="rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-sm"
              >
                <header className="mb-2">
                  <p className="font-semibold text-slate-900">{t.name}</p>
                  <p className="text-sm text-slate-600">{t.service}</p>
                </header>
                <p className="text-sm italic leading-relaxed text-slate-700">
                  “{t.text}”
                </p>
              </article>
            ))}
          </div>

          {/* Review form */}
          <div className="md:ml-auto">
            <h3 className="mb-4 text-center text-xl font-semibold text-slate-900 md:text-left">
              Share Your Experience
            </h3>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-sm"
            >
              {/* Name */}
              <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-5 sm:gap-4">
                <label className="sm:text-right text-sm font-medium text-slate-700">
                  Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  type="text"
                  className=" sm:col-span-4 block w-full rounded-md border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                  required
                />
              </div>

              {/* Service */}
              <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-5 sm:gap-4">
                <label className="sm:text-right text-sm font-medium text-slate-700">
                  Service
                </label>
                <input
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  placeholder="e.g. Tap Replacement"
                  type="text"
                  className="sm:col-span-4 block w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                  required
                />
              </div>

              {/* Review */}
              <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-5 sm:gap-4">
                <label className="sm:text-right pt-2 text-sm font-medium text-slate-700">
                  Your Review
                </label>
                <textarea
                  name="text"
                  value={form.text}
                  onChange={handleChange}
                  rows={4}
                  className="sm:col-span-4 block w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                  required
                />
              </div>

              {/* Button */}
              <div className="sm:col-span-5 sm:ml-auto sm:w-[calc(80%)]">
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-lg bg-cyan-700 px-5 py-2.5 font-medium text-white shadow hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                >
                  Submit Review
                </button>
              </div>

              <p className="text-xs text-slate-500">
                By submitting a review you agree it may be published on this
                website.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
