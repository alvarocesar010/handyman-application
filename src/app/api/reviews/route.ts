import { NextResponse } from "next/server";
import type { Review } from "@/types/review";
import { uploadReviewImage } from "@/lib/gcs";
import { getReviewsByService } from "@/lib/reviews";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const MAX_FILES = 5;
const MAX_EACH_BYTES = 5 * 1024 * 1024;
const MAX_OPINION_LEN = 500;

// formats for consistent display
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

// 🔥 your public bucket URL
const BASE_URL = "https://storage.googleapis.com/handyman-reviews-images";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const service = (searchParams.get("service") ?? "").trim();

    if (!service) {
      return NextResponse.json({ error: "Missing service" }, { status: 400 });
    }

    const data = await getReviewsByService(service);

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load reviews" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const serviceSlug = String(form.get("serviceSlug") ?? "").trim();
    const customerName = String(form.get("customerName") ?? "").trim();
    const rating = Number(form.get("rating") ?? 0);
    const opinion = String(form.get("opinion") ?? "").trim();

    if (!serviceSlug || !customerName || !rating || !opinion) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 },
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid rating." }, { status: 400 });
    }

    if (opinion.length > MAX_OPINION_LEN) {
      return NextResponse.json(
        { error: `Opinion must be ${MAX_OPINION_LEN} characters or less.` },
        { status: 400 },
      );
    }

    const files = form.getAll("photos").filter(Boolean) as File[];

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { error: `Up to ${MAX_FILES} photos.` },
        { status: 400 },
      );
    }

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

      const objectPath = await uploadReviewImage({
        serviceSlug,
        file: f,
        prov: "reviews",
      });

      photoPaths.push(objectPath);
    }

    const createdAtISO = new Date().toISOString();

    const doc: Omit<Review, "_id"> = {
      serviceSlug,
      customerName,
      rating,
      opinion,
      photoUrls: photoPaths.map((path) => ({
        id: new ObjectId().toString(),
        filename: path,
      })), // still store paths only
      createdAtISO,
    };

    const db = await getDb();
    const col = db.collection("reviews");

    const result = await col.insertOne(doc);
    const inserted = await col.findOne({ _id: result.insertedId });

    if (!inserted) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // ✅ convert to public URLs (no signing)
    const publicInserted = {
      id: inserted._id.toString(),
      serviceSlug: inserted.serviceSlug,
      customerName: inserted.customerName,
      rating: inserted.rating,
      opinion: inserted.opinion,
      photoUrls: (inserted.photoUrls ?? []).map(
        (p: { id: string; filename: string }) => ({
          id: p.id,
          filename: `${BASE_URL}/${p.filename}`,
        }),
      ),
      createdAtISO: inserted.createdAtISO,
    };

    return NextResponse.json({ review: publicInserted });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save review" },
      { status: 500 },
    );
  }
}
