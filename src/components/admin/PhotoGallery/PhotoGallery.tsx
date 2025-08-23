"use client";

import { useEffect, useState } from "react";

type Photo = { id: string; filename: string };

export default function PhotoGallery({ photos }: { photos: Photo[] }) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  function openAt(i: number) {
    setIdx(i);
    setOpen(true);
  }
  function close() {
    setOpen(false);
  }
  function next() {
    setIdx(i => (i + 1) % photos.length);
  }
  function prev() {
    setIdx(i => (i - 1 + photos.length) % photos.length);
  }

  // keyboard: Esc/←/→
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
        {photos.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => openAt(i)}
            className="block overflow-hidden rounded-md ring-1 ring-slate-200"
            title={p.filename}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/booking/photo/${p.id}`}
              alt={p.filename}
              className="h-24 w-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/80">
          <button
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 rounded bg-white/10 px-3 py-1.5 text-white hover:bg-white/20"
          >
            ✕
          </button>

          <button
            onClick={prev}
            aria-label="Previous"
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded bg-white/10 px-3 py-2 text-white hover:bg-white/20"
          >
            ‹
          </button>
          <button
            onClick={next}
            aria-label="Next"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded bg-white/10 px-3 py-2 text-white hover:bg-white/20"
          >
            ›
          </button>

          <div className="flex h-full items-center justify-center p-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/booking/photo/${photos[idx].id}`}
              alt={photos[idx].filename}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
