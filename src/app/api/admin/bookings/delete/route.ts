import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const id = String(form.get("id") ?? "");

    if (!id) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const db = await getDb();

    const result = await db
      .collection("bookings")
      .deleteOne({ _id: new ObjectId(id) });

    if (!result.deletedCount) {
      return NextResponse.json(
        { error: "Booking not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Delete booking error:", err);

    return NextResponse.json(
      { error: "Failed to delete booking." },
      { status: 500 },
    );
  }
}
