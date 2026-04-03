"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";

type Photo = {
  id: string;
  filename: string;
};

export default function PhotoGallery({ photos }: { photos: Photo[] }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const openAt = (i: number) => {
    setIndex(i);
    setOpen(true);
  };

  const close = () => setOpen(false);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % photos.length);
  }, [photos.length]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + photos.length) % photos.length);
  }, [photos.length]);

  useEffect(() => {
    if (!open) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") close();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, next, prev]);

  // ✅ move this AFTER hooks
  if (!photos?.length) return null;

  return (
    <>
      {/* GRID */}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {photos.map((p, i) => (
          <button
            key={p.id}
            onClick={() => openAt(i)}
            className="relative aspect-square overflow-hidden rounded-md"
          >
            <Image
              src={p.filename}
              alt="Review photo"
              fill
              sizes="(max-width: 640px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          </button>
        ))}
      </div>

      {/* MODAL */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={close}
        >
          {/* LEFT */}
          <div
            className="absolute left-0 top-0 h-full w-1/2 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
          />

          {/* RIGHT */}
          <div
            className="absolute right-0 top-0 h-full w-1/2 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
          />

          {/* IMAGE */}
          <div className="relative w-[95vw] h-[85vh] pointer-events-none">
            <Image
              src={photos[index].filename}
              alt="Expanded"
              fill
              priority
              sizes="95vw"
              className="object-contain"
            />
          </div>

          {/* CLOSE */}
          <button
            onClick={close}
            className="absolute top-4 right-4 text-white text-2xl z-50"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}
