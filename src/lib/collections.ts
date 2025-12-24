import type { Collection } from "mongodb";
import type { Review } from "@/types/review";
import { getDb } from "@/lib/mongodb"; // <-- change if your helper has a different path/name

export async function reviewsCollection(): Promise<Collection<Review>> {
  const db = await getDb();
  return db.collection<Review>("reviews");
}
