import { AdminPhoto } from "./types";

export default function BookingPhotos({ photos }: { photos?: AdminPhoto[] }) {
  if (!photos || photos.length === 0) return null;

  return (
    <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
      {photos.map((p) => (
        <a
          key={p.id}
          href={`/api/booking/photo/${p.id}`}
          target="_blank"
          rel="noreferrer"
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
        </a>
      ))}
    </div>
  );
}
