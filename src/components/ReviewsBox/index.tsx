"use client";

import { useState } from "react";
import ReviewsList from "./ReviewsList";
import ReviewForm from "./ReviewForm";
import type { Review } from "@/types/review";

type Props = {
  initialReviews: Review[];
  serviceSlug: string;
};

export default function ReviewsBox({ initialReviews, serviceSlug }: Props) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  function handleNewReview(newReview: Review) {
    setReviews((prev) => [newReview, ...prev]);
  }

  return (
    <div className="space-y-3 grid md:gap-3 md:grid-cols-2">
      <ReviewsList reviews={reviews} />
      <ReviewForm serviceSlug={serviceSlug} onSuccess={handleNewReview} />
    </div>
  );
}
