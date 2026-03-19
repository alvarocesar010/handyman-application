"use client";

export default function Stars() {
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
        <span>4.9 · 120 reviews</span>
      </button>
    </div>
  );
}
