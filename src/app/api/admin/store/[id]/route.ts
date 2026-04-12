import { NextRequest, NextResponse } from "next/server"; // Use NextRequest for better typing
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { deleteImage } from "@/lib/uploadImage";
import { SubCategory } from "@/lib/store/getCategoryBySlug";

export type CategoryDB = {
  _id: ObjectId;
  category: string;
  subCategories: SubCategory[];
};

// --- UPDATE PUT ---
export async function PUT(
  request: NextRequest, // Changed to NextRequest
  { params }: { params: Promise<{ id: string }> }, // Wrap in Promise
) {
  try {
    const db = await getDb();
    const { id } = await params; // Now this matches the type above

    const body = (await request.json()) as {
      category: string;
      subCategories: SubCategory[];
    };

    const existing = await db
      .collection<CategoryDB>("categoriesStore")
      .findOne({ _id: new ObjectId(id) });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const oldSubs = existing.subCategories;
    const newSubs = body.subCategories;

    const newMap = new Map(newSubs.map((s) => [s._id, s]));

    for (const oldSub of oldSubs) {
      const newSub = newMap.get(oldSub._id);
      if (!newSub) {
        if (oldSub.photoPath) await deleteImage(oldSub.photoPath);
        continue;
      }
      if (oldSub.photoPath && oldSub.photoPath !== newSub.photoPath) {
        await deleteImage(oldSub.photoPath);
      }
    }

    await db.collection("categoriesStore").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          category: body.category,
          subCategories: newSubs,
        },
      },
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// --- UPDATE DELETE ---
export async function DELETE(
  request: NextRequest, // Changed to NextRequest
  { params }: { params: Promise<{ id: string }> }, // Wrap in Promise
) {
  try {
    const db = await getDb();
    const { id } = await params; // Now this matches the type above

    const existing = await db
      .collection<CategoryDB>("categoriesStore")
      .findOne({ _id: new ObjectId(id) });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    for (const sub of existing.subCategories || []) {
      if (sub.photoPath) {
        await deleteImage(sub.photoPath);
      }
    }

    const result = await db.collection("categoriesStore").deleteOne({
      _id: new ObjectId(id),
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json(
      { error: "Delete failed", log: error },
      { status: 500 },
    );
  }
}