import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// ---------------------
// CREATE CONTACT (POST)
// ---------------------
export async function POST(req: Request) {
  try {
    const form = await req.formData();

    // Honeypot
    const honey = form.get("company");
    if (typeof honey === "string" && honey.trim().length > 0) {
      return NextResponse.json({ ok: true });
    }

    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    const phone = String(form.get("phone") ?? "");
    const date = String(form.get("date") ?? "");
    const service = String(form.get("service") ?? "");
    const message = String(form.get("message") ?? "");

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const db = await getDb();

    const result = await db.collection("contacts").insertOne({
      name,
      email,
      phone,
      date,
      service,
      message,
      createdAt: new Date(),
    });

    return NextResponse.json({
      ok: true,
      id: result.insertedId,
    });
  } catch (error) {
    console.error("CONTACT CREATE ERROR:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// ---------------------
// DELETE CONTACT
// ---------------------
export async function DELETE(
  _: Request,
  { params }: { params: { id: string } },
) {
  try {
    const db = await getDb();

    const result = await db.collection("contacts").deleteOne({
      _id: new ObjectId(params.id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("CONTACT DELETE ERROR:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
