"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import ServicePickerModal from "@/components/ServicePickerModal";
import { SERVICES } from "@/lib/services";

/* ------------------------- Google Ads / gtag setup ------------------------- */

type Gtag = {
  (command: "js", date: Date): void;
  (command: "config", targetId: string, config?: Record<string, unknown>): void;
  (command: "event", eventName: string, params?: Record<string, unknown>): void;
};

declare global {
  interface Window {
    gtag?: Gtag;
  }
}

const ADS_SEND_TO = "AW-10991191295/_1A7CLqc3LYbEP-Jgfko";

/** Promise-based conversion fire. Resolves on event_callback or after timeout. */
function reportConversionAwait(
  params?: { value?: number; currency?: string },
  timeoutMs = 2000
): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || typeof window.gtag === "undefined") {
      setTimeout(resolve, 0);
      return;
    }

    let settled = false;
    const done = () => {
      if (!settled) {
        settled = true;
        resolve();
      }
    };

    const t = setTimeout(done, timeoutMs);

    try {
      window.gtag("event", "conversion", {
        send_to: ADS_SEND_TO,
        value: params?.value ?? 1.0,
        currency: params?.currency ?? "EUR",
        event_callback: () => {
          clearTimeout(t);
          done();
        },
      });
    } catch {
      clearTimeout(t);
      done();
    }
  });
}

/* --------------------------------- Helpers -------------------------------- */

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

type LocalPhoto = { file: File; url: string };

const ALIASES: Record<string, string> = {
  "door-maintenance": "door-replacement",
  "door-repair": "door-replacement",
  "heater-service": "heater-maintenance",
  "heating-maintenance": "heater-maintenance",
  "light-replacement": "lights-replacement",
  "light-install": "lights-replacement",
  "tap-repair": "tap-replacement",
  "washing-machine-install": "fit-washing-dishwasher",
  "dishwasher-install": "fit-washing-dishwasher",
  // extras you may want:
  "tv-install": "tv-assembly",
  "tv-mount": "tv-assembly",
  curtains: "curtain-installation",
  blinds: "curtain-installation",
  "shower-fix": "shower-repair",
};

function normalize(v: string) {
  return v.toLowerCase().trim().replace(/\s+/g, "-");
}

function findServiceSlug(input: string | null): string {
  if (!input) return "";
  const q = normalize(input);
  if (SERVICES.some((s) => s.slug === q)) return q;
  if (ALIASES[q]) return ALIASES[q];

  const qWords = q.replace(/-/g, " ");
  const byTitle = SERVICES.find((s) => s.title.toLowerCase().includes(qWords));
  if (byTitle) return byTitle.slug;

  const bySlug = SERVICES.find((s) => s.slug.includes(q));
  return bySlug ? bySlug.slug : "";
}

/* --------------------------------- Component -------------------------------- */

