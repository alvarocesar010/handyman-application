// lib/reviews.ts
import { getDb } from "@/lib/mongodb";
import { Review } from "@/types/review";

// 🔥 put your bucket public URL here
const BASE_URL = "https://storage.googleapis.com/handyman-reviews-images";

export async function getReviewsByService(slug: string) {
  const db = await getDb();

  const filter = slug === "AllReviews" ? {} : { serviceSlug: slug };

  const reviewsDb = await db
    .collection("reviews")
    .find(filter)
    .sort({ createdAtISO: -1 })
    .limit(30)
    .toArray();

  const count = reviewsDb.length;

  const avg =
    count > 0 ? reviewsDb.reduce((acc, r) => acc + r.rating, 0) / count : 0;

  const reviews: Review[] = reviewsDb.map((r) => ({
    _id: r._id.toString(),
    serviceSlug: r.serviceSlug,
    customerName: r.customerName,
    rating: r.rating,
    opinion: r.opinion,

    // ✅ convert object path → public URL
    photoUrls: (r.photoUrls ?? []).map(
      (p: { id: string; filename: string }) => ({
        id: p.id,
        filename: `${BASE_URL}/${p.filename}`,
      }),
    ),

    createdAtISO: r.createdAtISO,
  }));

  return {
    reviews,
    stars: {
      count,
      avg: Number(avg.toFixed(1)),
    },
  };
}
