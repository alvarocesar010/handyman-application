import Image from "next/image";
import Link from "next/link";
import { getItemBySlug } from "@/lib/store/getItemBySlug";
import { Supply } from "@/lib/store/types";

type Props = {
  params: {
    slug: string;
    product: string;
  };
};

export default async function ProductPage({ params }: Props) {
  const item: Supply | null = await getItemBySlug(params.slug, params.product);

  if (!item) {
    return <div className="p-10">Product not found</div>;
  }
  const price = item.storeEntries?.[0]?.price;

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
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
        {/* LEFT - IMAGE */}
        <div>
          <div className="relative aspect-square bg-white rounded-xl overflow-hidden">
            <Image
              src={item.photos?.[0] || "/placeholder.png"}
              alt={item.name}
              fill
              className="object-contain p-6"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 mt-4">
            {item.photos.map((photo, i) => (
              <div
                key={i}
                className="relative w-20 h-20 bg-white rounded border"
              >
                <Image src={photo} alt="" fill className="object-contain p-2" />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT - INFO */}
        <div>
          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900">{item.name}</h1>

          {/* Price */}
          <p className="text-3xl font-semibold text-gray-900 mt-4">
            €{getPrice(price)}
          </p>

          {/* Delivery mock */}
          <div className="mt-6 p-4 border rounded-lg bg-white">
            <p className="font-medium">Home delivery</p>
            <p className="text-sm text-gray-500">
              Available from our partner store
            </p>
          </div>

          {/* CTA */}
          <Link
            href={"#"}
            target="_blank"
            className="block mt-6 bg-green-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Add to cart
          </Link>

          {/* Description */}
          <div className="mt-8">
            <h2 className="font-semibold text-lg mb-2">Description</h2>

            <p className="text-gray-600 whitespace-pre-line">
              {item.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
