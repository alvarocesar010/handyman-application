import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST() {
  try {
    const db = await getDb();

    const newCategory = {
      category: "New Category Name",
      subCategories: [],
      createdAt: new Date(),
    };

    const result = await db
      .collection("categoriesStore")
      .insertOne(newCategory);

    return NextResponse.json({
      success: true,
      id: result.insertedId,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Creation failed" }, { status: 500 });
  }
}
