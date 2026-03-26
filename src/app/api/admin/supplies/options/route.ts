import { getDb } from "@/lib/mongodb";
import { NextResponse } from "next/server";

// Utility to keep naming consistent (e.g., "internal doors" -> "Internal Doors")
function toTitleCase(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function POST(req: Request) {
  try {
    const db = await getDb();

    // Changed from req.formData() to req.json() to match the frontend fetch call
    const body = await req.json();
    const { type, category: categoryName } = body;
    const rawValue = body.value;

    if (!type || !rawValue) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const value = toTitleCase(rawValue);

    // --- STORE ---
    if (type === "store") {
      const exists = await db.collection("stores").findOne({ value });
      if (exists) {
        return NextResponse.json(
          { error: "Store already exists" },
          { status: 400 },
        );
      }

      const result = await db.collection("stores").insertOne({ value });
      return NextResponse.json({
        ok: true,
        store: { _id: result.insertedId, value },
      });
    }

    // --- CATEGORY ---
    if (type === "category") {
      const exists = await db.collection("categories").findOne({ value });
      if (exists) {
        return NextResponse.json(
          { error: "Category already exists" },
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

    // --- SIZE ---
    if (type === "size") {
      if (!categoryName) {
        return NextResponse.json(
          { error: "Category is required for size" },
          { status: 400 },
        );
      }

      const categoryDoc = await db
        .collection("categories")
        .findOne({ value: categoryName });
      if (!categoryDoc) {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 404 },
        );
      }

      await db.collection("categories").updateOne(
        { value: categoryName },
        { $addToSet: { sizes: value } }, // Using $addToSet to avoid duplicate sizes
      );

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (err) {
    console.error("API_OPTIONS_POST_ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const db = await getDb();

    // Fetch both collections in parallel
    const [stores, categories] = await Promise.all([
      db.collection("stores").find({}).sort({ value: 1 }).toArray(),
      db.collection("categories").find({}).sort({ value: 1 }).toArray(),
    ]);

    return NextResponse.json({
      stores: stores.map((s) => s.value),
      categories: categories.map((c) => ({
        value: c.value,
        sizes: c.sizes || [],
      })),
    });
  } catch (err) {
    console.error("API_OPTIONS_GET_ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load options" },
      { status: 500 },
    );
  }
}
