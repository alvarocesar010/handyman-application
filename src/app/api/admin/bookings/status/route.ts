import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export async function POST(req: Request) {
  const form = await req.formData();
  const id = String(form.get("id") ?? "");
  const status = String(form.get("status") ?? "");

  if (!id || !["pending", "confirmed", "done", "cancelled"].includes(status)) {
    return NextResponse.json(
      { error: "Invalid id or status" },
      { status: 400 }
    );
  }

  const db = await getDb();
  await db
    .collection("bookings")
    .updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } }
    );

  // Redirect back to the list
  return NextResponse.redirect(new URL("/admin/bookings", req.url));
}
