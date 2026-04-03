"use client";

import { Review } from "@/types/review";
import PhotoGallery from "../PhotoGallery";
import { Stars } from "./ReviewForm";

function formatIrishDate(iso: string) {
  return new Intl.DateTimeFormat("en-IE", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(iso));
}

export default function ReviewsList({ reviews }: { reviews: Review[] }) {
  if (!reviews.length) {
    return <p className="text-sm text-slate-600">No reviews yet.</p>;
  }

  return (
    <div className="max-h-[620px] overflow-y-auto space-y-3">
      {reviews.map((r) => (
        <article
          key={r._id}
          className="rounded-lg border border-slate-200 bg-white p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-medium text-slate-900">{r.customerName}</p>
              <p className="text-xs text-slate-500">
                {formatIrishDate(r.createdAtISO)}
              </p>
            </div>
            <Stars value={r.rating} />
          </div>

          <p className="mt-2 text-slate-700 whitespace-pre-line">{r.opinion}</p>

          {r.photoUrls?.length > 0 && (
            <div className="mt-3">
              <PhotoGallery photos={r.photoUrls} />
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
