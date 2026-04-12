import { getDb } from "../mongodb";

// ✅ Types
export type SubCategory = {
  _id: string;
  slug: string;
  href: string;
  photoUrl: string;
  photoPath?: string;
  previewUrl?: string;
};

export type CategoryDoc = {
  _id: string;
  category: string;
  subCategories: SubCategory[];
};

// ✅ Typed function
export async function GetCategoryBySlug(): Promise<CategoryDoc[]> {
  const db = await getDb();

  const topics = await db
    .collection<CategoryDoc>("categoriesStore") // ✅ THIS FIXES EVERYTHING
    .find({})
    .toArray();

  return topics;
}
