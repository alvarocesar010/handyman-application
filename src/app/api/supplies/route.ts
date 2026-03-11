import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = await getDb();

    const supplyDoc = {
      name: body.name,
      price: parseFloat(body.price),
      store: body.store,
      description: body.description,
      link: body.link,
      category: body.category,
      createdAt: new Date(),
    };

    const result = await db.collection("supplies").insertOne(supplyDoc);
    return NextResponse.json({ ok: true, id: result.insertedId });
  } catch (err) {
    return NextResponse.json({ error: "Failed to save item" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = await getDb();
    const items = await db
      .collection("supplies")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json(items);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id)
      return NextResponse.json({ error: "ID required" }, { status: 400 });

    const db = await getDb();
    await db.collection("supplies").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const db = await getDb();
    
    // We remove _id from the update body because MongoDB doesn't allow changing the ID
    const { _id, ...updateData } = body;

    await db.collection("supplies").updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}