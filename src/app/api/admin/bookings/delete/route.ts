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

  // Use the determined base URL to construct the redirect URL
  const redirectUrl = new URL("/admin/bookings", siteUrl);
  const res = NextResponse.redirect(redirectUrl);
  return res;
}
