import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export async function POST(req: Request) {
  const form = await req.formData();
  const id = String(form.get("id") ?? "");

  if (!id) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const db = await getDb();
  await db.collection("bookings").deleteOne({ _id: new ObjectId(id) });

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
