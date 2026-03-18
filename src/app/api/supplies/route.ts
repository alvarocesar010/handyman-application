import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { Storage, Bucket } from "@google-cloud/storage";
import { uploadReviewImage, signImage } from "@/lib/gcs";

/** --- Strict Interfaces --- **/
interface InventoryItem {
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
const SIGNED_URL_EXPIRES_SECONDS = 7 * 24 * 60 * 60;

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

/** --- API Methods --- **/

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("x-admin-secret");
    if (authHeader !== process.env.NEXT_PUBLIC_ADMIN_ROUTE_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
      if (!ALLOWED.has(f.type))
        return NextResponse.json(
          { error: "Invalid file type." },
          { status: 400 },
        );
      if (f.size > MAX_EACH_BYTES)
        return NextResponse.json(
          { error: "Image too large." },
          { status: 400 },
        );

      const objectPath = await uploadReviewImage({
        serviceSlug,
        file: f,
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
          qty: parseInt(String(inv.qty)) || 0,
        })),
      })),
      updatedAt: new Date(),
      createdAt: new Date(),
    };

    const result = await db.collection("supplies").insertOne(supplyDoc);
    return NextResponse.json({ ok: true, id: result.insertedId });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const authHeader = req.headers.get("x-admin-secret");
    if (authHeader !== process.env.NEXT_PUBLIC_ADMIN_ROUTE_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id || !ObjectId.isValid(id))
      return NextResponse.json({ error: "Valid ID required" }, { status: 400 });

    const formData = await req.formData();
    const payloadRaw = formData.get("payload");
    if (!payloadRaw)
      return NextResponse.json({ error: "Missing payload" }, { status: 400 });

    const payload: SupplyPayload = JSON.parse(String(payloadRaw));
    const db = await getDb();

    // 1. Process Photos with Validation (Missing logic added)
    const newPhotoPaths: string[] = [];
    const files = formData.getAll("photos").filter(Boolean) as File[];

    if (files.length > 0) {
      if (files.length > MAX_FILES)
        return NextResponse.json(
          { error: `Max ${MAX_FILES} photos.` },
          { status: 400 },
        );
      const serviceSlug = slugify(payload.category);
      for (const f of files) {
        if (!ALLOWED.has(f.type))
          return NextResponse.json(
            { error: "Invalid file type." },
            { status: 400 },
          );
        if (f.size > MAX_EACH_BYTES)
          return NextResponse.json(
            { error: "Image too large." },
            { status: 400 },
          );

        const path = await uploadReviewImage({
          serviceSlug,
          file: f,
          prov: "supplies",
        });
        newPhotoPaths.push(path);
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
          qty: parseInt(String(inv.qty)) || 0,
        })),
      })),
      updatedAt: new Date(),
    };

    if (newPhotoPaths.length > 0) updateData.photos = newPhotoPaths;

    await db
      .collection("supplies")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    return NextResponse.json({ ok: true });
  } catch {
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

    const items = await db
      .collection("supplies")
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    const withSignedUrls = await Promise.all(
      items.map(async (item) => ({
        ...item,
        photos: await Promise.all(
          ((item.photos as string[]) ?? []).map((path) =>
            signImage(path, SIGNED_URL_EXPIRES_SECONDS),
          ),
        ),
      })),
    );

    return NextResponse.json(withSignedUrls);
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
