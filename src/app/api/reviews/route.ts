import { NextResponse } from "next/server";
import path from "path";
import crypto from "crypto";
import { mkdir, writeFile } from "fs/promises";
import { reviewsCollection } from "@/lib/collections";

const MAX_FILES = 5;
const MAX_EACH_BYTES = 5 * 1024 * 1024;
const MAX_OPINION_LEN = 500;

// Recommended for reliable display (HEIC often breaks preview)
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

function safeSlug(slug: string) {
  return slug.toLowerCase().replace(/[^a-z0-9-_]/g, "");
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const service = searchParams.get("service") ?? "";

  if (!service) {
    return NextResponse.json({ error: "Missing service" }, { status: 400 });
  }

  const col = await reviewsCollection();
  const reviews = await col
    .find({ serviceSlug: service })
    .sort({ createdAtISO: -1 })
    .limit(200)
    .toArray();

  return NextResponse.json({ reviews });
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const serviceSlug = String(form.get("serviceSlug") ?? "").trim();
    const customerName = String(form.get("customerName") ?? "").trim();
    const rating = Number(form.get("rating") ?? 0);

    const opinion = String(form.get("opinion") ?? "").trim();

    if (!serviceSlug || !customerName || !rating) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid rating." }, { status: 400 });
    }

    if (!opinion) {
      return NextResponse.json(
        { error: "Opinion is required." },
        { status: 400 }
      );
    }

    if (opinion.length > MAX_OPINION_LEN) {
      return NextResponse.json(
        { error: `Opinion must be ${MAX_OPINION_LEN} characters or less.` },
        { status: 400 }
      );
    }

    const files = form.getAll("photos").filter(Boolean) as File[];
    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { error: `Up to ${MAX_FILES} photos.` },
        { status: 400 }
      );
    }

    const slug = safeSlug(serviceSlug);
    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "reviews",
      slug
    );

    await mkdir(uploadDir, { recursive: true });

    const photoUrls: string[] = [];

    for (const f of files) {
      if (!ALLOWED.has(f.type)) {
        return NextResponse.json(
          { error: "Only JPG/PNG/WEBP images are allowed." },
          { status: 400 }
        );
      }

      if (f.size > MAX_EACH_BYTES) {
        return NextResponse.json(
          { error: "Each image must be 5MB or smaller." },
          { status: 400 }
        );
      }

      const ext =
        f.type === "image/jpeg"
          ? "jpg"
          : f.type === "image/png"
          ? "png"
          : "webp";

      const fileName = `${Date.now()}-${crypto
        .randomBytes(8)
        .toString("hex")}.${ext}`;

      const filePath = path.join(uploadDir, fileName);
      const buf = Buffer.from(await f.arrayBuffer());
      await writeFile(filePath, buf);

      photoUrls.push(`/uploads/reviews/${slug}/${fileName}`);
    }

    const createdAtISO = new Date().toISOString();

    const col = await reviewsCollection();
    const result = await col.insertOne({
      serviceSlug,
      customerName,
      rating,
      opinion,
      photoUrls,
      createdAtISO,
    });

    const inserted = await col.findOne({ _id: result.insertedId });

    return NextResponse.json({ review: inserted });
  } catch (err) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Failed to create review.",
      },
      { status: 500 }
    );
  }
}
