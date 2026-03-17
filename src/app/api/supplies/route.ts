import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { Storage } from "@google-cloud/storage";
import { uploadReviewImage, signImage } from "@/lib/gcs";

const MAX_FILES = 5;
const MAX_EACH_BYTES = 5 * 1024 * 1024;

// Allowed formats for consistent display
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);
const SIGNED_URL_EXPIRES_SECONDS = 7 * 24 * 60 * 60;

function toTitleCase(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ") // remove extra spaces
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFD") // split accents (á → a + ́)
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9\s-]/g, "") // remove special chars
    .replace(/\s+/g, "-") // spaces → hyphen
    .replace(/-+/g, "-"); // remove duplicated hyphens
}

// Initialize GCS
function getBucket() {
  const bucketName = process.env.GCS_BUCKET_NAME;

  if (!bucketName) {
    throw new Error("GCS_BUCKET_NAME is not defined");
  }

  const devep = process.env.DEV_MODE;
  let keyFilename: string | undefined;

  if (devep === "true") {
    keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  }
  const storage = new Storage({
    projectId: process.env.GCS_PROJECT_ID,
    keyFilename,
  });

  return storage.bucket(bucketName);
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const db = await getDb();

    const rawCategory =
      (formData.get("category") as string) || "unacategorized";

    const category = toTitleCase(rawCategory);
    const categorySlug = slugify(rawCategory);

    const files = formData.getAll("photos").filter(Boolean) as File[];
    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { error: `Up to ${MAX_FILES} photos.` },
        { status: 400 },
      );
    }

    // Store object paths in DB (not signed URLs)
    const photoPaths: string[] = [];

    for (const f of files) {
      if (!ALLOWED.has(f.type)) {
        return NextResponse.json(
          { error: "Only JPG/PNG/WEBP images are allowed." },
          { status: 400 },
        );
      }

      if (f.size > MAX_EACH_BYTES) {
        return NextResponse.json(
          { error: "Each image must be 5MB or smaller." },
          { status: 400 },
        );
      }

      const prov = "supplies";
      const objectPath = await uploadReviewImage({
        categorySlug,
        file: f,
        prov,
      });
      photoPaths.push(objectPath);
    }

    const rawName = String(formData.get("name"));
    const name = toTitleCase(rawName);

    const supplyDoc = {
      name: name,
      price: parseFloat(formData.get("price") as string),
      store: formData.get("store"),
      description: formData.get("description"),
      link: formData.get("link"),

      category,
      categorySlug,

      photos: photoPaths,
      size: String(formData.get("size")),
      createdAt: new Date(),
      qty: formData.get("qty"),
    };

    const result = await db.collection("supplies").insertOne(supplyDoc);

    return NextResponse.json({ ok: true, id: result.insertedId });
  } catch (err) {
    console.error("POST Error:", err);
    return NextResponse.json({ error: "Failed to save item" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const db = await getDb();

    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category");
    const limit = Number(searchParams.get("limit")) || 0;

    const filter: { categorySlug?: string } = {};

    if (category) {
      filter.categorySlug = category;
    }

    const query = db
      .collection("supplies")
      .find(filter)
      .sort({ createdAt: -1 });

    if (limit > 0) {
      query.limit(limit);
    }

    const items = await query.toArray();

    const withSignedUrls = await Promise.all(
      items.map(async (item) => ({
        ...item,
        photos: await Promise.all(
          (item.photos ?? []).map((objectPath: string) =>
            signImage(objectPath, SIGNED_URL_EXPIRES_SECONDS),
          ),
        ),
      })),
    );

    return NextResponse.json(withSignedUrls);
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
