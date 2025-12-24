import type { Collection } from "mongodb";
import { getDb } from "@/lib/mongodb";
import type { Review } from "@/types/review";

export async function reviewsCollection(): Promise<Collection<Review>> {
  const db = await getDb();
  return db.collection<Review>("reviews");
}
