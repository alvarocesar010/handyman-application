import { getDb } from "@/lib/mongodb";
import { NextResponse } from "next/server";

function toTitleCase(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ") // remove extra spaces
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function POST(req: Request) {
  try {
    const db = await getDb();

    const formData = await req.formData();
    const type = String(formData.get("type"));
    const rawValue = String(formData.get("value"));
    const category = String(formData.get("category") ?? "");

    const value = toTitleCase(rawValue);

    if (!type || !value) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // STORE
    if (type === "stores") {
      const exists = await db.collection("stores").findOne({ value });

      if (exists) {
        return NextResponse.json(
          { error: `${value} already exists` },
          { status: 400 },
        );
      }

      const result = await db.collection("stores").insertOne({ value });

      return NextResponse.json({
        ok: true,
        store: { _id: result.insertedId, value },
      });
    }

    // CATEGORY
    if (type === "categories") {
      const exists = await db.collection("categories").findOne({ value });

      if (exists) {
        return NextResponse.json(
          { error: `${value} already exists` },
          { status: 400 },
        );
      }

      const result = await db.collection("categories").insertOne({
        value,
        sizes: [],
      });

      return NextResponse.json({
        ok: true,
        category: { _id: result.insertedId, value },
      });
    }

    // SIZE
    if (type === "sizes") {
      if (!category) {
        return NextResponse.json(
          { error: "Category is required for size" },
          { status: 400 },
        );
      }

      const categoryDoc = await db
        .collection("categories")
        .findOne({ value: category });

      if (!categoryDoc) {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 404 },
        );
      }

      await db.collection("categories").updateOne(
        { value: category },
        { $addToSet: { sizes: value } }, // prevents duplicates
      );

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Failed to create option" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const db = await getDb();

    const [stores, categories] = await Promise.all([
      db.collection("stores").find({}).toArray(),
      db.collection("categories").find({}).toArray(),
    ]);

    return NextResponse.json({
      stores: stores.map((s) => s.value),

      categories: categories.map((c) => ({
        value: c.value,
        sizes: c.sizes || [],
      })),
    });
  } catch (err) {
    console.log(err);

    return NextResponse.json(
      { error: "Failed to load options" },
      { status: 500 },
    );
  }
}
