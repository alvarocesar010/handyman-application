import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb"; // 1. Fix: Ensure this import exists
import { Storage } from "@google-cloud/storage";

// Initialize GCS
const storage = new Storage({
  projectId: process.env.GCS_PROJECT_ID,
  // For local dev, ensure your key file is accessible or use ENV vars
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});
const bucket = storage.bucket(process.env.GCS_BUCKET_NAME!);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const db = await getDb();

    // Handle Photos
    const category = (formData.get("category") as string) || "unacategorized";
    const folderCategory = category.toLocaleLowerCase().replace(/\s+/g, "-");

    const photos = formData.getAll("photos") as File[];
    const uploadedUrls: string[] = [];

    for (const file of photos) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `supplies/${folderCategory}/${Date.now()}-${file.name.replace(/\s/g, "_")}`;
      const gcsFile = bucket.file(fileName);

      await gcsFile.save(buffer, {
        contentType: file.type,
        metadata: { cacheControl: "public, max-age=31536000" },
      });
      uploadedUrls.push(
        `https://storage.googleapis.com/${bucket.name}/${fileName}`,
      );
    }

    const supplyDoc = {
      name: formData.get("name"),
      price: parseFloat(formData.get("price") as string),
      store: formData.get("store"),
      description: formData.get("description"),
      link: formData.get("link"),
      category: formData.get("category"),
      photos: uploadedUrls,
      createdAt: new Date(),
    };

    const result = await db.collection("supplies").insertOne(supplyDoc);
    return NextResponse.json({ ok: true, id: result.insertedId });
  } catch (err) {
    console.error("POST Error:", err); // Fix: Use 'err' so ESLint is happy
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
    console.error("GET Error:", err);
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

    // 1. Find the item first to get the photo URLs
    const item = await db
      .collection("supplies")
      .findOne({ _id: new ObjectId(id) });

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // 2. Delete photos from GCS if they exist
    if (item.photos && Array.isArray(item.photos)) {
      for (const url of item.photos) {
        try {
          // Extract the filename from the URL
          // URL: https://storage.googleapis.com/bucket-name/supplies/category/file.png
          // We need: supplies/category/file.png
          const fileName = url.split(`${bucket.name}/`)[1];

          if (fileName) {
            await bucket.file(fileName).delete();
            console.log(`Deleted GCS file: ${fileName}`);
          }
        } catch (fileErr) {
          // We log the error but don't stop the process
          // (in case the file was already manually deleted)
          console.error("GCS File Delete Error:", fileErr);
        }
      }
    }

    // 3. Finally, delete the record from MongoDB
    await db.collection("supplies").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE Error:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();

    if (!id)
      return NextResponse.json({ error: "ID required" }, { status: 400 });

    const db = await getDb();

    // 2. Fix: Prefix unused variables with underscore to satisfy ESLint
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...updateData } = body;

    await db
      .collection("supplies")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...updateData, updatedAt: new Date() } },
      );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("PUT Error:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
