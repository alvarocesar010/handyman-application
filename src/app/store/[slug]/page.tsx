import Image from "next/image";
import Link from "next/link";
import { getSuppliesBySlug } from "@/lib/store/getSuppliesBySlug";
import { Supply } from "@/lib/store/types";

type Props = {
  params: { slug: string };
};

export default async function StoreSlugPage({ params }: Props) {
  const supplies: Supply[] = await getSuppliesBySlug(params.slug);

  function getPrice(price: number): string {
    let finalPrice: number;

    if (price >= 100) {
      finalPrice = price * 1.2;
    } else if (price >= 50) {
      finalPrice = price * 1.35;
    } else {
      finalPrice = price * 1.5;
    }

    return finalPrice.toFixed(2);
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h1 className="text-2xl font-bold mb-8 capitalize">
          {params.slug.replace("-", " ")}
        </h1>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {supplies.map((item) => {
            const price = item.storeEntries?.[0]?.price;

            return (
              <Link
                key={item._id}
                href={item.storeEntries?.[0]?.link || "#"}
                target="_blank"
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
              >
                {/* Image */}
                <div className="relative aspect-square bg-gray-100">
                  <Image
                    src={item.photos?.[0] || "/placeholder.png"}
                    alt={item.name}
                    fill
                    className="object-contain p-4"
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  <h2 className="text-sm font-medium text-gray-800 line-clamp-2">
                    {item.name}
                  </h2>

                  {/* Price */}
                  <p className="mt-2 text-lg font-semibold text-gray-900">
                    €{getPrice(price)}
                  </p>

                  {/* Optional */}
                  <p className="text-xs text-gray-500 mt-1">View product →</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
