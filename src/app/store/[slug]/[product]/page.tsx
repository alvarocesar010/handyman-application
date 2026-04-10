import Image from "next/image";
import { getItemBySlug } from "@/lib/store/getItemBySlug";
import Stars from "@/components/ReviewsBox/Stars.tsx";
import ReviewsBox from "@/components/ReviewsBox";
import { getReviewsByService } from "@/lib/reviews";
import AddToTrolley from "@/components/Buttons/AddToTrolley";

type Props = {
  params: Promise<{
    slug: string;
    product: string;
  }>;
};

export default async function ProductPage({ params }: Props) {
  const { slug, product } = await params;

  const item = await getItemBySlug(slug, product);

  const reviews = await getReviewsByService(product);

  if (!item) {
    return <div className="p-10">Product not found</div>;
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

          {/* Stars reviews */}
          <Stars avg={reviews.stars.avg} count={reviews.stars.count} />

          {/* Price */}
          <p className="text-3xl font-semibold text-gray-900 mt-4">
            €{item.sellingPrice}
          </p>

          {/* Delivery mock */}
          <div className="mt-6 p-4 border rounded-lg bg-white">
            <p className="font-medium">Home delivery</p>
            <p className="text-sm text-gray-500">
              Available in Dublin & surrounding areas
            </p>
          </div>

          {/* CTA */}
          <AddToTrolley item={item} />

          {/* Description */}
          <div className="mt-8">
            <h2 className="font-semibold text-lg mb-2">Description</h2>

            <p className="text-gray-600 whitespace-pre-line">
              {item.description}
            </p>
          </div>

          {/* Review box */}
        </div>
      </div>
      <div id="reviews" className="max-w-6xl mx-auto my-6">
        <ReviewsBox serviceSlug={product} initialReviews={reviews.reviews} />
      </div>
    </div>
  );
}
