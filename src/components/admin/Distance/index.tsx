"use client";

import { useEffect, useState } from "react";

interface DistanceInfoProps {
  eircode: string;
}

interface DistanceApiResult {
  origin: string;
  destination: string;
  distance: string;
  duration: number;
  cost: number;
}

export default function DistanceInfo({ eircode }: DistanceInfoProps) {
  const [result, setResult] = useState<DistanceApiResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (eircode.trim().length < 4) {
      setResult(null);
      setError("");
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");
        setResult(null);

        const res = await fetch("/api/distance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eircode }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Unknown error");
        } else {
          setResult(data as DistanceApiResult);
        }
      } catch {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    }, 1500); // debounce

    return () => clearTimeout(timer);
  }, [eircode]);

  if (!eircode) return null;

  if (loading) return <p className="text-blue-600">Calculating…</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!result) return null;

  return (
    <div className="mt-4 rounded-lg bg-gray-100 p-4 space-y-1">
      <p>
        <span className="font-semibold">From:</span> {result.origin}
      </p>
      <p>
        <span className="font-semibold">To:</span> {result.destination}
      </p>
      <p>
        <span className="font-semibold">Distance:</span> {result.distance}
      </p>
      <p>
        <span className="font-semibold">Duration:</span> {result.duration} min
      </p>
      <p className="font-semibold">Total cost: €{result.cost.toFixed(2)}</p>
    </div>
  );
}
