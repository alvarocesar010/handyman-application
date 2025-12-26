import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

type BookingStatus = "pending" | "confirmed" | "done" | "cancelled";

type BookingUpdate = {
  updatedAt: Date;

  // status
  status?: BookingStatus;

  // scheduling / dates
  serviceDate?: string; // YYYY-MM-DD (real service date)

  // job details
  budget?: number;
  durationMinutes?: number;
  startTime?: string;

  // done details
  amountReceived?: number;
  tipReceived?: number;
  finishTime?: string; // HH:mm
  actualDurationMinutes?: number;

  // notes
  adminNotes?: string;
};

function parseNumberOrUndefined(
  v: FormDataEntryValue | null
): number | undefined {
  if (typeof v !== "string") return undefined;
  const s = v.trim();
  if (s === "") return undefined;
  const n = Number(s);
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

function isStatus(s: string): s is BookingStatus {
  return (
    s === "pending" || s === "confirmed" || s === "done" || s === "cancelled"
  );
}

export async function POST(req: Request) {
  const form = await req.formData();

  const id = parseStringOrUndefined(form.get("id"));
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const update: BookingUpdate = { updatedAt: new Date() };

  // ✅ status
  const statusRaw = parseStringOrUndefined(form.get("status"));
  if (statusRaw && isStatus(statusRaw)) {
    update.status = statusRaw;
  }

  // ✅ dates
  const serviceDateRaw = parseStringOrUndefined(form.get("serviceDate"));
  if (serviceDateRaw && isISODate(serviceDateRaw)) {
    update.serviceDate = serviceDateRaw;
  }

  // ✅ existing fields
  const budget = parseNumberOrUndefined(form.get("budget"));
  if (budget !== undefined) update.budget = budget;

  const durationMinutes = parseNumberOrUndefined(form.get("durationMinutes"));
  if (durationMinutes !== undefined) update.durationMinutes = durationMinutes;

  const startTime = parseStringOrUndefined(form.get("startTime"));
  if (startTime !== undefined) update.startTime = startTime;

  const adminNotes = parseStringOrUndefined(form.get("adminNotes"));
  if (adminNotes !== undefined) update.adminNotes = adminNotes;

  // ✅ done fields
  const amountReceived = parseNumberOrUndefined(form.get("amountReceived"));
  if (amountReceived !== undefined) update.amountReceived = amountReceived;

  const tipReceived = parseNumberOrUndefined(form.get("tipReceived"));
  if (tipReceived !== undefined) update.tipReceived = tipReceived;

  const finishTime = parseStringOrUndefined(form.get("finishTime"));
  if (finishTime !== undefined) update.finishTime = finishTime;

  const actualDurationMinutes = parseNumberOrUndefined(
    form.get("actualDurationMinutes")
  );
  if (actualDurationMinutes !== undefined) {
    update.actualDurationMinutes = actualDurationMinutes;
  }

  const db = await getDb();
  await db
    .collection("bookings")
    .updateOne({ _id: new ObjectId(id) }, { $set: update });

  // redirect back
  const siteUrl = process.env.SITE_URL;
  if (!siteUrl) {
    return NextResponse.redirect(new URL("/admin/bookings", req.url));
  }
  return NextResponse.redirect(new URL("/admin/bookings", siteUrl));
}
