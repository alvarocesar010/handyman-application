import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { weeklySchedule } from "@/lib/schedule";
import { toMinutes, overlaps } from "@/lib/time";
import type { Booking } from "@/lib/bookings";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const duration = Number(searchParams.get("duration") ?? 60);

  if (!date) return NextResponse.json([]);

  const weekday = new Date(date).getDay();
  const rule = weeklySchedule.find((r) => r.weekday === weekday);
  if (!rule) return NextResponse.json([]);

  const db = await getDb();

  const bookings = await db
    .collection<Booking>("bookings")
    .find({
      serviceDate: date,
      status: { $in: ["pending", "confirmed"] },
    })
    .toArray();

  const start = toMinutes(rule.start);
  const end = toMinutes(rule.end);

  const slots: string[] = [];

  for (let t = start; t + duration <= end; t += rule.interval) {
    const conflict = bookings.some((b) =>
      overlaps(t, duration, toMinutes(b.startTime), b.durationMinutes)
    );

    if (!conflict) {
      const h = String(Math.floor(t / 60)).padStart(2, "0");
      const m = String(t % 60).padStart(2, "0");
      slots.push(`${h}:${m}`);
    }
  }

  return NextResponse.json(slots);
}
