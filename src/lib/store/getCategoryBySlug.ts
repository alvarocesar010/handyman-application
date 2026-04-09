import { getDb } from "../mongodb";

// ✅ Types
export type SubCategory = {
  slug: string;
  href: string;
  photoUrl: string;
};

export type CategoryDoc = {
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
