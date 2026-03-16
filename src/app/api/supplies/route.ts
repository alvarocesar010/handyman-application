import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { Storage } from "@google-cloud/storage";

// Initialize GCS
function getBucket() {
  const bucketName = process.env.GCS_BUCKET_NAME;

  if (!bucketName) {
    throw new Error("GCS_BUCKET_NAME is not defined");
  }

  const storage = new Storage({
    projectId: process.env.GCS_PROJECT_ID,
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  });

  return storage.bucket(bucketName);
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const db = await getDb();

    const category = (formData.get("category") as string) || "unacategorized";
    const folderCategory = category.toLowerCase().replace(/\s+/g, "-");

    const photos = formData.getAll("photos") as File[];
    const uploadedUrls: string[] = [];

    const bucket = getBucket();

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
    console.error("POST Error:", err);
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

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const db = await getDb();

    const item = await db
      .collection("supplies")
      .findOne({ _id: new ObjectId(id) });

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    if (item.photos && Array.isArray(item.photos)) {
      const bucket = getBucket();

      for (const url of item.photos) {
        try {
          const fileName = url.split(`${bucket.name}/`)[1];

          if (fileName) {
            await bucket.file(fileName).delete();
            console.log(`Deleted GCS file: ${fileName}`);
          }
        } catch (fileErr) {
          console.error("GCS File Delete Error:", fileErr);
        }
      }
    }

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

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const db = await getDb();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...updateData } = body;

    await db.collection("supplies").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("PUT Error:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
