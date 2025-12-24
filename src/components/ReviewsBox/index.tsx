"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

type Review = {
  _id: string;
  serviceSlug: string;
  customerName: string;
  rating: number;
  opinion: string;
  photoUrls: string[];
  createdAtISO: string;
};

type LocalPhoto = { file: File; url: string };

const MAX_COUNT = 5;
const MAX_EACH = 5 * 1024 * 1024;
const MAX_OPINION_LEN = 500;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

function formatIrishDate(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-IE", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(d);
}

function Stars({
  value,
  onChange,
}: {
  value: number;
  onChange?: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const n = i + 1;
        const active = n <= value;
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange?.(n)}
            className={[
              "text-xl leading-none",
              active ? "text-amber-500" : "text-slate-300",
              onChange ? "hover:opacity-80" : "cursor-default",
            ].join(" ")}
            aria-label={`${n} star`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}

export default function ReviewsBox({ serviceSlug }: { serviceSlug: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [customerName, setCustomerName] = useState("");
  const [rating, setRating] = useState(5);
  const [opinion, setOpinion] = useState("");
  const [photos, setPhotos] = useState<LocalPhoto[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const cameraRef = useRef<HTMLInputElement | null>(null);
  const galleryRef = useRef<HTMLInputElement | null>(null);

  const [lightbox, setLightbox] = useState<{
    open: boolean;
    reviewIndex: number;
    photoIndex: number;
  }>({ open: false, reviewIndex: 0, photoIndex: 0 });

  const currentPhotoUrl = useMemo(() => {
    if (!lightbox.open) return "";
    const r = reviews[lightbox.reviewIndex];
    return r?.photoUrls?.[lightbox.photoIndex] ?? "";
  }, [lightbox, reviews]);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `/api/reviews?service=${encodeURIComponent(serviceSlug)}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load reviews.");
      setReviews(data.reviews ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceSlug]);

  function onFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError("");
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const next: LocalPhoto[] = [];
    for (const f of files) {
      if (!ALLOWED.has(f.type)) {
        setError("Only JPG, PNG, and WEBP images are allowed.");
        continue;
      }
      if (f.size > MAX_EACH) {
        setError("Each image must be 5MB or smaller.");
        continue;
      }
      next.push({ file: f, url: URL.createObjectURL(f) });
    }

    setPhotos((prev) => [...prev, ...next].slice(0, MAX_COUNT));
    e.currentTarget.value = "";
  }

  function removeLocalPhoto(index: number) {
    setPhotos((prev) => {
      const copy = [...prev];
      const [removed] = copy.splice(index, 1);
      if (removed) URL.revokeObjectURL(removed.url);
      return copy;
    });
  }

  function clearLocalPhotos() {
    setPhotos((prev) => {
      prev.forEach((p) => URL.revokeObjectURL(p.url));
      return [];
    });
  }

  async function submitReview() {
    if (submitting) return;
    setError("");

    if (!customerName.trim()) return setError("Please enter your name.");
    if (!opinion.trim()) return setError("Please write your review.");
    if (opinion.trim().length > MAX_OPINION_LEN) {
      return setError(`Review must be ${MAX_OPINION_LEN} characters or less.`);
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.set("serviceSlug", serviceSlug);
      fd.set("customerName", customerName.trim());
      fd.set("rating", String(rating));
      fd.set("opinion", opinion.trim());
      photos.forEach((p) => fd.append("photos", p.file));

      const res = await fetch("/api/reviews", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to submit review.");

      setCustomerName("");
      setRating(5);
      setOpinion("");
      clearLocalPhotos();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  }

  function openLightbox(reviewIndex: number, photoIndex: number) {
    setLightbox({ open: true, reviewIndex, photoIndex });
  }

  function nextPhoto(delta: number) {
    const r = reviews[lightbox.reviewIndex];
    if (!r?.photoUrls?.length) return;
    const total = r.photoUrls.length;
    const next = (lightbox.photoIndex + delta + total) % total;
    setLightbox((s) => ({ ...s, photoIndex: next }));
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">Reviews</h3>
        <p className="text-sm text-slate-600">
          Reviews for this service. Photos open larger in-page.
        </p>
      </div>

      {/* Add review */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
        <div className="grid gap-2 sm:grid-cols-[1fr,200px]">
          <div className="grid gap-1">
            <label className="text-sm font-medium text-slate-700">
              Your name
            </label>
            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2"
              placeholder="e.g., Aoife"
            />
          </div>

          <div className="grid gap-1">
            <label className="text-sm font-medium text-slate-700">Rating</label>
            <div className="h-10 flex items-center">
              <Stars value={rating} onChange={setRating} />
            </div>
          </div>
        </div>

        {/* Opinion */}
        <div className="grid gap-1">
          <label className="text-sm font-medium text-slate-700">
            Your review
          </label>
          <textarea
            value={opinion}
            onChange={(e) => setOpinion(e.target.value)}
            rows={4}
            maxLength={MAX_OPINION_LEN}
            placeholder="Describe your experience with this service..."
            className="rounded-md border border-slate-300 px-3 py-2 resize-y focus:outline-none focus:ring-2 focus:ring-cyan-600"
          />
          <p className="text-xs text-slate-500">
            {opinion.length}/{MAX_OPINION_LEN}
          </p>
        </div>

        {/* Hidden inputs */}
        <input
          ref={cameraRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          capture="environment"
          onChange={onFilesChange}
          className="hidden"
        />
        <input
          ref={galleryRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={onFilesChange}
          className="hidden"
        />

        {/* Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => cameraRef.current?.click()}
            className="inline-flex items-center justify-center rounded-md bg-cyan-700 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-800"
          >
            Take photo
          </button>
          <button
            type="button"
            onClick={() => galleryRef.current?.click()}
            className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Choose from gallery
          </button>
          {photos.length > 0 && (
            <button
              type="button"
              onClick={clearLocalPhotos}
              className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Clear
            </button>
          )}
        </div>

        {/* Local previews */}
        {photos.length > 0 && (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {photos.map((p, idx) => (
              <div key={p.url} className="relative aspect-square">
                <Image
                  src={p.url}
                  alt={`New photo ${idx + 1}`}
                  fill
                  sizes="(max-width: 640px) 33vw, 20vw"
                  className="rounded-md object-cover ring-1 ring-slate-200"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={() => removeLocalPhoto(idx)}
                  className="absolute right-1 top-1 rounded bg-black/60 px-1.5 py-0.5 text-xs text-white"
                  aria-label="Remove image"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            Up to 5 images, 5MB each. JPG/PNG/WEBP recommended.
          </p>
          <button
            type="button"
            disabled={submitting}
            onClick={submitReview}
            className="inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-4 text-sm font-medium text-white hover:bg-black disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit review"}
          </button>
        </div>

        {error && <p className="text-sm text-rose-700">{error}</p>}
      </div>

      {/* Reviews list */}
      <div className="space-y-3">
        {loading ? (
          <p className="text-sm text-slate-500">Loading reviews…</p>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-slate-600">No reviews yet.</p>
        ) : (
          <div className="max-h-[520px] overflow-y-auto pr-2 space-y-3">
            {reviews.map((r, idx) => (
              <article
                key={r._id}
                className="rounded-lg border border-slate-200 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900">
                      {r.customerName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatIrishDate(r.createdAtISO)}
                    </p>
                  </div>
                  <Stars value={r.rating} />
                </div>

                <p className="mt-2 text-slate-700 whitespace-pre-line">
                  {r.opinion}
                </p>

                {r.photoUrls?.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-6">
                    {r.photoUrls.map((url, pIdx) => (
                      <button
                        key={url}
                        type="button"
                        onClick={() => openLightbox(idx, pIdx)}
                        className="relative aspect-square"
                        aria-label="Open photo"
                      >
                        <Image
                          src={url}
                          alt={`Review photo ${pIdx + 1}`}
                          fill
                          sizes="(max-width: 640px) 33vw, 16vw"
                          className="rounded-md object-cover ring-1 ring-slate-200"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>

      {/* In-page lightbox */}
      {lightbox.open && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-900">
                {reviews[lightbox.reviewIndex]?.customerName} ·{" "}
                {formatIrishDate(reviews[lightbox.reviewIndex]?.createdAtISO)}
              </p>
              <div className="mt-1">
                <Stars value={reviews[lightbox.reviewIndex]?.rating ?? 0} />
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setLightbox({ open: false, reviewIndex: 0, photoIndex: 0 })
              }
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
            >
              Close
            </button>
          </div>

          <p className="text-slate-700 whitespace-pre-line">
            {reviews[lightbox.reviewIndex]?.opinion}
          </p>

          <div className="relative w-full aspect-[16/10] bg-white rounded-lg overflow-hidden ring-1 ring-slate-200">
            {currentPhotoUrl && (
              <Image
                src={currentPhotoUrl}
                alt="Large review photo"
                fill
                sizes="(max-width: 768px) 100vw, 700px"
                className="object-contain"
              />
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => nextPhoto(-1)}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => nextPhoto(1)}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
