import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { weeklySchedule } from "@/lib/schedule";
import { toMinutes, overlaps } from "@/lib/time";
import type { Booking } from "@/lib/bookings";

async function hasAvailability(
  date: string,
  duration: number,
  dayBookings: Booking[]
): Promise<boolean> {
  const weekday = new Date(date).getDay();
  const rule = weeklySchedule.find((r) => r.weekday === weekday);
  if (!rule) return false;

  const start = toMinutes(rule.start);
  const end = toMinutes(rule.end);

  for (let t = start; t + duration <= end; t += rule.interval) {
    const conflict = dayBookings.some((b) =>
      overlaps(t, duration, toMinutes(b.startTime), b.durationMinutes)
    );

    if (!conflict) return true;
  }

  return false;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const duration = Number(searchParams.get("duration") ?? 60);

  const db = await getDb();

  const today = new Date();
  const days: string[] = [];

  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d.toISOString().slice(0, 10));
  }

  const bookings = await db
    .collection<Booking>("bookings")
    .find({
      serviceDate: { $in: days },
      status: { $in: ["pending", "confirmed"] },
    })
    .toArray();

  const availableDays: string[] = [];
  const blockedDays: string[] = [];

  for (const day of days) {
    const dayBookings = bookings.filter((b) => b.serviceDate === day);

    const ok = await hasAvailability(day, duration, dayBookings);
    (ok ? availableDays : blockedDays).push(day);
  }

  return NextResponse.json({ availableDays, blockedDays });
}
