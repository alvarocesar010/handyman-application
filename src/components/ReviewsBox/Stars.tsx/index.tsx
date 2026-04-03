"use client";

type Props = {
  avg: number;
  count: number;
};

export default function Stars({ avg, count }: Props) {
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
