"use client";

import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export default function DateTimeAvailabilityField({
  durationMinutes = 60,
}: {
  durationMinutes?: number;
}) {
  const [selected, setSelected] = useState<Date | undefined>();
  const [dateSelected, setDateSelected] = useState(false);

  const [available, setAvailable] = useState<Date[]>([]);
  const [blocked, setBlocked] = useState<Date[]>([]);
  const [slots, setSlots] = useState<string[]>([]);
  const [time, setTime] = useState("");

  // Load calendar availability
  useEffect(() => {
    fetch(`/api/calendar-availability?duration=${durationMinutes}`)
      .then((r) => r.json())
      .then((d) => {
        setAvailable(d.availableDays.map((x: string) => new Date(x)));
        setBlocked(d.blockedDays.map((x: string) => new Date(x)));
      });
  }, [durationMinutes]);

  // Load slots when a day is selected
  useEffect(() => {
    if (!selected) {
      setSlots([]);
      setDateSelected(false);
      setTime("");
      return;
    }

    const date = selected.toISOString().slice(0, 10);
    setDateSelected(true);
    setTime("");

    fetch(`/api/availability?date=${date}&duration=${durationMinutes}`)
      .then((r) => r.json())
      .then(setSlots);
  }, [selected, durationMinutes]);

  const isoDate = selected ? selected.toISOString().slice(0, 10) : "";

  return (
    <div className="space-y-4">
      {/* Preferred date */}
      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-700">
          Preferred date
        </label>

        <DayPicker
          mode="single"
          selected={selected}
          onSelect={setSelected}
          disabled={blocked}
          modifiers={{ available, blocked }}
          modifiersClassNames={{
            available: "bg-green-100 text-green-800",
            blocked: "bg-red-100 text-red-600 line-through",
          }}
        />

        <input type="hidden" name="date" value={isoDate} />
      </div>

      {/* Preferred time */}
      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-700">
          Preferred time
        </label>

        <select
          name="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required={dateSelected && slots.length > 0}
          disabled={!dateSelected || slots.length === 0}
          className="w-full rounded-md border px-3 py-2 disabled:bg-slate-100"
        >
          {!dateSelected && <option value="">Select a date first</option>}

          {dateSelected && slots.length === 0 && (
            <option value="">No availability</option>
          )}

          {dateSelected && slots.length > 0 && (
            <>
              <option value="">Select a time</option>
              {slots.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </>
          )}
        </select>
      </div>
    </div>
  );
}
