// app/admin/categories/page.tsx
import { GetCategoryBySlug } from "@/lib/store/getCategoryBySlug";
import CategoryCard from "./CategoryCard";
import AddCategoryButton from "@/components/Buttons/AddCategoryButton";

export default async function CategoryPage() {
  const categories = await GetCategoryBySlug();

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* HEADER SECTION - This was missing/messed up */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Store Management</h1>
          <p className="text-gray-500 text-sm">
            Manage your categories and items
          </p>
        </div>

        {/* Only one button, correctly placed at the top level */}
        <AddCategoryButton />
      </div>

      {/* THE GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((item) => (
          <CategoryCard
            key={item._id.toString()}
            categoryItem={JSON.parse(JSON.stringify(item))}
          />
        ))}
      </div>
    </div>
  );
}
