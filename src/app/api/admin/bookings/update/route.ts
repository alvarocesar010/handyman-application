import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

type BookingUpdate = {
  updatedAt: Date;
  budget?: number;
  durationMinutes?: number;
  adminNotes?: string;
  startTime?: string;
};

export async function POST(req: Request) {
  const form = await req.formData();

  const id = String(form.get("id") ?? "");
  const budgetRaw = form.get("budget");
  const adminNotes = String(form.get("adminNotes") ?? "");
  const startTime = String(form.get("startTime") ?? "");
  const durationRaw = form.get("durationMinutes");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const budget =
    typeof budgetRaw === "string" && budgetRaw !== ""
      ? Number(budgetRaw)
      : undefined;

  const durationMinutes =
    typeof durationRaw === "string" && durationRaw !== ""
      ? Number(durationRaw)
      : undefined;

  // 👇 now TypeScript knows all possible fields
  const update: BookingUpdate = { updatedAt: new Date() };

  if (budget !== undefined && !Number.isNaN(budget)) {
    update.budget = budget;
  }

  if (durationMinutes !== undefined && !Number.isNaN(durationMinutes)) {
    update.durationMinutes = durationMinutes;
  }

  if (adminNotes) {
    update.adminNotes = adminNotes;
  }

  if (startTime) {
    update.startTime = startTime;
  }

  const db = await getDb();
  await db
    .collection("bookings")
    .updateOne({ _id: new ObjectId(id) }, { $set: update });

  const siteUrl = process.env.SITE_URL;
  let baseUrl: string;

  if (siteUrl === req.url) {
    // Use the external domain if available (best for production/Cloud Run)
    baseUrl = siteUrl;
  } else {
    // Fallback to req.url for local development (or if NEXT_PUBLIC_SITE_URL is not set)
    baseUrl = req.url;
  }

  // Use the determined base URL to construct the redirect URL
  const redirectUrl = new URL("/admin/bookings", baseUrl);
  const res = NextResponse.redirect(redirectUrl);

  return res;
}
