import { getDb } from "../mongodb";
import { Supply } from "./types";

const BASE_URL = "https://storage.googleapis.com/handyman-reviews-images";

export async function getItemBySlug(
  serviceSlug: string,
  productSlug: string,
): Promise<Supply | null> {
  const db = await getDb();

  const supplies = await db
    .collection<Supply>("supplies")
    .find({ serviceSlug })
    .toArray();

  const item = supplies.find((item) => {
    const slug = item.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    return slug === productSlug;
  });

  if (!item) return null;

  // ✅ FIX: transform photos AFTER finding item
  return {
    ...item,
    photos: item.photos.map((photo) =>
      photo.startsWith("http") ? photo : `${BASE_URL}/${photo}`,
    ),
    storeEntries: item.storeEntries.filter(
      (s) => s.storeName === "Dubliner Handyman",
    ),
  };
}
