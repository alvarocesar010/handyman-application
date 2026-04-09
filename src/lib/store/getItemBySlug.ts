import { getDb } from "../mongodb";
import { Supply } from "./types";

const BASE_URL = "https://storage.googleapis.com/handyman-reviews-images";

export async function getItemBySlug(
  serviceSlug: string,
  itemSlug: string,
): Promise<Supply | null> {
  const db = await getDb();

  const item = await db.collection<Supply>("supplies").findOne({
    serviceSlug,
    itemSlug,
  });

  if (!item) return null;

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
