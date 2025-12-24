import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

type BookingUpdate = {
  updatedAt: Date;

  // existing
  budget?: number;
  durationMinutes?: number;
  adminNotes?: string;
  startTime?: string;

  // new fields
  serviceDate?: string; // YYYY-MM-DD (real date)

  amountReceived?: number;
  tipReceived?: number;
  finishTime?: string; // HH:mm
  actualDurationMinutes?: number;
};

function parseNumberOrUndefined(
  v: FormDataEntryValue | null
): number | undefined {
  if (typeof v !== "string" || v.trim() === "") return undefined;
  const n = Number(v);
  return Number.isNaN(n) ? undefined : n;
}

function parseStringOrUndefined(
  v: FormDataEntryValue | null
): string | undefined {
  if (typeof v !== "string") return undefined;
  const s = v.trim();
  return s === "" ? undefined : s;
}

function isISODate(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

export async function POST(req: Request) {
  const form = await req.formData();

  const id = parseStringOrUndefined(form.get("id"));
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  // existing fields
  const budget = parseNumberOrUndefined(form.get("budget"));
  const durationMinutes = parseNumberOrUndefined(form.get("durationMinutes"));
  const adminNotes = parseStringOrUndefined(form.get("adminNotes"));
  const startTime = parseStringOrUndefined(form.get("startTime"));

  // new fields
  const serviceDateRaw = parseStringOrUndefined(form.get("serviceDate"));
  const amountReceived = parseNumberOrUndefined(form.get("amountReceived"));
  const tipReceived = parseNumberOrUndefined(form.get("tipReceived"));
  const finishTime = parseStringOrUndefined(form.get("finishTime"));
  const actualDurationMinutes = parseNumberOrUndefined(
    form.get("actualDurationMinutes")
  );

  // ✅ declare update BEFORE using it
  const update: BookingUpdate = { updatedAt: new Date() };

  if (budget !== undefined) update.budget = budget;
  if (durationMinutes !== undefined) update.durationMinutes = durationMinutes;
  if (adminNotes !== undefined) update.adminNotes = adminNotes;
  if (startTime !== undefined) update.startTime = startTime;

  if (serviceDateRaw && isISODate(serviceDateRaw)) {
    update.serviceDate = serviceDateRaw;
  }

  if (amountReceived !== undefined) update.amountReceived = amountReceived;
  if (tipReceived !== undefined) update.tipReceived = tipReceived;
  if (finishTime !== undefined) update.finishTime = finishTime;
  if (actualDurationMinutes !== undefined) {
    update.actualDurationMinutes = actualDurationMinutes;
  }

  const db = await getDb();
  await db
    .collection("bookings")
    .updateOne({ _id: new ObjectId(id) }, { $set: update });

  const siteUrl = process.env.SITE_URL;
  if (!siteUrl) {
    // dev fallback
    return NextResponse.redirect(new URL("/admin/bookings", req.url));
  }

  return NextResponse.redirect(new URL("/admin/bookings", siteUrl));
}
