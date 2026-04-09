import Link from "next/link";
import { GetCategoryBySlug, CategoryDoc } from "@/lib/store/getCategoryBySlug";
import Image from "next/image";

function formatSlug(text: string): string {
  return text
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

export default async function Store() {
  const items: CategoryDoc[] = await GetCategoryBySlug();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Grid */}
        <div className="grid gap-8">
          {items.map((item) => (
            <div
              key={item.category}
              className="bg-white rounded-3xl p-6 shadow-md hover:shadow-lg transition border border-gray-100"
            >
              {/* Category title */}
              <h2 className="text-xl font-semibold mb-6 text-gray-800">
                {item.category}
              </h2>

              {/* Sub-categories */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {item.subCategories.map((sub) => (
                  <Link
                    key={sub.slug}
                    href={sub.href}
                    className="relative aspect-[16/9] rounded-2xl overflow-hidden group"
                  >
                    {/* Image */}
                    <Image
                      src={sub.photoUrl}
                      alt={sub.slug}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition" />

                    {/* Text */}
                    <div className="relative z-10 flex items-center justify-center h-full">
                      <p className="text-white font-semibold text-lg text-center px-2">
                        {formatSlug(sub.slug)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