export default function BookingClient() {
  const search = useSearchParams();
  const [service, setService] = useState<string>("");
  const [photos, setPhotos] = useState<LocalPhoto[]>([]);
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const raw = search.get("service") ?? search.get("type");
    const chosen = findServiceSlug(raw);
    setService(chosen);
  }, [search]);

  const selected = useMemo(
    () => SERVICES.find((s) => s.slug === service),
    [service]
  );

  /* ------------------------------ Photo handlers ----------------------------- */

  function onFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError("");
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/heic",
      "image/heif",
    ];
    const maxEach = 5 * 1024 * 1024; // 5MB
    const maxCount = 5;

    const next: LocalPhoto[] = [];
    for (const f of files) {
      if (!allowed.includes(f.type)) {
        setError("Only JPG, PNG, WEBP, HEIC/HEIF images are allowed.");
        continue;
      }
      if (f.size > maxEach) {
        setError("Each image must be 5MB or smaller.");
        continue;
      }
      next.push({ file: f, url: URL.createObjectURL(f) });
    }

    setPhotos((prev) => [...prev, ...next].slice(0, maxCount));
    e.currentTarget.value = "";
  }

  function removePhoto(index: number) {
    setPhotos((prev) => {
      const copy = [...prev];
      const [removed] = copy.splice(index, 1);
      if (removed) URL.revokeObjectURL(removed.url);
      return copy;
    });
  }

  /* --------------------------------- Submit ---------------------------------- */

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError("");

    try {
      if (!selected) {
        toast.error("Please choose a service first.");
        setIsSubmitting(false);
        return;
      }

      const form = e.currentTarget as HTMLFormElement;
      const fd = new FormData(form);
      fd.set("service", selected.slug);
      photos.forEach((p) => fd.append("photos", p.file));

      // Submit to API
      const res = await fetch("/api/booking", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Failed to submit booking.");

      // Wait for conversion (non-blocking with timeout)
      await reportConversionAwait({ value: 1.0, currency: "EUR" }, 2000);

      toast.success("Booking request sent! We'll confirm shortly.");
      form.reset();
      setPhotos([]);
    } catch (err: unknown) {
      toast.error(
        getErrorMessage(err) || "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  /* ---------------------------------- UI ------------------------------------ */

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-extrabold text-slate-900">
          Book a Service
        </h1>

        {/* Selected pill */}
        <div className="flex items-center gap-3">
          <span className="text-slate-600">Selected:</span>
          {selected ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1.5 text-cyan-800 ring-1 ring-cyan-200">
              <selected.icon className="h-4 w-4" />
              <span className="font-medium">{selected.title}</span>
            </span>
          ) : (
            <span className="text-slate-400">— none —</span>
          )}
        </div>

        <ServicePickerModal
          value={service}
          onChange={setService}
          ctaText={selected ? "Change service" : "Choose a service"}
        />
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-sm"
      >
        {/* Date */}
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-700">
            Preferred date
          </label>
          <input
            type="date"
            name="date"
            required
            className="rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-600"
          />
        </div>

        {/* Details */}
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-700">
            Your details
          </label>
          <input
            name="name"
            placeholder="Full name"
            required
            className="rounded-md border border-slate-300 px-3 py-2"
          />
          <input
            name="phone"
            placeholder="Phone"
            required
            className="rounded-md border border-slate-300 px-3 py-2"
          />

          <div className="grid gap-3 sm:grid-cols-[1fr,200px]">
            <input
              name="address"
              placeholder="Address (Dublin)"
              required
              className="rounded-md border border-slate-300 px-3 py-2"
            />
            <input
              name="eircode"
              placeholder="Eircode (e.g., D01 F5P2)"
              required
              className="rounded-md border border-slate-300 px-3 py-2 uppercase"
            />
          </div>
        </div>

        {/* Problem description */}
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-700">
            Describe the issue
          </label>
          <textarea
            name="description"
            rows={4}
            required
            className="rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-600"
          />
        </div>

        {/* Photos */}
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-700">
            Add photos (optional)
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
            multiple
            onChange={onFilesChange}
            className="block w-full rounded-md border border-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-cyan-700 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-cyan-800"
          />

          {photos.length > 0 && (
            <div className="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {photos.map((p, idx) => (
                <div key={p.url} className="relative aspect-square">
                  <Image
                    src={p.url}
                    alt={`Upload ${idx + 1}`}
                    fill
                    sizes="(max-width: 640px) 33vw, 25vw"
                    className="rounded-md object-cover ring-1 ring-slate-200"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(idx)}
                    className="absolute right-1 top-1 rounded bg-black/60 px-1.5 py-0.5 text-xs text-white"
                    aria-label="Remove image"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-slate-500">
            Up to 5 images, 5MB each. JPG/PNG/WEBP/HEIC supported.
          </p>
        </div>

        <input type="hidden" name="service" value={selected?.slug ?? ""} />

        {error && <p className="text-sm text-rose-700">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-11 items-center justify-center rounded-lg bg-cyan-700 px-5 text-white font-medium hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-600 disabled:opacity-60"
        >
          {isSubmitting ? "Sending..." : "Request booking"}
        </button>
      </form>
    </main>
  );
}
