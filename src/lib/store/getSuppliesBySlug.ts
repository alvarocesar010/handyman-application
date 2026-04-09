import { getDb } from "../mongodb";
import { Supply } from "@/lib/store/types";

const BASE_URL = "https://storage.googleapis.com/handyman-reviews-images";

export async function getSuppliesBySlug(slug: string): Promise<Supply[]> {
  const db = await getDb();

  const supplies = await db
    .collection<Supply>("supplies")
    .find({ serviceSlug: slug })
    .toArray();

  const suppliesWithPhotos = supplies.map((item) => ({
    ...item,
    photos: item.photos.map((photo) =>
      photo.startsWith("http") ? photo : `${BASE_URL}/${photo}`,
    ),
    storeEntries: item.storeEntries.filter(
      (s) => s.storeName === "Dubliner Handyman",
    ),
  }));

  return suppliesWithPhotos;
}
