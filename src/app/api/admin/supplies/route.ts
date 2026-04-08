import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId, UpdateFilter } from "mongodb";
import { Storage, Bucket } from "@google-cloud/storage";
import { uploadReviewImage } from "@/lib/gcs";
import sharp from "sharp";

/** --- Strict Interfaces --- **/
interface InventoryItem {
  _id: string;
  size: string;
  qty: number;
}

interface StoreEntry {
  storeName: string;
  link: string;
  price: number;
  inventory: InventoryItem[];
}

interface SupplyPayload {
  name: string;
  description: string;
  category: string;
  color?: string;
  storeEntries: StoreEntry[];
}

interface UpdateDocument {
  name: string;
  description: string;
  category: string;
  serviceSlug: string;
  color: string;
  storeEntries: StoreEntry[];
  updatedAt: Date;
  photos?: string[];
}

/** --- Constants & Validation --- **/
const MAX_FILES = 5;
const MAX_EACH_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

/** --- Helper Functions --- **/
function toTitleCase(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function getBucket(): Bucket {
  const bucketName = process.env.GCS_BUCKET_NAME;
  if (!bucketName) throw new Error("GCS_BUCKET_NAME is not defined");
  const storage = new Storage({
    projectId: process.env.GCS_PROJECT_ID,
    keyFilename:
      process.env.DEV_MODE === "true"
        ? process.env.GOOGLE_APPLICATION_CREDENTIALS
        : undefined,
  });
  return storage.bucket(bucketName);
}

const BASE_URL = "https://storage.googleapis.com/handyman-reviews-images";

/** --- API Methods --- **/

export async function POST(req: Request) {
  const formData = await req.formData();
  const db = await getDb();

  const payloadRaw = formData.get("payload");
  if (!payloadRaw)
    return NextResponse.json({ error: "Missing payload" }, { status: 400 });

  const payload: SupplyPayload = JSON.parse(String(payloadRaw));
  const serviceSlug = slugify(payload.category);

  const files = formData.getAll("photos").filter(Boolean) as File[];
  if (files.length > MAX_FILES)
    return NextResponse.json(
      { error: `Max ${MAX_FILES} photos.` },
      { status: 400 },
    );

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

    // ✅ OPTIMIZATION STARTS HERE
    const buffer = Buffer.from(await f.arrayBuffer());

    const optimizedBuffer = await sharp(buffer)
      .resize({ width: 1600 }) // max width
      .webp({ quality: 85 }) // compress
      .toBuffer();

    // upload optimized image
    const objectPath = await uploadReviewImage({
      serviceSlug,
      file: optimizedBuffer,
      contentType: "image/webp", // 🔥 REQUIRED
      prov: "supplies",
    });

    photoPaths.push(objectPath);
  }

  const supplyDoc = {
    name: toTitleCase(payload.name),
    description: payload.description,
    category: toTitleCase(payload.category),
    serviceSlug,
    color: payload.color || "",
    photos: photoPaths,
    storeEntries: payload.storeEntries.map((entry) => ({
      ...entry,
      price: parseFloat(String(entry.price)) || 0,
      inventory: entry.inventory.map((inv) => ({
        ...inv,
        _id: inv._id || new ObjectId().toString(),
        qty: parseInt(String(inv.qty)) || 0,
      })),
    })),
    updatedAt: new Date(),
    createdAt: new Date(),
  };

  const result = await db.collection("supplies").insertOne(supplyDoc);
  return NextResponse.json({ ok: true, id: result.insertedId });
}

export async function PUT(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id || !ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Valid ID required" }, { status: 400 });
  }

  try {
    const formData = await req.formData();
    const payloadRaw = formData.get("payload");
    if (!payloadRaw)
      return NextResponse.json({ error: "Missing payload" }, { status: 400 });

    const payload: SupplyPayload = JSON.parse(String(payloadRaw));
    const db = await getDb();

    // 1. Process Photos
    const newPhotoPaths: string[] = [];
    const files = formData.getAll("photos").filter(Boolean) as File[];
    const serviceSlug = slugify(payload.category);

    if (files.length > 0) {
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

        // ✅ OPTIMIZATION STARTS HERE
        const buffer = Buffer.from(await f.arrayBuffer());

        const optimizedBuffer = await sharp(buffer)
          .resize({ width: 1600 }) // max width
          .webp({ quality: 85 }) // compress
          .toBuffer();

        // upload optimized image
        const objectPath = await uploadReviewImage({
          serviceSlug,
          file: optimizedBuffer,
          contentType: "image/webp", // 🔥 REQUIRED
          prov: "reviews",
        });

        newPhotoPaths.push(objectPath);
      }
    }

    // 2. Format Data
    const updateData: UpdateDocument = {
      name: toTitleCase(payload.name),
      description: payload.description,
      category: toTitleCase(payload.category),
      serviceSlug: slugify(payload.category),
      color: payload.color || "",
      storeEntries: payload.storeEntries.map((entry) => ({
        ...entry,
        price: parseFloat(String(entry.price)) || 0,
        inventory: entry.inventory.map((inv) => ({
          ...inv,
          _id: inv._id || new ObjectId().toString(),
          qty: parseInt(String(inv.qty)) || 0,
        })),
      })),
      updatedAt: new Date(),
    };

    if (newPhotoPaths.length > 0) {
      updateData.photos = newPhotoPaths;
    }

    // --- FIX IS HERE: Change 'id' to '_id' ---
    const result = await db
      .collection("supplies")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData as UpdateFilter<UpdateDocument> },
      );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const limit = Number(searchParams.get("limit")) || 0;
    const filter: { serviceSlug?: string } = category
      ? { serviceSlug: category }
      : {};
    console.log(limit);
    const getItems = await db
      .collection("supplies")
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    const items = getItems.map((p) => {
      return {
        ...p,
        photos: (p.photos ?? []).map((p: string) => `${BASE_URL}/${p}`),
      };
    });
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id)
      return NextResponse.json({ error: "ID required" }, { status: 400 });

    const db = await getDb();
    const item = await db
      .collection("supplies")
      .findOne({ _id: new ObjectId(id) });

    if (item?.photos && Array.isArray(item.photos)) {
      const bucket = getBucket();
      for (const path of item.photos) {
        try {
          await bucket.file(path).delete();
        } catch (e) {
          console.error("GCS delete error", e);
        }
      }
    }

    await db.collection("supplies").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
