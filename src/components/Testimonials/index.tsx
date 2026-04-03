// src/components/Testimonials/index.tsx

import { getReviewsByService } from "@/lib/reviews";

import ReviewsBox from "../ReviewsBox";
export default async function Testimonials() {
  const reviews = await getReviewsByService("AllReviews");

  return (
    <section className="bg-white p-4">
      <div className="mx-auto max-w-5xl px-4 sm:px-6" id="reviews">
        <h2 className="mb-10 text-center text-3xl font-bold text-slate-900">
          What Our Customers Say
        </h2>
        <div >
          <ReviewsBox
            initialReviews={reviews.reviews}
            serviceSlug={"AllReviews"}
          />
        </div>
      </div>
    </section>
  );
}
