import { NextResponse } from "next/server";
import type { Review } from "@/types/review";
import { reviewsCollection } from "@/lib/collections";
import { uploadReviewImage, signImage } from "@/lib/gcs";

const MAX_FILES = 5;
const MAX_EACH_BYTES = 5 * 1024 * 1024;
const MAX_OPINION_LEN = 500;

// Allowed formats for consistent display
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

// Signed URL expiry: 7 days (in seconds)
const SIGNED_URL_EXPIRES_SECONDS = 7 * 24 * 60 * 60;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const service = (searchParams.get("service") ?? "").trim();

    if (!service) {
      return NextResponse.json({ error: "Missing service" }, { status: 400 });
    }

    const col = await reviewsCollection();

    // Reviews contain photoUrls as object paths (e.g., "reviews/slug/123.jpg")
    const reviews = await col
      .find({ serviceSlug: service })
      .sort({ createdAtISO: -1 })
      .limit(200)
      .toArray();

    // Convert object paths -> signed URLs for the client
    const withSignedUrls = await Promise.all(
      reviews.map(async (r) => ({
        ...r,
        photoUrls: await Promise.all(
          (r.photoUrls ?? []).map((objectPath) =>
            signImage(objectPath, SIGNED_URL_EXPIRES_SECONDS)
          )
        ),
      }))
    );

    return NextResponse.json({ reviews: withSignedUrls });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load reviews" },
      { status: 500 }
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
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid rating." }, { status: 400 });
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

    // Store object paths in DB (not signed URLs)
    const photoPaths: string[] = [];

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

      const objectPath = await uploadReviewImage({ serviceSlug, file: f });
      photoPaths.push(objectPath);
    }

    const createdAtISO = new Date().toISOString();

    const doc: Omit<Review, "_id"> = {
      serviceSlug,
      customerName,
      rating,
      opinion,
      photoUrls: photoPaths, // object paths
      createdAtISO,
    };

    const col = await reviewsCollection();
    const result = await col.insertOne(doc);

    // Return inserted review with signed URLs (nice UX)
    const inserted = await col.findOne({ _id: result.insertedId });

    if (!inserted) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const signedInserted = {
      ...inserted,
      photoUrls: await Promise.all(
        (inserted.photoUrls ?? []).map((p) =>
          signImage(p, SIGNED_URL_EXPIRES_SECONDS)
        )
      ),
    };

    return NextResponse.json({ review: signedInserted });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save review" },
      { status: 500 }
    );
  }
}
