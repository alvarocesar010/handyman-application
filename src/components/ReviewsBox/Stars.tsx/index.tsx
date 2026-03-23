"use client";

import { useEffect, useState } from "react";

type Review = {
  rating: number;
};

export default function Stars({ serviceSlug }: { serviceSlug?: string }) {
  const [count, setCount] = useState(0);
  const [avg, setAvg] = useState(0);

  useEffect(() => {
    async function loadReviews() {
      try {
        const url = serviceSlug
          ? `/api/reviews?service=${serviceSlug}`
          : `/api/reviews`;

        const res = await fetch(url);
        const data = await res.json();

        const reviews: Review[] = data.reviews || [];

        const total = reviews.length;
        const average =
          total > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / total : 0;

        setCount(total);
        setAvg(Number(average.toFixed(1)));
      } catch (err) {
        console.error("Failed to load reviews", err);
      }
    }

    loadReviews();
  }, [serviceSlug]);

  return (
    <div className="my-3">
      <button
        onClick={() => {
          document
            .getElementById("reviews")
            ?.scrollIntoView({ behavior: "smooth" });
        }}
        className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
      >
        <span className="text-amber-500">★★★★★</span>
        <span>
          {avg || "—"} · {count} review{count !== 1 ? "s" : ""}
        </span>
      </button>
    </div>
  );
}
