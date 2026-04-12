import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { deleteImage } from "@/lib/uploadImage";
import { SubCategory } from "@/lib/store/getCategoryBySlug";

export type CategoryDB = {
  _id: ObjectId;
  category: string;
  subCategories: SubCategory[];
};

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const db = await getDb();
    const { id } = await params;

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

    // 🔥 Compare OLD vs NEW
    const newMap = new Map(newSubs.map((s) => [s._id, s]));

    for (const oldSub of oldSubs) {
      const newSub = newMap.get(oldSub._id);

      // ❌ removed subcategory
      if (!newSub) {
        if (oldSub.photoPath) {
          await deleteImage(oldSub.photoPath);
        }
        continue;
      }

      // 🔄 replaced image
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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const db = await getDb();
    const { id } = await params;

    // ✅ Typed fetch (important)
    const existing = await db
      .collection<CategoryDB>("categoriesStore")
      .findOne({ _id: new ObjectId(id) });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // ✅ Delete all images
    for (const sub of existing.subCategories || []) {
      if (sub.photoPath) {
        await deleteImage(sub.photoPath);
      }
    }

    // ✅ Delete document
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
