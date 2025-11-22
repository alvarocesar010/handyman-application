import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export async function POST(req: Request) {
  const form = await req.formData();
  const id = String(form.get("id") ?? "");

  const baseUrl = process.env.SITE_URL ?? req.url;

  if (!id) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const db = await getDb();
  await db.collection("bookings").deleteOne({ _id: new ObjectId(id) });

  // Back to the list
  return NextResponse.redirect(new URL("/admin/bookings", baseUrl));
}
